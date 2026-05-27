import type { Locale } from "@/lib/i18n/types";

export type LegalDocumentKey = "privacy" | "terms" | "cookies";

export type LegalSection = {
  heading?: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const legalEn: Record<LegalDocumentKey, LegalDocument> = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "20 May 2026",
    sections: [
      {
        paragraphs: [
          "RingsAway (“we”, “us”) provides AI phone reception and Voice of Customer (VoC) reporting for local businesses. This policy explains how we handle personal data when you visit ringsaway.com, contact us, book a demo, or use our services.",
          "We are based in Manilva, La Chullera, Málaga, Spain. For privacy questions or requests, email hello@ringsaway.com.",
        ],
      },
      {
        heading: "Data we collect",
        paragraphs: [
          "Website and enquiries: name, email, phone number, business name, message content, and technical data such as IP address and browser type when you submit forms or browse the site.",
          "Service delivery: call metadata, transcripts or summaries where configured, booking details, and business information you provide for AI receptionist setup.",
          "Analytics: aggregated usage data via Vercel Web Analytics to understand how visitors use the site (no advertising cookies).",
        ],
      },
      {
        heading: "How we use your data",
        paragraphs: [
          "To respond to enquiries and provide demos, quotes, and onboarding.",
          "To operate AI receptionist and VoC services under our agreement with you.",
          "To improve the website, security, and customer support.",
          "To comply with legal obligations.",
        ],
      },
      {
        heading: "Legal basis (GDPR)",
        paragraphs: [
          "Contract: processing needed to deliver services you request.",
          "Legitimate interests: operating and improving our business, site security, and B2B communication, balanced against your rights.",
          "Consent: where required for optional marketing or non-essential cookies.",
          "Legal obligation: where law requires retention or disclosure.",
        ],
      },
      {
        heading: "Sharing and processors",
        paragraphs: [
          "We use trusted providers who process data on our instructions, including hosting (e.g. Vercel), voice/AI partners (e.g. ElevenLabs where used for demos or production), email, calendar booking (Google), and database/infrastructure (e.g. Supabase) where applicable.",
          "We do not sell personal data. We may disclose information if required by law or to protect rights and safety.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Enquiry data is kept as long as needed to handle your request and for a reasonable period afterwards for business records.",
          "Client and call-related data is retained according to your service agreement and applicable law.",
          "You may ask us to delete data where we have no overriding legal reason to keep it.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "If you are in the EU/UK, you may have rights to access, rectify, erase, restrict, object, and port your data, and to withdraw consent where processing is consent-based.",
          "You may lodge a complaint with the Spanish Data Protection Agency (AEPD) or your local supervisory authority.",
          "Contact hello@ringsaway.com to exercise your rights. We may need to verify your identity.",
        ],
      },
      {
        heading: "International transfers",
        paragraphs: [
          "Some providers may process data outside the EEA. Where this applies, we rely on appropriate safeguards such as Standard Contractual Clauses or adequacy decisions where available.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "We may update this policy from time to time. The “last updated” date at the top will change when we do. Continued use of the site after changes constitutes acceptance of the updated policy where permitted by law.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "20 May 2026",
    sections: [
      {
        paragraphs: [
          "These Terms of Service (“Terms”) govern your use of the RingsAway website (ringsaway.com) and our AI receptionist, VoC reporting, and related services (“Services”). By using the site or engaging us for Services, you agree to these Terms.",
          "If you do not agree, please do not use the site or Services. Business customers will also be subject to any signed proposal, order form, or service agreement, which prevails if it conflicts with these Terms on commercial matters.",
        ],
      },
      {
        heading: "Services",
        paragraphs: [
          "RingsAway provides AI-assisted phone answering on your business number, appointment handling, notifications, optional integrations, and monthly customer feedback (VoC) reports as described on the site and in your plan.",
          "Features, languages, and integrations depend on your package and setup. We will agree scope during onboarding.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: [
          "You must provide accurate business information, comply with telecom and data-protection laws, and ensure you have rights to use phone numbers, content, and customer data you share with us.",
          "You must not use the Services for unlawful, fraudulent, harassing, or harmful activity, or to mislead callers about whether they are speaking with AI where disclosure is required by law.",
        ],
      },
      {
        heading: "Fees and payment",
        paragraphs: [
          "Setup fees, monthly fees, included minutes, and overage rates are as quoted on the site or in your agreement. Prices may exclude VAT/IVA unless stated otherwise.",
          "Unless agreed otherwise, services are month-to-month. Late or failed payment may result in suspension after notice.",
        ],
      },
      {
        heading: "Availability and disclaimers",
        paragraphs: [
          "We aim for high availability but do not guarantee uninterrupted service. Telecom networks, third-party APIs, and force majeure may affect performance.",
          "AI responses are based on your knowledge base and configuration. You remain responsible for bookings, advice given to callers, and compliance in your industry (e.g. health, legal, or financial advice limitations).",
          "VoC reports are research summaries, not legal or professional advice.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "We retain rights in our software, branding, and methodologies. You retain rights in your business content. You grant us a licence to use your materials solely to provide the Services.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, we are not liable for indirect, consequential, or lost-profit damages. Our total liability for any claim relating to the Services is limited to fees paid by you in the twelve months before the claim, except where liability cannot be limited under applicable law (including death or personal injury caused by negligence, or fraud).",
        ],
      },
      {
        heading: "Termination",
        paragraphs: [
          "Either party may end services according to your agreement or by written notice where no minimum term applies. On termination we will handle data as agreed and applicable law requires.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These Terms are governed by the laws of Spain. Courts in Málaga, Spain shall have exclusive jurisdiction unless mandatory consumer law in your country requires otherwise.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: ["Questions: hello@ringsaway.com"],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    lastUpdated: "20 May 2026",
    sections: [
      {
        paragraphs: [
          "This policy explains how RingsAway uses cookies and similar technologies on ringsaway.com.",
        ],
      },
      {
        heading: "What are cookies?",
        paragraphs: [
          "Cookies are small text files stored on your device. They help sites work, remember preferences, or understand usage.",
        ],
      },
      {
        heading: "Cookies we use",
        paragraphs: [
          "Strictly necessary: cookies required for security, load balancing, or core site function (including session or preference cookies where used).",
          "Analytics: we use Vercel Web Analytics to measure page views and performance in a privacy-oriented way. This helps us improve the site without selling your data.",
          "We do not use advertising or third-party marketing cookies on this site at the time of this policy.",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can block or delete cookies in your browser settings. Blocking necessary cookies may affect how the site works.",
          "Where analytics relies on consent in your jurisdiction, you may withdraw consent by adjusting browser settings or contacting us.",
        ],
      },
      {
        heading: "More information",
        paragraphs: [
          "See our Privacy Policy for how we handle personal data. Contact hello@ringsaway.com with questions.",
        ],
      },
    ],
  },
};

const legalEs: Record<LegalDocumentKey, LegalDocument> = {
  privacy: {
    title: "Política de privacidad",
    lastUpdated: "20 de mayo de 2026",
    sections: [
      {
        paragraphs: [
          "RingsAway («nosotros») ofrece recepción telefónica con IA e informes de Voz del Cliente (VoC) para negocios locales. Esta política explica cómo tratamos datos personales cuando visitas ringsaway.com, nos contactas, reservas una demo o usas nuestros servicios.",
          "Estamos en Manilva, La Chullera, Málaga, España. Para privacidad: hello@ringsaway.com.",
        ],
      },
      {
        heading: "Datos que recogemos",
        paragraphs: [
          "Web y consultas: nombre, email, teléfono, negocio, mensaje y datos técnicos (IP, navegador) al enviar formularios o navegar.",
          "Servicio: metadatos de llamadas, resúmenes o transcripciones si están configurados, reservas e información que nos das para la recepcionista IA.",
          "Analítica: datos agregados con Vercel Web Analytics (sin cookies publicitarias).",
        ],
      },
      {
        heading: "Uso de los datos",
        paragraphs: [
          "Responder consultas, demos, presupuestos y alta.",
          "Prestar recepcionista IA y VoC según contrato.",
          "Mejorar web, seguridad y soporte.",
          "Cumplir obligaciones legales.",
        ],
      },
      {
        heading: "Base legal (RGPD)",
        paragraphs: [
          "Contrato: necesario para el servicio solicitado.",
          "Interés legítimo: operar y mejorar el negocio y la web, con equilibrio de derechos.",
          "Consentimiento: marketing opcional o cookies no esenciales cuando aplique.",
          "Obligación legal: conservación o comunicación exigida por ley.",
        ],
      },
      {
        heading: "Encargados y cesiones",
        paragraphs: [
          "Usamos proveedores que tratan datos por nuestra cuenta: alojamiento (p. ej. Vercel), voz/IA (p. ej. ElevenLabs en demos o producción), email, reservas (Google) y bases de datos (p. ej. Supabase) cuando corresponda.",
          "No vendemos datos personales. Podemos comunicar datos si la ley lo exige.",
        ],
      },
      {
        heading: "Conservación",
        paragraphs: [
          "Consultas: el tiempo necesario para atenderlas y plazo razonable de archivo comercial.",
          "Datos de cliente y llamadas: según contrato y ley.",
          "Puedes solicitar supresión cuando no debamos conservarlos.",
        ],
      },
      {
        heading: "Tus derechos",
        paragraphs: [
          "En UE/Reino Unido: acceso, rectificación, supresión, limitación, oposición, portabilidad y retirar consentimiento cuando proceda.",
          "Reclamación ante la AEPD u otra autoridad de control.",
          "Escribe a hello@ringsaway.com. Podemos verificar tu identidad.",
        ],
      },
      {
        heading: "Transferencias internacionales",
        paragraphs: [
          "Algunos proveedores pueden tratar datos fuera del EEE con garantías adecuadas (cláusulas tipo u decisiones de adecuación).",
        ],
      },
      {
        heading: "Cambios",
        paragraphs: [
          "Podemos actualizar esta política. La fecha «última actualización» reflejará el cambio.",
        ],
      },
    ],
  },
  terms: {
    title: "Términos del servicio",
    lastUpdated: "20 de mayo de 2026",
    sections: [
      {
        paragraphs: [
          "Estos términos regulan el uso de ringsaway.com y nuestros servicios de recepcionista IA, VoC y relacionados («Servicios»). Al usar la web o contratar, aceptas estos términos.",
          "Los clientes empresariales quedan también sujetos a propuesta, pedido o contrato firmado, que prevalece en lo comercial si hay conflicto.",
        ],
      },
      {
        heading: "Servicios",
        paragraphs: [
          "Atención telefónica con IA en tu número, citas, notificaciones, integraciones opcionales e informes VoC según plan y configuración acordados.",
        ],
      },
      {
        heading: "Tus obligaciones",
        paragraphs: [
          "Información veraz, cumplimiento de telecomunicaciones y protección de datos, y derecho a usar números y contenidos que nos facilitas.",
          "No usar los Servicios para actividades ilegales, fraudulentas o dañinas, ni para ocultar el uso de IA cuando la ley exija transparencia.",
        ],
      },
      {
        heading: "Precios y pago",
        paragraphs: [
          "Tarifas según web o contrato; IVA/IVA no incluido salvo que se indique. Servicio habitualmente mes a mes salvo pacto distinto.",
        ],
      },
      {
        heading: "Disponibilidad",
        paragraphs: [
          "Buscamos alta disponibilidad sin garantía absoluta. Redes y terceros pueden afectar el servicio.",
          "La IA responde según tu base de conocimiento; tú sigues siendo responsable de reservas y cumplimiento sectorial. Los informes VoC son resúmenes, no asesoramiento legal o profesional.",
        ],
      },
      {
        heading: "Propiedad intelectual",
        paragraphs: [
          "Conservamos derechos sobre software y marca. Tú conservas tu contenido y nos concedes licencia para prestar el Servicio.",
        ],
      },
      {
        heading: "Responsabilidad",
        paragraphs: [
          "En la medida permitida por ley, no respondemos por daños indirectos. El límite agregado es la cuantía pagada en los doce meses anteriores al hecho, salvo límites legales imperativos.",
        ],
      },
      {
        heading: "Resolución y ley aplicable",
        paragraphs: [
          "Resolución según contrato o aviso escrito. Ley española; tribunales de Málaga, salvo normas imperativas de consumo.",
          "Contacto: hello@ringsaway.com",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    lastUpdated: "20 de mayo de 2026",
    sections: [
      {
        paragraphs: [
          "Explica el uso de cookies y tecnologías similares en ringsaway.com.",
        ],
      },
      {
        heading: "Qué son",
        paragraphs: [
          "Archivos pequeños en tu dispositivo para funcionamiento, preferencias o estadísticas.",
        ],
      },
      {
        heading: "Cookies que usamos",
        paragraphs: [
          "Necesarias: seguridad y funcionamiento básico.",
          "Analítica: Vercel Web Analytics, orientada a privacidad, sin cookies publicitarias.",
          "No usamos cookies de publicidad de terceros en el momento de esta política.",
        ],
      },
      {
        heading: "Gestión",
        paragraphs: [
          "Puedes bloquear o borrar cookies en el navegador. Puede afectar al funcionamiento del sitio.",
        ],
      },
      {
        heading: "Más información",
        paragraphs: ["Consulta la Política de privacidad. hello@ringsaway.com"],
      },
    ],
  },
};

export function getLegalDocument(
  key: LegalDocumentKey,
  locale: Locale
): LegalDocument {
  const docs = locale === "es" ? legalEs : legalEn;
  return docs[key];
}
