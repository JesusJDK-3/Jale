import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  INITIAL_CONVERSATIONS,
  type ChatConversation,
  type ChatMessage,
  type DeliveryPayload,
  type ProposalPayload,
  type ReviewPayload,
} from "../chatData";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatInputBar } from "../components/chat/ChatInputBar";
import { ChatMessageItem } from "../components/chat/ChatMessageItem";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { EscrowTopBanner } from "../components/chat/EscrowTopBanner";
import { PaymentModal } from "../components/chat/PaymentModal";
import { ProposalModal } from "../components/chat/ProposalModal";
import { RevisionModal } from "../components/chat/RevisionModal";
import { Toast } from "../components/Toast";

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Conversations State
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const activeId = id || conversations[0].id;

  const activeConversation =
    conversations.find((c) => c.id.toLowerCase() === activeId.toLowerCase()) ||
    conversations[0];

  // Modals state
  const [paymentModalData, setPaymentModalData] = useState<{
    open: boolean;
    amount: number;
  }>({ open: false, amount: 0 });

  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [revisionModalData, setRevisionModalData] = useState<{
    open: boolean;
    delivery?: DeliveryPayload;
  }>({ open: false });

  const [toast, setToast] = useState<{ message: string; visible: boolean; type: "saved" | "removed" }>({
    message: "",
    visible: false,
    type: "saved",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation.messages]);

  const showToast = (message: string) => {
    setToast({ message, visible: true, type: "saved" });
    window.setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  // 1. Send regular text message
  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
      type: "text",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: "Ahora",
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Realistic auto-reply from student after 1.4s
    window.setTimeout(() => {
      const replies = [
        "¡Entendido! Me pongo a revisar eso para incluirlo en la entrega.",
        "Perfecto, tomo nota de ese detalle.",
        "Listo, gracias por la confirmación.",
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];

      const studentReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "other",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
        type: "text",
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: "Ahora",
              messages: [...c.messages, studentReply],
            };
          }
          return c;
        })
      );
    }, 1400);
  };

  // 2. Accept Proposal -> generates Payment Card
  const handleAcceptProposal = (proposal: ProposalPayload) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMessages = c.messages.map((m) => {
            if (m.type === "proposal" && m.proposal) {
              return {
                ...m,
                proposal: { ...m.proposal, status: "accepted" as const },
              };
            }
            return m;
          });

          const paymentMessage: ChatMessage = {
            id: `pay-${Date.now()}`,
            sender: "system",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "payment_gate",
            payment: {
              amount: proposal.price,
              platformFee: 0,
              total: proposal.price,
              status: "pending",
            },
          };

          return {
            ...c,
            status: "proposal_sent",
            lastMessage: `Propuesta de S/ ${proposal.price} aceptada. Pendiente de pago Escrow.`,
            messages: [...updatedMessages, paymentMessage],
          };
        }
        return c;
      })
    );

    showToast("✓ Propuesta aceptada. Procede con el depósito en custodia segura.");
  };

  // 3. Confirm Payment Escrow
  const handleConfirmPayment = () => {
    const amount = paymentModalData.amount || activeConversation.escrowAmount || 45;
    setPaymentModalData({ open: false, amount: 0 });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMessages = c.messages.map((m) => {
            if (m.type === "payment_gate" && m.payment) {
              return {
                ...m,
                payment: { ...m.payment, status: "paid" as const },
              };
            }
            return m;
          });

          const escrowMessage: ChatMessage = {
            id: `escrow-${Date.now()}`,
            sender: "system",
            text: `🔒 Fondos de S/ ${amount.toFixed(2)} retenidos con éxito en Escrow Jale.pe. El estudiante comenzará a trabajar. Tu dinero está 100% protegido.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "escrow_active",
          };

          const studentAcknowledge: ChatMessage = {
            id: `ack-${Date.now()}`,
            sender: "other",
            text: "¡Genial! Ya recibí la confirmación de fondos en custodia. Me pongo a trabajar de inmediato en tus entregables.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "text",
          };

          return {
            ...c,
            escrowActive: true,
            escrowAmount: amount,
            status: "escrow_funded",
            lastMessage: `Pago de S/ ${amount.toFixed(2)} retenido en custodia.`,
            messages: [...updatedMessages, escrowMessage, studentAcknowledge],
          };
        }
        return c;
      })
    );

    showToast(`🔒 S/ ${amount.toFixed(2)} retenidos en custodia Escrow`);
  };

  // 4. Simulate sending a delivery file
  const handleSimulateDelivery = () => {
    const deliveryMessage: ChatMessage = {
      id: `deliv-${Date.now()}`,
      sender: "other",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
      type: "delivery",
      delivery: {
        fileName: "Entregables_Finales_Jale.zip",
        fileSize: "14.2 MB",
        fileType: "zip",
        previewTitle: "Archivos vectoriales + Plantillas editables",
        note: `¡Hola! Aquí tienes la entrega con todas las especificaciones acordadas. Revisa los archivos y aprueba para liberar los fondos cuando estés conforme.`,
        revisionCount: 0,
        maxRevisions: 2,
        status: "pending_review",
      },
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            status: "delivered",
            lastMessage: "📦 Nueva entrega de archivos enviada al chat.",
            messages: [...c.messages, deliveryMessage],
          };
        }
        return c;
      })
    );

    showToast("📦 Archivo de entrega recibido en el chat");
  };

  // 5. Approve Delivery -> Payout Released + Review Prompt
  const handleApproveDelivery = () => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMessages = c.messages.map((m) => {
            if (m.type === "delivery" && m.delivery) {
              return {
                ...m,
                delivery: { ...m.delivery, status: "approved" as const },
              };
            }
            return m;
          });

          const payoutMessage: ChatMessage = {
            id: `payout-${Date.now()}`,
            sender: "system",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "payout_released",
          };

          const reviewMessage: ChatMessage = {
            id: `review-${Date.now()}`,
            sender: "system",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "review_prompt",
            review: {
              rating: 5,
              comment: "",
              submitted: false,
            },
          };

          return {
            ...c,
            escrowActive: false,
            status: "completed",
            lastMessage: "🎉 Entrega aprobada · Pago liberado al estudiante.",
            messages: [...updatedMessages, payoutMessage, reviewMessage],
          };
        }
        return c;
      })
    );

    showToast("🎉 ¡Entrega aprobada! Pago liberado al estudiante.");
  };

  // 6. Request revision
  const handleConfirmRevision = (feedbackText: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMessages = c.messages.map((m) => {
            if (m.type === "delivery" && m.delivery) {
              return {
                ...m,
                delivery: {
                  ...m.delivery,
                  revisionCount: m.delivery.revisionCount + 1,
                  status: "changes_requested" as const,
                },
              };
            }
            return m;
          });

          const revisionMessage: ChatMessage = {
            id: `rev-${Date.now()}`,
            sender: "me",
            text: `⚠️ Solicitud de ajustes: ${feedbackText}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "text",
          };

          return {
            ...c,
            lastMessage: "Ajustes solicitados al estudiante.",
            messages: [...updatedMessages, revisionMessage],
          };
        }
        return c;
      })
    );

    showToast("⚠️ Solicitud de ajustes enviada al estudiante.");
  };

  // 7. Submit Review
  const handleSubmitReview = (review: ReviewPayload) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMessages = c.messages.map((m) => {
            if (m.type === "review_prompt") {
              return {
                ...m,
                review: { ...review, submitted: true },
              };
            }
            return m;
          });

          const studentThanks: ChatMessage = {
            id: `thanks-${Date.now()}`,
            sender: "other",
            text: `¡Muchísimas gracias por tu reseña de ${review.rating} estrellas! Me alegra que todo haya quedado perfecto. Si necesitas algo más, cuentas conmigo.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
            type: "text",
          };

          return {
            ...c,
            messages: [...updatedMessages, studentThanks],
          };
        }
        return c;
      })
    );

    showToast("⭐ ¡Reseña publicada exitosamente en el perfil!");
  };

  // 8. Custom Proposal creation
  const handleSendCustomProposal = (proposal: ProposalPayload) => {
    const proposalMsg: ChatMessage = {
      id: `prop-${Date.now()}`,
      sender: "other",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
      type: "proposal",
      proposal,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            escrowAmount: proposal.price,
            status: "proposal_sent",
            lastMessage: `⚡ Nueva propuesta formal: S/ ${proposal.price}`,
            messages: [...c.messages, proposalMsg],
          };
        }
        return c;
      })
    );

    showToast("⚡ Propuesta formal enviada al chat.");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#EFEAE2]">
      {/* WHATSAPP WEB 2-PANEL LAYOUT */}
      <div className="container-feed mx-auto flex h-full w-full p-0 sm:p-4 lg:p-6">
        <div className="flex h-full w-full overflow-hidden rounded-none sm:rounded-2xl border border-surface-line bg-white shadow-xl">
          
          {/* ========================================================================= */}
          {/* LEFT PANEL: SIDEBAR CONVERSATIONS LIST (Desktop always, Mobile conditional) */}
          {/* ========================================================================= */}
          <div
            className={[
              "h-full w-full lg:w-[360px] xl:w-[400px] flex-shrink-0",
              id ? "hidden lg:block" : "block",
            ].join(" ")}
          >
            <ChatSidebar
              conversations={conversations}
              activeId={activeConversation.id}
              onSelectConversation={(newId) => {
                navigate(`/chat/${newId}`);
              }}
            />
          </div>

          {/* ========================================================================= */}
          {/* RIGHT PANEL: ACTIVE CHAT CONVERSATION */}
          {/* ========================================================================= */}
          <div
            className={[
              "flex h-full flex-1 flex-col overflow-hidden bg-[#ECE5DD]/20",
              !id ? "hidden lg:flex" : "flex",
            ].join(" ")}
          >
            {/* 1. CABECERA DE CHAT */}
            <ChatHeader
              conversation={activeConversation}
              onBack={() => navigate("/chat")}
              onSimulateProposal={() =>
                handleSendCustomProposal({
                  title: "Diseño de Marca & Identidad Visual",
                  price: 45,
                  turnaroundDays: 2,
                  deliverables: [
                    "Logo vectorial SVG/PNG alta resolución",
                    "Manual de marca básico",
                    "3 plantillas editables en Canva",
                  ],
                  status: "pending",
                })
              }
              onSimulateDelivery={handleSimulateDelivery}
            />

            {/* 5. BANNER PERSISTENTE SUPERIOR DE ESCROW */}
            {activeConversation.escrowActive && (
              <EscrowTopBanner
                amount={activeConversation.escrowAmount}
                deadline={activeConversation.escrowDeadline}
                studentName={activeConversation.studentName}
                isDelivered={activeConversation.status === "delivered"}
              />
            )}

            {/* 2 & 3. ÁREA DE MENSAJES & TARJETAS DE TRANSACCIÓN */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1">
              {/* Subtle date separator */}
              <div className="my-2 flex justify-center">
                <span className="rounded-pill bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink-muted shadow-xs backdrop-blur-xs">
                  Hoy
                </span>
              </div>

              {activeConversation.messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  studentName={activeConversation.studentName}
                  onAcceptProposal={handleAcceptProposal}
                  onOpenPayment={(amount) =>
                    setPaymentModalData({ open: true, amount })
                  }
                  onApproveDelivery={handleApproveDelivery}
                  onRequestRevision={(deliv) =>
                    setRevisionModalData({ open: true, delivery: deliv })
                  }
                  onSubmitReview={handleSubmitReview}
                />
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* 4. BARRA INFERIOR DE ENVÍO */}
            <ChatInputBar
              onSendMessage={handleSendMessage}
              onOpenAttachModal={() =>
                showToast("📎 Función para adjuntar archivos abierta.")
              }
              onOpenProposalModal={() => setIsProposalOpen(true)}
            />
          </div>

        </div>
      </div>

      {/* MODALS */}
      {paymentModalData.open && (
        <PaymentModal
          amount={paymentModalData.amount}
          studentName={activeConversation.studentName}
          onConfirm={handleConfirmPayment}
          onClose={() => setPaymentModalData({ open: false, amount: 0 })}
        />
      )}

      {isProposalOpen && (
        <ProposalModal
          studentName={activeConversation.studentName}
          onSend={handleSendCustomProposal}
          onClose={() => setIsProposalOpen(false)}
        />
      )}

      {revisionModalData.open && (
        <RevisionModal
          studentName={activeConversation.studentName}
          revisionNumber={(revisionModalData.delivery?.revisionCount || 0) + 1}
          maxRevisions={revisionModalData.delivery?.maxRevisions || 2}
          onSubmit={handleConfirmRevision}
          onClose={() => setRevisionModalData({ open: false })}
        />
      )}

      {/* Micro-interaction Toast */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />
    </div>
  );
}
