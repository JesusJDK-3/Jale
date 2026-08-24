export type OrderStatus =
  | "waiting_payment"
  | "in_progress"
  | "in_review"
  | "completed_paid"
  | "changes_requested";

export type DashboardOrder = {
  id: string;
  orderNumber: string;
  title: string;
  serviceCategory: string;
  clientName: string;
  clientBusiness: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentUniversity: string;
  studentCareer: string;
  amount: number;
  escrowStatus: "unfunded" | "held_in_escrow" | "released_to_student";
  deadline: string;
  deliveryDate?: string;
  status: OrderStatus;
  deliverables: string[];
  deliveryFileName?: string;
  deliveryFileSize?: string;
  deliveryFileUrl?: string;
  revisionsUsed: number;
  maxRevisions: number;
  review?: {
    rating: number;
    comment: string;
    date: string;
  };
};

export type WithdrawalRecord = {
  id: string;
  date: string;
  amount: number;
  method: "BCP" | "Interbank" | "BBVA" | "Yape";
  accountNumber: string;
  status: "completed" | "processing";
  referenceCode: string;
};

export type InvoiceRecord = {
  id: string;
  invoiceNumber: string;
  date: string;
  orderTitle: string;
  studentName: string;
  studentUniversity: string;
  amount: number;
  fee: number;
  total: number;
  paymentMethod: "Yape" | "Plin" | "Tarjeta de Débito BCP";
  escrowProtectionCode: string;
};

export const MOCK_STUDENT_ORDERS: DashboardOrder[] = [
  {
    id: "ord-1",
    orderNumber: "JALE-2026-8941",
    title: "Identidad Visual + 3 Plantillas Canva para 'Mar & Ají'",
    serviceCategory: "Diseño Gráfico",
    clientName: "Rosa Mendoza",
    clientBusiness: "Cevichería en Magdalena",
    studentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico (7.º semestre)",
    amount: 45,
    escrowStatus: "held_in_escrow",
    deadline: "Hoy, 7:00 PM",
    deliveryDate: "Hoy, 11:24 AM",
    status: "in_review",
    deliverables: [
      "Logo vectorial SVG/PNG alta resolución",
      "Manual de marca simplificado",
      "3 plantillas editables en Canva",
    ],
    deliveryFileName: "Mar_y_Aji_Branding_Final.zip",
    deliveryFileSize: "18.4 MB",
    revisionsUsed: 0,
    maxRevisions: 2,
  },
  {
    id: "ord-2",
    orderNumber: "JALE-2026-8920",
    title: "Diseño de Carta Menú Digital + Código QR para Mesa",
    serviceCategory: "Diseño Editorial",
    clientName: "Jorge Linares",
    clientBusiness: "Cafetería en Lince",
    studentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico (7.º semestre)",
    amount: 55,
    escrowStatus: "held_in_escrow",
    deadline: "En 2 días (25 Ago)",
    status: "in_progress",
    deliverables: [
      "Menú en PDF alta resolución A4",
      "Versión optimizada para WhatsApp",
      "Sticker QR imprimible",
    ],
    revisionsUsed: 0,
    maxRevisions: 2,
  },
  {
    id: "ord-3",
    orderNumber: "JALE-2026-8910",
    title: "Pack de 12 Posts Promocionales para Redes Sociales",
    serviceCategory: "Redes Sociales",
    clientName: "Andrea Cárdenas",
    clientBusiness: "Boutique en San Juan de Lurigancho",
    studentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico (7.º semestre)",
    amount: 60,
    escrowStatus: "unfunded",
    deadline: "Esperando confirmación",
    status: "waiting_payment",
    deliverables: [
      "12 plantillas editables en Canva Pro",
      "Historias destacadas para Instagram",
      "Paleta de tipografías",
    ],
    revisionsUsed: 0,
    maxRevisions: 2,
  },
  {
    id: "ord-4",
    orderNumber: "JALE-2026-8802",
    title: "Rediseño de Isotipo y Etiquetas para Frascos de Mermelada",
    serviceCategory: "Branding & Packaging",
    clientName: "Carlos Vega",
    clientBusiness: "MYPE 'Dulces del Valle' · Huachipa",
    studentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico (7.º semestre)",
    amount: 70,
    escrowStatus: "released_to_student",
    deadline: "18 Ago 2026",
    deliveryDate: "17 Ago 2026",
    status: "completed_paid",
    deliverables: ["Etiquetas troqueladas en AI/PDF", "Muestras en 3D para catálogo"],
    deliveryFileName: "Etiquetas_Mermeladas_Final.pdf",
    deliveryFileSize: "12.1 MB",
    revisionsUsed: 1,
    maxRevisions: 2,
    review: {
      rating: 5,
      comment: "Excelente disposición de Camila. Me ajustó el tamaño de la etiqueta para el frasco de 250g sin problemas.",
      date: "Hace 5 días",
    },
  },
  {
    id: "ord-5",
    orderNumber: "JALE-2026-8740",
    title: "Vectorización de Logo Antiguo y Manual de Colores",
    serviceCategory: "Diseño Gráfico",
    clientName: "Marina Torres",
    clientBusiness: "Ferretería 'El Tornillo' · Surquillo",
    studentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico (7.º semestre)",
    amount: 40,
    escrowStatus: "released_to_student",
    deadline: "10 Ago 2026",
    deliveryDate: "09 Ago 2026",
    status: "completed_paid",
    deliverables: ["Logo en EPS, SVG, PNG", "Ficha técnica CMYK/RGB"],
    deliveryFileName: "Logo_El_Tornillo_Vector.zip",
    deliveryFileSize: "8.5 MB",
    revisionsUsed: 0,
    maxRevisions: 2,
    review: {
      rating: 5,
      comment: "Muy rápida y formal. Me entregó todo ordenado en carpetas.",
      date: "Hace 2 semanas",
    },
  },
];

export const MOCK_CLIENT_ORDERS: DashboardOrder[] = [
  {
    id: "ord-1",
    orderNumber: "JALE-2026-8941",
    title: "Identidad Visual + 3 Plantillas Canva para 'Mar & Ají'",
    serviceCategory: "Diseño Gráfico",
    clientName: "Rosa Mendoza",
    clientBusiness: "Cevichería en Magdalena",
    studentId: "camila",
    studentName: "Camila Rojas",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UTP",
    studentCareer: "Diseño Gráfico (7.º semestre)",
    amount: 45,
    escrowStatus: "held_in_escrow",
    deadline: "Hoy, 7:00 PM",
    deliveryDate: "Hoy, 11:24 AM",
    status: "in_review",
    deliverables: [
      "Logo vectorial SVG/PNG alta resolución",
      "Manual de marca simplificado",
      "3 plantillas editables en Canva",
    ],
    deliveryFileName: "Mar_y_Aji_Branding_Final.zip",
    deliveryFileSize: "18.4 MB",
    revisionsUsed: 0,
    maxRevisions: 2,
  },
  {
    id: "ord-6",
    orderNumber: "JALE-2026-8933",
    title: "Landing Page Rápida + Botón WhatsApp",
    serviceCategory: "Desarrollo Web",
    clientName: "Rosa Mendoza",
    clientBusiness: "Cevichería en Magdalena",
    studentId: "diego",
    studentName: "Diego Palacios",
    studentAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UNI",
    studentCareer: "Ingeniería de Sistemas (9.º semestre)",
    amount: 60,
    escrowStatus: "unfunded",
    deadline: "En 3 días",
    status: "waiting_payment",
    deliverables: [
      "Landing page en Astro ultra rápida",
      "Botón WhatsApp con mensaje predeterminado",
      "Dominio temporal activo",
    ],
    revisionsUsed: 0,
    maxRevisions: 2,
  },
  {
    id: "ord-7",
    orderNumber: "JALE-2026-8815",
    title: "Segmentación de Anuncios Meta Ads para Delivery de Mariscos",
    serviceCategory: "Marketing Digital",
    clientName: "Rosa Mendoza",
    clientBusiness: "Cevichería en Magdalena",
    studentId: "valeria",
    studentName: "Valeria Soto",
    studentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    studentUniversity: "UPC",
    studentCareer: "Marketing y Gestión (8.º semestre)",
    amount: 50,
    escrowStatus: "released_to_student",
    deadline: "12 Ago 2026",
    deliveryDate: "12 Ago 2026",
    status: "completed_paid",
    deliverables: [
      "2 públicos objetivos configurados en Meta",
      "Guía de presupuesto en PDF",
    ],
    deliveryFileName: "Plan_Meta_Ads_Ceviche.pdf",
    deliveryFileSize: "4.2 MB",
    revisionsUsed: 0,
    maxRevisions: 2,
    review: {
      rating: 5,
      comment: "Valeria nos enseñó cómo prender los anuncios para el fin de semana. Subieron los pedidos de delivery.",
      date: "12 Ago 2026",
    },
  },
];

export const MOCK_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: "w-1",
    date: "15 Ago 2026",
    amount: 180.0,
    method: "BCP",
    accountNumber: "••• 4591",
    status: "completed",
    referenceCode: "TRF-BCP-992144",
  },
  {
    id: "w-2",
    date: "02 Ago 2026",
    amount: 220.0,
    method: "Yape",
    accountNumber: "987 ••• 321",
    status: "completed",
    referenceCode: "YAP-2026-08129",
  },
  {
    id: "w-3",
    date: "20 Jul 2026",
    amount: 150.0,
    method: "Interbank",
    accountNumber: "••• 8820",
    status: "completed",
    referenceCode: "TRF-IBK-441029",
  },
];

export const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-1",
    invoiceNumber: "REC-ESCROW-2026-00941",
    date: "23 Ago 2026",
    orderTitle: "Identidad Visual + 3 Plantillas Canva para 'Mar & Ají'",
    studentName: "Camila Rojas",
    studentUniversity: "UTP",
    amount: 45.0,
    fee: 0.0,
    total: 45.0,
    paymentMethod: "Yape",
    escrowProtectionCode: "ESCROW-UTP-45-CAM",
  },
  {
    id: "inv-2",
    invoiceNumber: "REC-ESCROW-2026-00815",
    date: "11 Ago 2026",
    orderTitle: "Segmentación de Anuncios Meta Ads",
    studentName: "Valeria Soto",
    studentUniversity: "UPC",
    amount: 50.0,
    fee: 0.0,
    total: 50.0,
    paymentMethod: "Tarjeta de Débito BCP",
    escrowProtectionCode: "ESCROW-UPC-50-VAL",
  },
];
