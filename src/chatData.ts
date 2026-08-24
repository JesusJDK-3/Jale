export type MessageType =
  | "text"
  | "proposal"
  | "payment_gate"
  | "escrow_active"
  | "delivery"
  | "revision_request"
  | "payout_released"
  | "review_prompt";

export type ProposalPayload = {
  title: string;
  price: number;
  turnaroundDays: number;
  deliverables: string[];
  status: "pending" | "accepted" | "rejected";
};

export type PaymentPayload = {
  amount: number;
  platformFee: number;
  total: number;
  status: "pending" | "paid";
};

export type DeliveryPayload = {
  fileName: string;
  fileSize: string;
  fileType: "zip" | "pdf" | "figma" | "image";
  previewTitle: string;
  note: string;
  revisionCount: number;
  maxRevisions: number;
  status: "pending_review" | "approved" | "changes_requested";
};

export type ReviewPayload = {
  rating: number;
  comment: string;
  submitted: boolean;
};

export type ChatMessage = {
  id: string;
  sender: "me" | "other" | "system";
  text?: string;
  timestamp: string;
  read?: boolean;
  type: MessageType;
  proposal?: ProposalPayload;
  payment?: PaymentPayload;
  delivery?: DeliveryPayload;
  review?: ReviewPayload;
};

export type ChatConversation = {
  id: string;
  talentId: string;
  studentName: string;
  studentAvatar: string;
  studentUniversity: string;
  studentCareer: string;
  studentSemester: string;
  isOnline: boolean;
  lastSeenText: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  escrowActive: boolean;
  escrowAmount: number;
  escrowDeadline: string;
  status: "negotiating" | "proposal_sent" | "escrow_funded" | "delivered" | "completed";
  messages: ChatMessage[];
};

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "camila",
    talentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico",
    studentSemester: "7.º semestre",
    isOnline: true,
    lastSeenText: "En línea",
    unreadCount: 1,
    lastMessage: "Te adjunto los archivos finales en ZIP y el link de Canva con la mini-sustentación.",
    lastMessageTime: "11:24 AM",
    escrowActive: true,
    escrowAmount: 45,
    escrowDeadline: "Hoy, 7:00 PM",
    status: "delivered",
    messages: [
      {
        id: "m-1",
        sender: "me",
        text: "Hola Camila! Vi tu perfil en Jale.pe. Tengo una cevichería en Magdalena ('Mar & Ají') y necesito diseñar el logo oficial y 3 plantillas para Instagram.",
        timestamp: "10:15 AM",
        read: true,
        type: "text",
      },
      {
        id: "m-2",
        sender: "other",
        text: "¡Hola! Qué buen proyecto. Sí, claro que puedo ayudarte. Para cevicherías me gusta trabajar paletas frescas (azules con acento naranja) y tipografía con personalidad marina. ¿Tienes alguna referencia en mente?",
        timestamp: "10:17 AM",
        read: true,
        type: "text",
      },
      {
        id: "m-3",
        sender: "me",
        text: "Me gusta algo moderno pero no tan formal. Mi presupuesto base es de aprox S/ 45 y lo necesitaría para el fin de semana.",
        timestamp: "10:20 AM",
        read: true,
        type: "text",
      },
      {
        id: "m-4",
        sender: "other",
        text: "Perfecto, justo se ajusta a mi tarifa base. Te genero una propuesta formal aquí en el chat para que el pago quede protegido con el Escrow de Jale.pe 👇",
        timestamp: "10:22 AM",
        read: true,
        type: "text",
      },
      {
        id: "m-5",
        sender: "other",
        timestamp: "10:23 AM",
        read: true,
        type: "proposal",
        proposal: {
          title: "Identidad Visual + 3 Plantillas Canva para 'Mar & Ají'",
          price: 45,
          turnaroundDays: 2,
          deliverables: [
            "Logo principal en alta resolución (PNG transparente + SVG vectorial)",
            "Variantes en blanco/negro y favicon para WhatsApp",
            "Paleta de color y tipografías recomendadas",
            "3 plantillas editables en Canva para promociones de ceviche",
            "Mini-sustentación de 3 minutos grabada explicando el concepto",
          ],
          status: "accepted",
        },
      },
      {
        id: "m-6",
        sender: "system",
        timestamp: "10:25 AM",
        read: true,
        type: "payment_gate",
        payment: {
          amount: 45,
          platformFee: 0,
          total: 45,
          status: "paid",
        },
      },
      {
        id: "m-7",
        sender: "system",
        text: "🔒 Fondos de S/ 45.00 retenidos en Escrow Jale.pe. Camila ha iniciado el trabajo. El dinero se liberará únicamente cuando apruebes la entrega.",
        timestamp: "10:26 AM",
        read: true,
        type: "escrow_active",
      },
      {
        id: "m-8",
        sender: "other",
        text: "¡Pago recibido en custodia! Ya me puse a trabajar en los bocetos vectoriales. Te hago la entrega antes de las 7:00 PM.",
        timestamp: "10:28 AM",
        read: true,
        type: "text",
      },
      {
        id: "m-9",
        sender: "other",
        timestamp: "11:24 AM",
        read: true,
        type: "delivery",
        delivery: {
          fileName: "Mar_y_Aji_Branding_Final.zip",
          fileSize: "18.4 MB",
          fileType: "zip",
          previewTitle: "Pack Completo: Logo Vectorial + 3 Artes Canva + Guía",
          note: "¡Hola! Terminé el diseño. Incluí 2 opciones de isotipo marino (ola + ají) y los 3 posts listos en Canva con fotos de muestra. En el ZIP tienes los SVG y PNG en 300 DPI.",
          revisionCount: 0,
          maxRevisions: 2,
          status: "pending_review",
        },
      },
    ],
  },
  {
    id: "diego",
    talentId: "diego",
    studentName: "Diego Palacios",
    studentAvatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UNI",
    studentCareer: "Ingeniería de Sistemas",
    studentSemester: "9.º semestre",
    isOnline: true,
    lastSeenText: "En línea",
    unreadCount: 1,
    lastMessage: "Te envié la propuesta formal para la Landing Page en S/ 60.",
    lastMessageTime: "Ayer",
    escrowActive: false,
    escrowAmount: 60,
    escrowDeadline: "En 3 días",
    status: "proposal_sent",
    messages: [
      {
        id: "d-1",
        sender: "me",
        text: "Hola Diego, tengo un taller mecánico y necesito una página web simple de una sola sección con botón directo a mi WhatsApp.",
        timestamp: "Ayer 4:10 PM",
        read: true,
        type: "text",
      },
      {
        id: "d-2",
        sender: "other",
        text: "Hola qué tal. Excelente, con Astro o React queda volando en velocidad en celulares. Te incluyo dominio temporal y botón flotante de WhatsApp.",
        timestamp: "Ayer 4:15 PM",
        read: true,
        type: "text",
      },
      {
        id: "d-3",
        sender: "other",
        timestamp: "Ayer 4:20 PM",
        read: true,
        type: "proposal",
        proposal: {
          title: "Landing Page Rápida + Botón WhatsApp para Taller Mecánico",
          price: 60,
          turnaroundDays: 3,
          deliverables: [
            "Página web responsiva (Hero, Servicios, Ubicación Google Maps, Contacto)",
            "Botón flotante con mensaje personalizado a WhatsApp",
            "Optimización de velocidad para celulares 4G",
            "Publicación en hosting gratuito Vercel/Netlify",
          ],
          status: "pending",
        },
      },
    ],
  },
  {
    id: "valeria",
    talentId: "valeria",
    studentName: "Valeria Soto",
    studentAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UPC",
    studentCareer: "Marketing y Gestión",
    studentSemester: "8.º semestre",
    isOnline: false,
    lastSeenText: "Última vez hace 25 min",
    unreadCount: 0,
    lastMessage: "¡Gracias por la reseña de 5 estrellas! Un gusto trabajar contigo.",
    lastMessageTime: "12 Ago",
    escrowActive: false,
    escrowAmount: 50,
    escrowDeadline: "Finalizado",
    status: "completed",
    messages: [
      {
        id: "v-1",
        sender: "me",
        text: "Hola Valeria, quería ayuda con la segmentación de mi campaña de Facebook para ropa.",
        timestamp: "11 Ago 10:00 AM",
        read: true,
        type: "text",
      },
      {
        id: "v-2",
        sender: "other",
        timestamp: "11 Ago 10:30 AM",
        read: true,
        type: "proposal",
        proposal: {
          title: "Estrategia de Meta Ads + Segmentación para Tienda de Ropa",
          price: 50,
          turnaroundDays: 2,
          deliverables: [
            "Configuración de 2 públicos objetivos en Meta Business Suite",
            "3 copys persuasivos para anuncios",
            "Guía de presupuesto diario recomendado",
          ],
          status: "accepted",
        },
      },
      {
        id: "v-3",
        sender: "system",
        timestamp: "11 Ago 10:35 AM",
        read: true,
        type: "payment_gate",
        payment: {
          amount: 50,
          platformFee: 0,
          total: 50,
          status: "paid",
        },
      },
      {
        id: "v-4",
        sender: "other",
        timestamp: "12 Ago 4:00 PM",
        read: true,
        type: "delivery",
        delivery: {
          fileName: "Plan_Meta_Ads_Ropa.pdf",
          fileSize: "4.2 MB",
          fileType: "pdf",
          previewTitle: "Estrategia de Anuncios + Públicos Segmentados",
          note: "Adjunto el plan detallado con capturas de pantalla de cómo activar la campaña paso a paso en tu Administrador de Anuncios.",
          revisionCount: 0,
          maxRevisions: 2,
          status: "approved",
        },
      },
      {
        id: "v-5",
        sender: "system",
        timestamp: "12 Ago 5:10 PM",
        read: true,
        type: "payout_released",
      },
      {
        id: "v-6",
        sender: "system",
        timestamp: "12 Ago 5:12 PM",
        read: true,
        type: "review_prompt",
        review: {
          rating: 5,
          comment:
            "Valeria armó el calendario y las primeras ads. Gasté poco y por fin supe qué publicar. Se nota que estudia marketing de verdad.",
          submitted: true,
        },
      },
      {
        id: "v-7",
        sender: "other",
        text: "¡Gracias por la reseña de 5 estrellas! Un gusto trabajar contigo. Si necesitas nuevos anuncios el próximo mes, me avisas por aquí.",
        timestamp: "12 Ago 5:15 PM",
        read: true,
        type: "text",
      },
    ],
  },
];
