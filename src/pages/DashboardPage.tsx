import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { WithdrawModal } from "../components/dashboard/WithdrawModal";
import { ApproveOrderModal } from "../components/dashboard/ApproveOrderModal";
import { InvoiceModal } from "../components/dashboard/InvoiceModal";
import { Toast } from "../components/Toast";
import {
  MOCK_STUDENT_ORDERS,
  MOCK_CLIENT_ORDERS,
  MOCK_WITHDRAWALS,
  MOCK_INVOICES,
  type DashboardOrder,
  type InvoiceRecord,
  type WithdrawalRecord,
} from "../dashboardData";
import { useAppState } from "../state";

type ActiveTab = "activos" | "completados" | "finanzas" | "reviews";

export function DashboardPage() {
  const { role, setRole } = useAppState();
  const navigate = useNavigate();

  // Active Role state: default to 'estudiante' or useAppState role
  const [currentRole, setCurrentRole] = useState<"estudiante" | "cliente">(
    role === "cliente" ? "cliente" : "estudiante"
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("activos");

  // Orders State
  const [studentOrders, setStudentOrders] = useState<DashboardOrder[]>(MOCK_STUDENT_ORDERS);
  const [clientOrders, setClientOrders] = useState<DashboardOrder[]>(MOCK_CLIENT_ORDERS);

  // Finances & Withdrawals State
  const [availableBalance, setAvailableBalance] = useState(640.0);
  const [escrowBalance] = useState(45.0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(MOCK_WITHDRAWALS);

  // Modals state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedApproveOrder, setSelectedApproveOrder] = useState<DashboardOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const [toast, setToast] = useState<{ message: string; visible: boolean; type: "saved" | "removed" }>({
    message: "",
    visible: false,
    type: "saved",
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true, type: "saved" });
    window.setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleSwitchRole = (newRole: "estudiante" | "cliente") => {
    setCurrentRole(newRole);
    setRole(newRole);
    setActiveTab("activos");
  };

  // Student: Process Withdrawal
  const handleConfirmWithdrawal = (
    amount: number,
    method: "BCP" | "Interbank" | "BBVA" | "Yape",
    accountNumber: string
  ) => {
    setAvailableBalance((prev) => prev - amount);
    const newRecord: WithdrawalRecord = {
      id: `w-${Date.now()}`,
      date: "Hoy",
      amount,
      method,
      accountNumber: accountNumber.slice(-4) ? `••• ${accountNumber.slice(-4)}` : accountNumber,
      status: "completed",
      referenceCode: `TRF-${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setWithdrawals((prev) => [newRecord, ...prev]);
    setIsWithdrawOpen(false);
    showToast(`✓ Retiro de S/ ${amount.toFixed(2)} transferido a tu cuenta ${method}`);
  };

  // Client: Direct Order Approval from Dashboard
  const handleConfirmApproval = (rating: number, comment: string) => {
    if (!selectedApproveOrder) return;
    const orderId = selectedApproveOrder.id;

    setClientOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "completed_paid" as const,
              escrowStatus: "released_to_student" as const,
              review: { rating, comment, date: "Hoy" },
            }
          : o
      )
    );

    setStudentOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "completed_paid" as const,
              escrowStatus: "released_to_student" as const,
              review: { rating, comment, date: "Hoy" },
            }
          : o
      )
    );

    setSelectedApproveOrder(null);
    showToast("🎉 ¡Entrega aprobada y pago liberado al estudiante!");
  };

  const currentOrders = currentRole === "estudiante" ? studentOrders : clientOrders;
  const activeOrders = currentOrders.filter((o) => o.status !== "completed_paid");
  const completedOrders = currentOrders.filter((o) => o.status === "completed_paid");

  return (
    <div className="min-h-screen bg-surface-muted/30 pb-20">
      {/* Top Banner with Role Switcher */}
      <div className="border-b border-surface-line bg-white py-3.5 shadow-xs">
        <div className="container-feed flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-display-md text-ink">
              Panel de Control
            </h1>
            <p className="text-xs text-ink-muted">
              {currentRole === "estudiante"
                ? "Gestiona tus encargos, entregas universitarias y retiros de ganancias"
                : "Monitorea tus servicios contratados, aprobaciones y comprobantes Escrow"}
            </p>
          </div>

          {/* DUAL ROLE SWITCHER TOGGLE */}
          <div className="inline-flex rounded-xl bg-surface-muted p-1 border border-surface-line self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleSwitchRole("estudiante")}
              className={[
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
                currentRole === "estudiante"
                  ? "bg-primary text-white shadow-xs"
                  : "text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              <span>🎓</span>
              <span>Vista Estudiante</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchRole("cliente")}
              className={[
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
                currentRole === "cliente"
                  ? "bg-primary text-white shadow-xs"
                  : "text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              <span>💼</span>
              <span>Vista Cliente / MYPE</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-feed pt-6 sm:pt-8">
        {/* RESPONSIVE LAYOUT: Fixed Sidebar on Desktop (>=1024px), Top Tabs on Mobile */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR NAVIGATION (Desktop) / TOP TABS (Mobile) */}
          {/* ========================================================================= */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-xs">
              
              {/* User Profile Mini Header */}
              <div className="border-b border-surface-line p-4">
                {currentRole === "estudiante" ? (
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Camila Rojas"
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-body-sm font-bold text-ink truncate">
                        Camila Rojas
                      </p>
                      <p className="text-[11px] text-ink-muted">UTP · 7.º ciclo</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-sm">
                      RM
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-body-sm font-bold text-ink truncate">
                        Rosa Mendoza
                      </p>
                      <p className="text-[11px] text-ink-muted">Cevichería en Magdalena</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Tabs Menu */}
              <nav className="p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("activos")}
                  className={[
                    "w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left",
                    activeTab === "activos"
                      ? "bg-primary-soft text-primary"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span>📦</span>
                    <span>Pedidos Activos</span>
                  </span>
                  <span className="rounded-pill bg-white px-2 py-0.5 text-[11px] font-extrabold border border-surface-line">
                    {activeOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("completados")}
                  className={[
                    "w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left",
                    activeTab === "completados"
                      ? "bg-primary-soft text-primary"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Completados</span>
                  </span>
                  <span className="rounded-pill bg-white px-2 py-0.5 text-[11px] font-extrabold border border-surface-line">
                    {completedOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("finanzas")}
                  className={[
                    "w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left",
                    activeTab === "finanzas"
                      ? "bg-primary-soft text-primary"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span>💰</span>
                    <span>
                      {currentRole === "estudiante" ? "Ganancias y Retiros" : "Pagos y Comprobantes"}
                    </span>
                  </span>
                  {currentRole === "estudiante" && (
                    <span className="text-[11px] font-bold text-success">
                      S/ {availableBalance.toFixed(0)}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={[
                    "w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left",
                    activeTab === "reviews"
                      ? "bg-primary-soft text-primary"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>Reviews y Opiniones</span>
                  </span>
                  <span className="rounded-pill bg-white px-2 py-0.5 text-[11px] font-extrabold border border-surface-line">
                    {currentRole === "estudiante" ? "18" : "2"}
                  </span>
                </button>
              </nav>

              {/* Sidebar Quick Links */}
              <div className="border-t border-surface-line p-3">
                {currentRole === "estudiante" ? (
                  <Link
                    to="/estudiante/camila"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-surface-muted/60 p-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition"
                  >
                    <span>👁️</span>
                    <span>Ver mi perfil público</span>
                  </Link>
                ) : (
                  <Link
                    to="/explorar"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-surface-muted/60 p-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition"
                  >
                    <span>🔍</span>
                    <span>Buscar nuevo estudiante</span>
                  </Link>
                )}
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN CONTENT AREA */}
          {/* ========================================================================= */}
          <main className="space-y-6">

            {/* 1. RESUMEN SUPERIOR: MÉTRICAS CLAVE (Horizontal row on desktop) */}
            {currentRole === "estudiante" ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Metric 1: Ganancias */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Ganancias disponibles
                  </span>
                  <p className="mt-1 font-display text-display-md font-black text-success">
                    S/ {availableBalance.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                    <span>🔒 En Escrow: S/ {escrowBalance.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => setIsWithdrawOpen(true)}
                      className="font-bold text-primary hover:underline"
                    >
                      Retirar →
                    </button>
                  </div>
                </div>

                {/* Metric 2: Activos */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Servicios activos
                  </span>
                  <p className="mt-1 font-display text-display-md font-black text-primary">
                    {activeOrders.length}
                  </p>
                  <p className="mt-2 text-[11px] text-ink-muted">
                    1 esperando pago · 1 en progreso · 1 en revisión
                  </p>
                </div>

                {/* Metric 3: Rating */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Rating promedio
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-display-md font-black text-amber-500">
                      ★ 4.9
                    </span>
                    <span className="text-xs text-ink-muted font-medium">/ 5.0</span>
                  </div>
                  <p className="mt-2 text-[11px] text-ink-muted">
                    18 reviews de clientes verificados
                  </p>
                </div>

                {/* Metric 4: Verificación */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Verificación universitaria
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-[11px] font-bold text-white">
                      ✓
                    </span>
                    <span className="font-display text-xs font-bold text-ink">
                      SUNEDU Activo
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-ink-muted">
                    UTP · Diseño Gráfico (7.º)
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Client Metric 1 */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Fondos en Escrow
                  </span>
                  <p className="mt-1 font-display text-display-md font-black text-primary">
                    S/ {escrowBalance.toFixed(2)}
                  </p>
                  <p className="mt-2 text-[11px] text-success font-semibold">
                    🛡️ Retenidos hasta tu aprobación
                  </p>
                </div>

                {/* Client Metric 2 */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Servicios contratados
                  </span>
                  <p className="mt-1 font-display text-display-md font-black text-ink">
                    {clientOrders.length}
                  </p>
                  <p className="mt-2 text-[11px] text-ink-muted">
                    {activeOrders.length} en curso · {completedOrders.length} finalizados
                  </p>
                </div>

                {/* Client Metric 3 */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Estudiantes contratados
                  </span>
                  <p className="mt-1 font-display text-display-md font-black text-ink">
                    3
                  </p>
                  <p className="mt-2 text-[11px] text-ink-muted">
                    UTP, UNI, UPC
                  </p>
                </div>

                {/* Client Metric 4 */}
                <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                  <span className="text-caption uppercase font-bold text-ink-faint">
                    Garantía Jale.pe
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 text-success font-bold text-xs">
                    <span>✓ 100% Protegido</span>
                  </div>
                  <p className="mt-2 text-[11px] text-ink-muted">
                    Hasta 2 revisiones gratis por encargo
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: 1. ACTIVOS & 2. COMPLETADOS */}
            {/* ========================================================================= */}
            {(activeTab === "activos" || activeTab === "completados") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-title font-bold text-ink">
                    {activeTab === "activos"
                      ? `Servicios Activos (${activeOrders.length})`
                      : `Historial de Servicios Completados (${completedOrders.length})`}
                  </h2>
                  <span className="text-xs text-ink-muted">
                    {currentRole === "estudiante"
                      ? "Ordenados por prioridad de entrega"
                      : "Ordenados por fecha de contratación"}
                  </span>
                </div>

                {/* Orders List Cards */}
                {(activeTab === "activos" ? activeOrders : completedOrders).length === 0 ? (
                  /* Friendly Empty State */
                  <div className="rounded-2xl border border-dashed border-surface-line bg-white p-10 text-center">
                    <span className="text-4xl">📦</span>
                    <h3 className="mt-3 font-display text-body font-bold text-ink">
                      {activeTab === "activos"
                        ? "No tienes pedidos activos en este momento"
                        : "No tienes pedidos completados aún"}
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-ink-muted">
                      {currentRole === "estudiante"
                        ? "Comparte tu enlace de perfil o postula a pedidos para recibir tus primeros encargos."
                        : "Explora cientos de estudiantes verificados listos para ayudarte con diseño, desarrollo o marketing."}
                    </p>
                    <div className="mt-5">
                      {currentRole === "estudiante" ? (
                        <Button size="sm" onClick={() => navigate("/estudiante/camila")}>
                          Ver mi enlace de perfil
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => navigate("/explorar")}>
                          Explorar talento universitario
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  (activeTab === "activos" ? activeOrders : completedOrders).map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-xs transition hover:border-primary/40 hover:shadow-md"
                    >
                      {/* Order Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-line bg-surface-muted/40 p-4 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-ink">
                            {order.orderNumber}
                          </span>
                          <span className="text-ink-faint">·</span>
                          <span className="font-medium text-ink-muted">
                            {order.serviceCategory}
                          </span>
                        </div>

                        {/* Visual Status Badge */}
                        <StatusBadge status={order.status} />
                      </div>

                      {/* Order Card Body */}
                      <div className="p-5">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                          {/* Left: Project Title & Deliverables */}
                          <div className="flex-1">
                            <h3 className="font-display text-body font-bold text-ink">
                              {order.title}
                            </h3>

                            {/* Counterpart Info (Client or Student) */}
                            <div className="mt-2 flex items-center gap-2.5 text-xs text-ink-muted">
                              {currentRole === "estudiante" ? (
                                <>
                                  <span className="font-semibold text-ink">
                                    Cliente: {order.clientName}
                                  </span>
                                  <span>·</span>
                                  <span>{order.clientBusiness}</span>
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={order.studentAvatar}
                                    alt={order.studentName}
                                    className="h-6 w-6 rounded-full object-cover ring-1 ring-primary"
                                  />
                                  <span className="font-semibold text-ink">
                                    {order.studentName}
                                  </span>
                                  <span>·</span>
                                  <span>{order.studentCareer}</span>
                                </div>
                              )}
                            </div>

                            {/* Deliverables Checklist */}
                            <div className="mt-3.5">
                              <p className="text-caption uppercase font-bold text-ink-faint">
                                Entregables acordados:
                              </p>
                              <ul className="mt-1.5 grid grid-cols-1 gap-1 sm:grid-cols-2 text-xs text-ink-muted">
                                {order.deliverables.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-success font-bold">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Delivery Attachment Preview (if delivered) */}
                            {order.deliveryFileName && (
                              <div className="mt-3.5 flex items-center gap-3 rounded-xl border border-surface-line bg-surface-muted/60 p-2.5 text-xs">
                                <span className="text-lg">📁</span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-display text-xs font-bold text-ink truncate">
                                    {order.deliveryFileName}
                                  </p>
                                  <p className="text-[10px] text-ink-muted">
                                    {order.deliveryFileSize} · Entregado {order.deliveryDate}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => alert(`Descargando ${order.deliveryFileName}...`)}
                                  className="text-xs font-bold text-primary hover:underline"
                                >
                                  Descargar
                                </button>
                              </div>
                            )}

                            {/* Review preview if completed */}
                            {order.review && (
                              <div className="mt-3.5 rounded-xl bg-amber-50/70 p-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-500 font-bold">
                                    {"★★★★★".slice(0, order.review.rating)}
                                  </span>
                                  <span className="text-[11px] text-ink-faint">
                                    {order.review.date}
                                  </span>
                                </div>
                                <p className="mt-1 text-ink-muted">
                                  “{order.review.comment}”
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Right Column: Price, Deadline, & Action Buttons */}
                          <div className="flex flex-col justify-between border-t border-surface-line pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                            <div>
                              <span className="text-caption uppercase font-bold text-ink-faint">
                                Monto acordado
                              </span>
                              <p className="font-display text-title font-black text-primary">
                                S/ {order.amount.toFixed(2)}
                              </p>
                              <p className="text-xs font-medium text-ink-muted">
                                ⏱️ Plazo: <strong className="text-ink">{order.deadline}</strong>
                              </p>
                            </div>

                            {/* Direct Action Buttons depending on Role & State */}
                            <div className="mt-4 space-y-2">
                              {/* If Client and order is in review -> Direct Approval / Revision */}
                              {currentRole === "cliente" && order.status === "in_review" && (
                                <>
                                  <Button
                                    fullWidth
                                    size="sm"
                                    className="!bg-success hover:!bg-success-hover text-white font-bold"
                                    onClick={() => setSelectedApproveOrder(order)}
                                  >
                                    ✓ Aprobar y liberar pago
                                  </Button>
                                  <Button
                                    fullWidth
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => navigate(`/chat/${order.studentId}`)}
                                  >
                                    Solicitar ajustes (chat)
                                  </Button>
                                </>
                              )}

                              {/* If Client and order is waiting payment */}
                              {currentRole === "cliente" && order.status === "waiting_payment" && (
                                <Button
                                  fullWidth
                                  size="sm"
                                  variant="primary"
                                  onClick={() => navigate(`/chat/${order.studentId}`)}
                                >
                                  Pagar S/ {order.amount.toFixed(2)} en Escrow
                                </Button>
                              )}

                              {/* If Student and order is in progress */}
                              {currentRole === "estudiante" && order.status === "in_progress" && (
                                <Button
                                  fullWidth
                                  size="sm"
                                  variant="primary"
                                  onClick={() => navigate(`/chat/${order.studentId}`)}
                                >
                                  Subir entrega en el chat 📦
                                </Button>
                              )}

                              {/* Default: Go to Chat */}
                              <Button
                                fullWidth
                                size="sm"
                                variant="tertiary"
                                onClick={() => navigate(`/chat/${order.studentId}`)}
                              >
                                Abrir chat del pedido 💬
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: 3. FINANZAS / GANANCIAS & RETIROS */}
            {/* ========================================================================= */}
            {activeTab === "finanzas" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-title font-bold text-ink">
                    {currentRole === "estudiante" ? "Ganancias y Retiros de Dinero" : "Historial de Pagos y Comprobantes"}
                  </h2>
                </div>

                {currentRole === "estudiante" ? (
                  <>
                    {/* Student Balance Card */}
                    <div className="rounded-2xl border border-surface-line bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 p-6 text-white shadow-md">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <span className="rounded-pill bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                            Cuenta Jale.pe Verificada
                          </span>
                          <h3 className="mt-2 font-display text-title font-bold text-white">
                            Saldo Disponible para Retiro
                          </h3>
                          <p className="font-display text-display-lg font-black text-white">
                            S/ {availableBalance.toFixed(2)}
                          </p>
                          <p className="mt-1 text-xs text-white/80">
                            🔒 S/ {escrowBalance.toFixed(2)} retenidos en pedidos en curso (se liberan al entregar)
                          </p>
                        </div>

                        <div>
                          <Button
                            size="lg"
                            className="bg-white text-emerald-800 hover:bg-white/90 shadow-md font-bold"
                            onClick={() => setIsWithdrawOpen(true)}
                          >
                            Solicitar retiro a cuenta bancaria / Yape
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Withdrawals History Table */}
                    <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-xs">
                      <div className="border-b border-surface-line p-4">
                        <h3 className="font-display text-body-sm font-bold text-ink">
                          Historial de Transferencias y Retiros
                        </h3>
                      </div>

                      <div className="divide-y divide-surface-line">
                        {withdrawals.map((w) => (
                          <div key={w.id} className="flex items-center justify-between p-4 text-xs">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-bold">
                                ↗
                              </span>
                              <div>
                                <p className="font-display text-xs font-bold text-ink">
                                  Retiro a cuenta {w.method} ({w.accountNumber})
                                </p>
                                <p className="text-[11px] text-ink-faint">
                                  Ref: {w.referenceCode} · {w.date}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="font-display text-body-sm font-extrabold text-ink">
                                - S/ {w.amount.toFixed(2)}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success">
                                ✓ Transferido
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Client Invoices Table */
                  <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-xs">
                    <div className="border-b border-surface-line p-4">
                      <h3 className="font-display text-body-sm font-bold text-ink">
                        Comprobantes Digitales de Custodia Escrow
                      </h3>
                      <p className="text-xs text-ink-muted">
                        Recibos emitidos con código de protección de fondos
                      </p>
                    </div>

                    <div className="divide-y divide-surface-line">
                      {MOCK_INVOICES.map((inv) => (
                        <div key={inv.id} className="flex flex-col justify-between gap-3 p-4 text-xs sm:flex-row sm:items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-primary">
                                {inv.invoiceNumber}
                              </span>
                              <Badge tone="success" size="sm">
                                Pagado en Escrow
                              </Badge>
                            </div>
                            <p className="mt-1 font-display text-xs font-bold text-ink">
                              {inv.orderTitle}
                            </p>
                            <p className="text-[11px] text-ink-muted">
                              Estudiante: {inv.studentName} ({inv.studentUniversity}) · {inv.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div>
                              <p className="font-display text-body font-black text-ink">
                                S/ {inv.total.toFixed(2)}
                              </p>
                              <span className="text-[10px] text-ink-faint">{inv.paymentMethod}</span>
                            </div>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedInvoice(inv)}
                            >
                              Ver recibo
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: 4. REVIEWS Y OPINIONES */}
            {/* ========================================================================= */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-title font-bold text-ink">
                    {currentRole === "estudiante" ? "Opiniones Recibidas en tu Perfil" : "Reviews Otorgadas a Estudiantes"}
                  </h2>
                </div>

                <div className="rounded-2xl border border-surface-line bg-white p-6 shadow-xs">
                  <div className="divide-y divide-surface-line space-y-4">
                    {completedOrders
                      .filter((o) => o.review)
                      .map((o) => (
                        <div key={o.id} className="pt-4 first:pt-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display text-xs font-bold text-ink">
                                  {currentRole === "estudiante" ? o.clientName : o.studentName}
                                </span>
                                <Badge tone="success" size="sm">
                                  {currentRole === "estudiante" ? o.clientBusiness : o.studentUniversity}
                                </Badge>
                              </div>
                              <p className="mt-0.5 text-[11px] text-ink-faint">
                                Servicio: {o.title}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-amber-500 font-bold">
                                {"★★★★★".slice(0, o.review?.rating || 5)}
                              </span>
                              <p className="text-[10px] text-ink-faint">{o.review?.date}</p>
                            </div>
                          </div>

                          <p className="mt-2.5 rounded-xl bg-surface-muted/50 p-3 text-xs text-ink-muted leading-relaxed">
                            “{o.review?.comment}”
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* MODALS */}
      {isWithdrawOpen && (
        <WithdrawModal
          availableBalance={availableBalance}
          onConfirm={handleConfirmWithdrawal}
          onClose={() => setIsWithdrawOpen(false)}
        />
      )}

      {selectedApproveOrder && (
        <ApproveOrderModal
          order={selectedApproveOrder}
          onConfirm={handleConfirmApproval}
          onClose={() => setSelectedApproveOrder(null)}
        />
      )}

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Toast feedback */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />
    </div>
  );
}
