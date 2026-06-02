export const es = {
  nav: {
    phoneLine: "Cómo funciona",
    services: "Servicios",
    serviceAi: "Recepcionista IA",
    serviceVoc: "Voz del Cliente",
    pricing: "Precios",
    about: "Nosotros",
    news: "Noticias",
    ctaPricing: "Precios",
    ctaBookDemo: "Reservar demo",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  logo: { ariaHome: "Inicio RingsAway" },
  hero: {
    titleLines: [
      "No pierdas oportunidades.",
      "Haz que los clientes vuelvan.",
      "Entiende a tus clientes.",
    ],
    subtitle:
      "RingsAway contesta el teléfono de tu negocio, captura reservas, hace seguimiento a los clientes y convierte el feedback en acciones — para que crezcas sin más carga administrativa.",
    bullets: [
      "Atiende el teléfono de tu negocio 24/7",
      "Captura reservas automáticamente",
      "SMS de confirmación y recordatorios",
      "Seguimiento y campañas de clientes recurrentes",
      "Mejora las reseñas en Google",
      "Informes mensuales de Voz del Cliente",
    ],
    bookDemo: "Reservar demo",
    ctaMicro: "Una reserva perdida a menudo puede pagar RingsAway.",
  },
  agent: {
    speaking: "Hablando…",
    listening: "Escuchando…",
    connected: "Conectado",
    trySaying: "Prueba a decir",
    prompts: [
      "¿Puedes contarme más sobre el negocio?",
      "Me gustaría reservar una cita",
      "¿Cuál es vuestra disponibilidad?",
      "¿Cuánto cuesta?",
      "¿Dónde estáis ubicados?",
      "¿Puedo cambiar mi cita?",
    ],
    connecting: "Conectando…",
    startCall: "Iniciar llamada",
    callOr: "o llama al",
    callSuffix: "para hablar con el agente IA",
    endCall: "Finalizar llamada",
    errorConnection: "Error de conexión. Inténtalo de nuevo.",
    errorMic: "Permite el acceso al micrófono para hablar con nuestro agente IA.",
  },
  industries: {
    eyebrow: "Demos en vivo",
    title: "Escucha RingsAway por sector",
    subtitle:
      "Prueba una recepcionista IA adaptada a tu tipo de negocio. Más sectores en camino.",
    comingSoon: "Próximamente",
    tryDemo: "Probar demo en vivo",
    restaurantWorkflow: {
      packageLabel: "Recepcionista IA",
      viewWorkflow: "Flujo",
      modalTitle: "La Vista Marina — flujo Recepcionista IA",
      modalDescription:
        "Cómo llegan las llamadas a tu recepcionista IA y cómo las reservas y cancelaciones se sincronizan con Google Calendar y email.",
      caption:
        "El cliente llama a tu número real. Si estás ocupado, la llamada se desvía a una línea virtual donde la recepcionista IA responde con tu base de conocimiento — y luego las acciones de reserva se automatizan.",
      callPathTitle: "Cómo llega la llamada a tu IA",
      callPathBadge: "Línea telefónica",
      automationTitle: "Cuando la IA confirma la acción de reserva",
      flowBadge: "Automatización",
      newBookingTitle: "Nueva reserva",
      cancelTitle: "Cancelar reserva",
      callPath: {
        customerCall: "El cliente llama",
        yourNumber: "Tu número de negocio",
        yourNumberHint: "El mismo en Google y cartelería",
        lineBusy: "Línea ocupada / sin respuesta",
        forward: "Desvío a número virtual",
        forwardHint: "Enrutado RingsAway",
        voiceAgent: "Recepcionista IA por voz",
        voiceAgentHint: "Atiende 24/7 en ES / EN",
        knowledgeBase: "Base de conocimiento",
        knowledgeBaseHint: "Carta, horarios, FAQs, políticas",
      },
      nodes: {
        webhook: "Webhook",
        calendarGet: "Buscar reserva",
        calendarCreate: "Crear evento",
        calendarDelete: "Eliminar evento",
        if: "Si",
        ifHint: "¿Reserva encontrada?",
        branchNo: "No encontrada",
        branchYes: "Encontrada",
        gmailGuest: "Email al cliente",
        gmailOwner: "Email a ti",
        merge: "Combinar",
        respond: "Responder a la IA",
      },
    },
    salonWorkflow: {
      packageLabel: "Recepcionista IA",
      viewWorkflow: "Flujo",
      modalTitle: "Brows by Sarah — flujo recepcionista IA",
      modalDescription:
        "Cómo el agente ElevenLabs activa RingsAway: Timely para disponibilidad, reserva y cancelación; luego confirmación por email o WhatsApp y seguimiento de marketing a 30 días.",
      caption:
        "El cliente llama a tu número. La IA responde y la automatización corre en n8n — sincronizado con Timely.",
      callPathTitle: "Cómo llega la llamada a tu IA",
      callPathBadge: "Línea telefónica",
      automationTitle: "Después de la acción de la IA",
      pipelineTitle: "Pipeline de reservas",
      flowBadge: "Confirmación + marketing",
      footnote:
        "La IA pregunta si confirmar por WhatsApp o email. Tras reservar, la campaña de rebooking a 30 días corre en paralelo.",
      callPath: {
        customerCall: "El cliente llama",
        yourNumber: "Tu número de negocio",
        yourNumberHint: "Mismo número en Google y cartelería",
        lineBusy: "Línea ocupada / sin respuesta",
        forward: "Desvío a número virtual",
        forwardHint: "Enrutado RingsAway",
        voiceAgent: "Recepcionista IA por voz",
        voiceAgentHint: "Atiende 24/7 EN / ES",
        knowledgeBase: "Base de conocimiento",
        knowledgeBaseHint: "Servicios, disponibilidad, FAQs",
      },
      nodes: {
        webhook: "Webhook ElevenLabs",
        routeByAction: "Enrutar por acción",
        routeHint: "modo: Rules",
        branchCheck: "Consultar disponibilidad",
        branchBook: "Reservar cita",
        branchCancel: "Cancelar cita",
        branchFallback: "Fallback",
        timelyCheck: "Timely — consultar disponibilidad",
        timelyBook: "Timely — reservar cita",
        timelyCancel: "Timely — cancelar cita",
        bookConfirmIf: "¿Confirmación por email?",
        bookConfirmHint: "whatsapp o email",
        cancelConfirmIf: "¿Aviso cancelación por email?",
        cancelConfirmHint: "whatsapp o email",
        emailBookConfirm: "Email confirmación reserva",
        whatsappBookConfirm: "WhatsApp confirmación",
        emailCancelNotice: "Email aviso cancelación",
        whatsappCancelNotice: "WhatsApp aviso cancelación",
        respondAvailability: "Responder disponibilidad",
        respondBooked: "Responder reservado",
        respondCancelled: "Responder cancelado",
        respondUnknown: "Responder acción desconocida",
        waitMarketing: "Espera 30 días — marketing",
        triggerMarketing: "Campaña rebooking 30 días",
        parallelLabel: "También en paralelo",
      },
    },
    items: {
      restaurant: {
        name: "Restaurante",
        venue: "La Vista Marina, Manilva",
        description:
          "Reservas de mesa, horarios, preguntas dietéticas y noches de mucho servicio atendidas en tu línea.",
        modalTitle: "La Vista Marina, Manilva",
        modalDescription:
          "Habla con la recepcionista IA de La Vista Marina. Permite el micrófono cuando se solicite.",
        prompts: [
          "Quisiera reservar una mesa para cuatro esta noche",
          "¿Tenéis opciones vegetarianas?",
          "¿Cuál es el horario el domingo?",
          "¿Puedo cambiar mi reserva a las 20:00?",
        ],
      },
      salon: {
        name: "Esteticista",
        venue: "Brows by Sarah",
        description:
          "Citas, disponibilidad de estilistas y consultas de servicios mientras el equipo atiende en sala.",
        modalTitle: "Brows by Sarah",
        modalDescription:
          "Habla con la recepcionista IA de Brows by Sarah. Permite el micrófono cuando se solicite.",
        prompts: [
          "Quisiera reservar una cita para cejas",
          "¿Tenéis disponibilidad esta semana?",
          "¿Cuánto dura un lash lift?",
          "¿Puedo cambiar mi cita?",
        ],
      },
      estateAgency: {
        name: "Inmobiliaria",
        description:
          "Solicitudes de visitas, preguntas sobre propiedades y captación de llamadas de compradores e inquilinos.",
        modalTitle: "Demo inmobiliaria",
        modalDescription: "Próximamente.",
        prompts: [],
      },
      clinic: {
        name: "Clínica",
        description:
          "Programación de citas, ubicación y horarios, y gestión tranquila de consultas de pacientes.",
        modalTitle: "Demo clínica",
        modalDescription: "Próximamente.",
        prompts: [],
      },
    },
  },
  stats: {
    title: "Diseñado para cómo te llaman los clientes locales",
    subtitle:
      "Tu número real de negocio, atendido a todas horas, más informes mensuales que elabora nuestro agente de investigación UX a partir de tus reseñas y comentarios.",
    body: "Salones, clínicas, oficios y tiendas usan RingsAway en la línea que los clientes ya confían, no en otra app ni chat.",
    stat1Value: "24/7",
    stat1Label: "Cobertura telefónica",
    stat2Value: "3×",
    stat2Label: "Más reservas captadas",
    stat3Value: "100+",
    stat3Label: "Reseñas por informe",
    quote:
      "Dejamos de perder llamadas por la noche. Las reservas entran mientras seguimos con clientes. El teléfono por fin funciona.",
    quoteAuthor: "Sarah M., dueña de salón",
  },
  phone: {
    eyebrow: "Cómo funciona",
    title: "Cómo RingsAway ayuda a hacer crecer tu negocio",
    subtitle: "Desde la primera consulta hasta clientes recurrentes e información del cliente.",
    badge: "Siempre activo",
    lineLabel: "Dónde te contactan los clientes",
    lineCaption: "Teléfono, WhatsApp, web y email — una experiencia conectada",
    flowChannels: ["Teléfono", "WhatsApp", "Web"],
    flowBrand: "RingsAway",
    flowBadge: "🟢 Conectado 24/7",
    clarifiers: [
      "Funciona con tu número y canales actuales",
      "Los clientes usan lo que ya conocen — sin instalar otra app",
      "Automatización desde la consulta hasta el seguimiento y el análisis",
    ],
    steps: [
      {
        title: "Los clientes contactan tu negocio",
        text: "Te contactan por los mismos canales de siempre — llamadas, WhatsApp, consultas en la web o mensajes.",
        badge: "Teléfono • WhatsApp • Email",
      },
      {
        title: "RingsAway contesta y captura reservas",
        text: "RingsAway responde preguntas, consulta disponibilidad, reserva citas o mesas y captura consultas automáticamente.",
        badge: "IA activa 24/7",
      },
      {
        title: "Confirmaciones y recordatorios automáticos",
        text: "Los clientes reciben confirmaciones y recordatorios por SMS, WhatsApp o email para reducir ausencias y mejorar la experiencia.",
        badge: "SMS • WhatsApp • Email",
      },
      {
        title: "Seguimiento y campañas de clientes recurrentes",
        text: "Tras la visita, RingsAway puede enviar seguimientos, información de cuidados posteriores y campañas de reserva repetida.",
        badge: "Automatización de fidelización",
        examples: [
          { industry: "Salón", quote: "Tu retoque de color toca en 6 semanas" },
          { industry: "Restaurante", quote: "Nuevo menú de temporada disponible" },
          { industry: "Clínica", quote: "¿Cómo te encuentras tras el tratamiento?" },
        ],
      },
      {
        title: "Entiende lo que dicen tus clientes",
        text: "Los informes mensuales de Voz del Cliente analizan reseñas y feedback para detectar quejas, tendencias y acciones que mejoran tu negocio.",
        badge: "Informes VoC mensuales",
      },
    ],
    step: "Paso",
    phases: ["Captar", "Convertir", "Fidelizar", "Mejorar"],
  },
  problem: {
    eyebrow: "El problema",
    title: "Los negocios locales pierden clientes de dos formas",
    subtitle: "Llamadas perdidas, reseñas ignoradas y seguimiento que no llega.",
    cards: [
      { title: "Consultas perdidas", text: "Llaman cuando el equipo está ocupado y acaban con quien contesta." },
      { title: "Feedback invisible", text: "Las reseñas tienen valor pero casi nunca se convierten en un plan mensual claro." },
      { title: "Mal seguimiento", text: "Oportunidades que se pierden después del primer contacto." },
    ],
  },
  solution: {
    eyebrow: "Servicios",
    title: "Dos servicios. Roles claros.",
    subtitle:
      "Tu línea telefónica y la opinión del cliente son trabajos distintos. RingsAway ofrece Recepcionista IA y Voz del Cliente (VoC) como servicios separados, o juntos en un plan.",
    pickerLabel: "Elige un servicio",
    tabs: {
      ai: "Recepcionista IA",
      voc: "Voz del Cliente",
    },
    ai: {
      badge: "Servicio 1",
      title: "Recepcionista IA",
      tagline: "Tu número de negocio, atendido 24/7",
      description:
        "Un agente IA dedicado en tu línea existente. Atiende cuando no puedes, reserva citas, responde FAQs y envía confirmaciones. Es operación telefónica, no análisis de reseñas.",
      features: [
        "Atiende tu línea telefónica real",
        "Reserva citas y responde FAQs",
        "Envía confirmaciones automáticamente",
        "Llamadas en inglés y español",
      ],
      liveDemosCta: "Demos en vivo",
      liveOnLine: "Activo en tu línea",
      pickup: "Atención 24/7",
      aiTrained: "IA formada en tu negocio",
    },
    voc: {
      badge: "Servicio 2",
      title: "Voz del Cliente (VoC)",
      tagline: "Informes mensuales de lo que dicen tus clientes",
      priceOneOff: "89 € por informe",
      priceShort: "89 €",
      description:
        "Un informe mensual aparte elaborado por nuestro agente de investigación UX. Leemos Google Reviews, Trustpilot y TripAdvisor — podemos añadir otras fuentes de reseñas bajo petición — además de feedback web y encuestas, y entregamos quejas, elogios, tendencias de sentimiento, competencia, ideas de respuesta y un plan de acción priorizado. Informes puntuales: 89 €.",
      highlights: [
        "Google Reviews, Trustpilot, TripAdvisor — más fuentes bajo petición",
        "Principales quejas y temas de elogio",
        "Tendencias de sentimiento mes a mes",
        "Respuestas sugeridas para Google",
        "Estrategia Google Business incluida",
      ],
      cta: "Qué incluye tu informe",
      reviewSources: {
        google: "Google",
        trustpilot: "Trustpilot",
        tripadvisor: "TripAdvisor",
      },
      floatingReviews: [
        {
          quote:
            "La mejor paella de la zona — el personal recordó nuestro aniversario.",
          author: "Claire M.",
          stars: 5,
          source: "google",
        },
        {
          quote: "Comida excelente pero esperamos 25 minutos para mesa el viernes.",
          author: "James T.",
          stars: 3,
          source: "trustpilot",
        },
        {
          quote: "Terraza y ambiente preciosos. Volveremos sin duda.",
          author: "Antonio R.",
          stars: 5,
          source: "tripadvisor",
        },
      ],
    },
  },
  vocDemos: {
    eyebrow: "Informes de clientes",
    title: "Informes VoC reales de reseñas de Google",
    subtitle:
      "Puntuaciones y temas de negocios reales que analizamos. Abra un informe para ver sentimiento, quejas, elogios y acciones mensuales — el mismo entregable que recibe usted.",
    tabsLabel: "Sector",
    viewReport: "Ver informe",
    hideReport: "Ocultar informe",
    getMyReport: "Quiero mi informe — 89 €",
    comingSoon: "Próximamente",
    comingSoonBlurb: "Informe VoC para este sector en camino.",
    scoreLabel: "Puntuación VoC",
    tiers: {
      great: "Excelente",
      good: "Bueno",
      fair: "Regular",
      bad: "Deficiente",
    },
    sourceGoogle: "Google",
    sourceTrustpilot: "Trustpilot",
    sourceTripadvisor: "TripAdvisor",
    reviewsAnalyzed: "{{count}} reseñas analizadas",
    report: {
      sampleHeading: "Qué incluye tu informe mensual",
      trendingTitle: "Temas en tendencia",
      replyLabel: "Respuesta sugerida para Google",
    },
    industries: {
      restaurant: {
        available: true,
        tabName: "Restaurante",
        businessName: "La Vista Marina",
        location: "Manilva, España",
        listingGapsTitle: "Carencias en ficha y carta",
        source: "google",
        reviewCount: 128,
        score: 72,
        scoreLabel: "Bueno",
        period: "Marzo 2026",
        metrics: [
          { key: "service", label: "Servicio", value: 88, color: "violet" },
          { key: "food", label: "Calidad de comida", value: 76, color: "amber" },
          { key: "atmosphere", label: "Ambiente", value: 82, color: "green" },
          { key: "value", label: "Relación calidad-precio", value: 64, color: "red" },
        ],
        sentiment: {
          chartLabel: "Puntuación de sentimiento",
          trend: "↑ Mejorando",
          months: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
          bars: [48, 52, 55, 61, 68, 72],
        },
        menuGaps: [
          "Carta de noche no visible en Fotos de Google",
          "Opciones vegetarianas ausentes en la descripción del negocio",
          "Horario del domingo desactualizado en la ficha",
        ],
        trending: [
          { topic: "Tiempos de espera", count: 24, tone: "negative" },
          { topic: "Marisco fresco", count: 31, tone: "positive" },
          { topic: "Vistas al puerto", count: 18, tone: "positive" },
          { topic: "Reservas viernes", count: 14, tone: "negative" },
          { topic: "Reservas por teléfono", count: 12, tone: "positive" },
        ],
        positives: [
          "Marisco fresco y pesca del día elogiados en 31 reseñas",
          "Equipo amable — reservas por teléfono descritas como muy fáciles",
          "Vistas al puerto mencionadas como motivo para volver",
        ],
        negatives: [
          "Retrasos en reservas del viernes por noche",
          "Pocas opciones veganas señaladas en 9 reseñas",
          "Indicaciones de aparcamiento poco claras para nuevos clientes",
        ],
        recommendations: [
          { priority: "High", text: "Actualizar horario del domingo en Google Business esta semana" },
          { priority: "High", text: "Responder a 4 reseñas de 3 estrellas sin resolver de febrero" },
          { priority: "Medium", text: "Añadir fotos de carta de noche y etiquetas de platos vegetarianos" },
          { priority: "Low", text: "Publicar consejo de aparcamiento en preguntas de la ficha" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Tiempos de espera en noches ocupadas (24 menciones)",
              "Traspaso de reservas los viernes (14 menciones)",
              "Aparcamiento e indicaciones (6 menciones)",
            ],
            review: {
              author: "James T.",
              source: "Google",
              stars: 2,
              quote:
                "Esperamos 25 minutos para una mesa reservada. El personal fue amable pero claramente desbordado un viernes por la noche.",
              tags: ["Tiempos de espera", "Reservas"],
            },
          },
          praise: {
            themes: [
              "Marisco fresco y pesca del día (31 menciones)",
              "Reservas telefónicas fáciles (12 menciones)",
              "Vistas al puerto y ambiente (18 menciones)",
            ],
            review: {
              author: "Sarah M.",
              source: "Google",
              stars: 5,
              quote:
                "Llamé fuera de horario y reservaron al momento. Equipo amable y justo el horario que queríamos.",
              tags: ["Reservas", "Fuera de horario"],
            },
          },
          competitors: {
            chartLabel: "Valoración media cuando se menciona",
            note: "De 12 menciones comparativas este mes",
            rows: [
              { name: "La Vista Marina", rating: 4.6, highlight: true },
              { name: "Coastal Bistro", rating: 4.2, highlight: false },
              { name: "Harbour Kitchen", rating: 4.4, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "Reseña de 3 estrellas",
            reviewAuthor: "James T.",
            reviewQuote:
              "Esperamos 25 minutos para una mesa reservada. El personal fue amable pero claramente desbordado.",
            replyLabel: "Respuesta sugerida para Google",
            replyText:
              "Gracias por contárnoslo, James. Fallamos con tu reserva del viernes y es responsabilidad nuestra. Llámanos y reservaremos tu próxima visita con un entrante de cortesía.",
          },
          googleStrategy: [
            "Priorizar respuestas a reseñas de 3 estrellas del último mes",
            "Publicar una foto semanal (carta, terraza, equipo)",
            "Destacar horario del domingo y festivos en la ficha",
          ],
        },
      },
      salon: {
        available: true,
        tabName: "Salón",
        businessName: "Coastal Hair Studio",
        location: "Estepona, España",
        listingGapsTitle: "Carencias en ficha y servicios",
        source: "google",
        reviewCount: 94,
        score: 78,
        scoreLabel: "Bueno",
        period: "Marzo 2026",
        metrics: [
          { key: "styling", label: "Estilismo", value: 91, color: "green" },
          { key: "booking", label: "Facilidad de cita", value: 74, color: "amber" },
          { key: "atmosphere", label: "Experiencia en salón", value: 85, color: "green" },
          { key: "value", label: "Relación calidad-precio", value: 70, color: "amber" },
        ],
        sentiment: {
          chartLabel: "Puntuación de sentimiento",
          trend: "↑ Mejorando",
          months: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
          bars: [58, 61, 63, 70, 74, 78],
        },
        menuGaps: [
          "Lista de precios completa no publicada en Google Business",
          "Servicios de novias y eventos no aparecen en la ficha",
          "Enlace de reserva online en la ficha lleva a página antigua",
        ],
        trending: [
          { topic: "Corrección de color", count: 22, tone: "positive" },
          { topic: "Misma estilista", count: 19, tone: "positive" },
          { topic: "Espera sábados", count: 16, tone: "negative" },
          { topic: "Sin cita previa", count: 11, tone: "neutral" },
          { topic: "Tratamientos capilares", count: 9, tone: "positive" },
        ],
        positives: [
          "Color y balayage elogiados en 22 reseñas",
          "Clientes piden la misma estilista — confianza en el equipo",
          "Ambiente limpio y relajado mencionado con frecuencia",
        ],
        negatives: [
          "Citas del sábado con retraso en 16 reseñas",
          "Sorpresas de precio cuando se añaden extras",
          "Teléfono sin contestar en horas punta de color",
        ],
        recommendations: [
          { priority: "High", text: "Publicar carta de servicios y rangos de precio en Google" },
          { priority: "High", text: "Responder a 3 reseñas recientes sobre retrasos del sábado" },
          { priority: "Medium", text: "Corregir URL de reservas y añadir servicios de novias" },
          { priority: "Low", text: "Publicar política de visitas sin cita en preguntas de la ficha" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Retrasos en citas del sábado (16 menciones)",
              "Claridad de precios al pagar (11 menciones)",
              "Llamadas sin contestar en sesiones de color (8 menciones)",
            ],
            review: {
              author: "Elena R.",
              source: "Google",
              stars: 2,
              quote:
                "Me encanta el color pero esperé 40 minutos más allá de mi cita del sábado. Nadie explicó el retraso.",
              tags: ["Esperas", "Comunicación"],
            },
          },
          praise: {
            themes: [
              "Resultados de color y balayage (22 menciones)",
              "Fidelidad a la misma estilista (19 menciones)",
              "Ambiente relajado del salón (14 menciones)",
            ],
            review: {
              author: "Michelle K.",
              source: "Google",
              stars: 5,
              quote:
                "El mejor balayage que he tenido en la costa. Emma escuchó, el resultado es natural y el salón transmite calma.",
              tags: ["Color", "Estilista"],
            },
          },
          competitors: {
            chartLabel: "Valoración media cuando se menciona",
            note: "De 9 menciones comparativas este mes",
            rows: [
              { name: "Coastal Hair Studio", rating: 4.7, highlight: true },
              { name: "Studio 45 Estepona", rating: 4.4, highlight: false },
              { name: "Hair Lounge Marbella", rating: 4.3, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "Reseña de 3 estrellas",
            reviewAuthor: "Elena R.",
            reviewQuote:
              "Me encanta el color pero esperé 40 minutos más allá de mi cita del sábado.",
            replyLabel: "Respuesta sugerida para Google",
            replyText:
              "Gracias, Elena — esperar tanto no es aceptable. Escríbenos con tu próxima franja preferida y te priorizamos con un tratamiento de cortesía.",
          },
          googleStrategy: [
            "Publicar lista de precios y servicios de novias en la ficha",
            "Responder a reseñas sobre esperas del sábado en 48 horas",
            "Añadir fotos mensuales del interior y resultados de color",
          ],
        },
      },
      estateAgency: {
        available: true,
        tabName: "Inmobiliaria",
        businessName: "Marbella Homes",
        location: "Marbella, España",
        listingGapsTitle: "Carencias en ficha y perfil",
        source: "tripadvisor",
        reviewCount: 67,
        score: 69,
        scoreLabel: "Regular",
        period: "Marzo 2026",
        metrics: [
          { key: "listings", label: "Fichas de propiedades", value: 82, color: "green" },
          { key: "response", label: "Tiempo de respuesta", value: 58, color: "red" },
          { key: "communication", label: "Comunicación", value: 71, color: "amber" },
          { key: "trust", label: "Confianza y transparencia", value: 75, color: "amber" },
        ],
        sentiment: {
          chartLabel: "Puntuación de sentimiento",
          trend: "↑ Mejorando",
          months: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
          bars: [52, 54, 56, 62, 66, 69],
        },
        menuGaps: [
          "Equipo angloparlante no destacado en el perfil de TripAdvisor",
          "Fotos de obra nueva ausentes en el listado",
          "Guías de zona para Manilva y Estepona sin enlazar",
        ],
        trending: [
          { topic: "Puntualidad visitas", count: 18, tone: "negative" },
          { topic: "Apartamentos con vistas", count: 25, tone: "positive" },
          { topic: "Gestión de alquileres", count: 14, tone: "positive" },
          { topic: "Velocidad de seguimiento", count: 21, tone: "negative" },
          { topic: "Conocimiento local", count: 17, tone: "positive" },
        ],
        positives: [
          "Buen conocimiento de barrios de la Costa del Sol",
          "Propiedades con vistas al mar bien presentadas",
          "Clientes de alquiler elogian el contacto de gestión",
        ],
        negatives: [
          "Lentitud al devolver llamadas en 21 reseñas",
          "Visitas reprogramadas sin aviso en varios casos",
          "Claridad de honorarios cuestionada en 8 reseñas",
        ],
        recommendations: [
          { priority: "High", text: "Responder consultas de TripAdvisor en 4 horas laborables" },
          { priority: "High", text: "Añadir galería de obra nueva y nota del equipo en inglés" },
          { priority: "Medium", text: "Confirmación SMS estándar para cada visita reservada" },
          { priority: "Low", text: "Publicar FAQ de honorarios en el perfil" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Seguimiento lento tras consultas (21 menciones)",
              "Visitas reprogramadas sin aviso (12 menciones)",
              "Preguntas sobre honorarios (8 menciones)",
            ],
            review: {
              author: "David P.",
              source: "TripAdvisor",
              stars: 2,
              quote:
                "Interesado en un alquiler con vistas al mar pero tardaron tres días en responder. La visita se movió dos veces.",
              tags: ["Tiempo de respuesta", "Visitas"],
            },
          },
          praise: {
            themes: [
              "Conocimiento de la zona (17 menciones)",
              "Presentación de propiedades con vistas (25 menciones)",
              "Contacto en gestión de alquileres (14 menciones)",
            ],
            review: {
              author: "Claire W.",
              source: "TripAdvisor",
              stars: 5,
              quote:
                "Consejo honesto sobre barrios, visita fluida y resolvieron todas las dudas de nuestro alquiler con profesionalidad.",
              tags: ["Zona", "Alquileres"],
            },
          },
          competitors: {
            chartLabel: "Valoración media cuando se menciona",
            note: "De 11 menciones comparativas este mes",
            rows: [
              { name: "Marbella Homes", rating: 4.5, highlight: true },
              { name: "Costa Living Estates", rating: 4.3, highlight: false },
              { name: "Puerto Banús Properties", rating: 4.4, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "Reseña de 3 estrellas",
            reviewAuthor: "David P.",
            reviewQuote:
              "Interesado en un alquiler con vistas al mar pero tardaron tres días en responder. La visita se movió dos veces.",
            replyLabel: "Respuesta sugerida",
            replyText:
              "David, gracias por tu paciencia — debimos responder el mismo día. Te asignamos un contacto dedicado y confirmaremos la próxima visita por SMS.",
          },
          googleStrategy: [
            "Destacar equipo angloparlante en el perfil de TripAdvisor",
            "Añadir galería de obra nueva y guías de Manilva / Estepona",
            "Publicar disponibilidad de visitas semanalmente en temporada alta",
          ],
        },
      },
      clinic: {
        available: true,
        tabName: "Clínica",
        businessName: "Centro Médico Manilva",
        location: "Manilva, España",
        listingGapsTitle: "Carencias en ficha y servicios",
        source: "google",
        reviewCount: 103,
        score: 81,
        scoreLabel: "Excelente",
        period: "Marzo 2026",
        metrics: [
          { key: "care", label: "Atención al paciente", value: 89, color: "green" },
          { key: "appointments", label: "Citas", value: 76, color: "amber" },
          { key: "staff", label: "Personal y trato", value: 84, color: "green" },
          { key: "facility", label: "Instalaciones", value: 78, color: "amber" },
        ],
        sentiment: {
          chartLabel: "Puntuación de sentimiento",
          trend: "↑ Mejorando",
          months: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
          bars: [65, 68, 70, 74, 78, 81],
        },
        menuGaps: [
          "Aseguradoras aceptadas no listadas en Google",
          "Horario de urgencias poco claro en la ficha",
          "Instrucciones de aparcamiento ausentes para nuevos pacientes",
        ],
        trending: [
          { topic: "Espera médico de cabecera", count: 20, tone: "negative" },
          { topic: "Enfermeras amables", count: 28, tone: "positive" },
          { topic: "Atención en inglés", count: 24, tone: "positive" },
          { topic: "Reserva por teléfono", count: 15, tone: "positive" },
          { topic: "Retraso recetas", count: 11, tone: "negative" },
        ],
        positives: [
          "Calidez del personal de enfermería en 28 reseñas",
          "Inglés y español bien atendidos en recepción",
          "Reserva telefónica descrita como rápida y clara",
        ],
        negatives: [
          "Disponibilidad de médico de cabecera frustrante en 20 reseñas",
          "Espera al recoger recetas en 11 reseñas",
          "Confusión con aparcamiento en primera visita",
        ],
        recommendations: [
          { priority: "High", text: "Listar seguros aceptados y horario de urgencias en Google" },
          { priority: "High", text: "Responder a reseñas de febrero sobre esperas del médico" },
          { priority: "Medium", text: "Añadir mapa de aparcamiento y acceso en la ficha" },
          { priority: "Low", text: "Publicar horarios de recogida de recetas en preguntas" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Disponibilidad de médico de cabecera (20 menciones)",
              "Espera al recoger recetas (11 menciones)",
              "Aparcamiento en primera visita (6 menciones)",
            ],
            review: {
              author: "Robert H.",
              source: "Google",
              stars: 2,
              quote:
                "Las enfermeras fueron encantadoras pero no pude cita con el médico en dos semanas. Me sentí bloqueado para un problema simple.",
              tags: ["Médico", "Citas"],
            },
          },
          praise: {
            themes: [
              "Calidez del personal de enfermería (28 menciones)",
              "Inglés y español en recepción (24 menciones)",
              "Reserva telefónica clara (15 menciones)",
            ],
            review: {
              author: "Linda S.",
              source: "Google",
              stars: 5,
              quote:
                "Recepción gestionó mi cita en inglés rápidamente. Las enfermeras fueron amables y explicaron todo con claridad.",
              tags: ["Personal", "Reservas"],
            },
          },
          competitors: {
            chartLabel: "Valoración media cuando se menciona",
            note: "De 7 menciones comparativas este mes",
            rows: [
              { name: "Centro Médico Manilva", rating: 4.5, highlight: true },
              { name: "Clínica Estepona", rating: 4.2, highlight: false },
              { name: "Sabinillas Health", rating: 4.1, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "Reseña de 3 estrellas",
            reviewAuthor: "Robert H.",
            reviewQuote:
              "Las enfermeras fueron encantadoras pero no pude cita con el médico en dos semanas.",
            replyLabel: "Respuesta sugerida para Google",
            replyText:
              "Robert, lamentamos las dificultades para reservar. Hemos abierto más huecos telefónicos de médico de cabecera — llama a recepción y te orientamos o te derivamos a la vía urgente adecuada.",
          },
          googleStrategy: [
            "Listar seguros aceptados y horario de urgencias de forma visible",
            "Responder a reseñas sobre esperas del médico con pasos claros",
            "Añadir mapa de aparcamiento e instrucciones de primera visita",
          ],
        },
      },
    },
  },
  caseStudies: {
    carouselEyebrow: "Informes reales",
    carouselTitle: "Informes VoC de negocios que analizamos",
    filterAll: "Todos",
    viewReport: "Ver informe",
    scrollPrev: "Anterior",
    scrollNext: "Siguiente",
    loadingCarousel: "Cargando informes…",
    loadingReport: "Cargando informe…",
    reportUnavailable: "No se pudo cargar este informe.",
    defaultTitle: "Informe VoC",
    previewFootnote: "Informes VoC mensuales preparados para su negocio por RingsAway.",
    paywallTitle: "Para ver el informe completo",
    paywallBody:
      "Quejas, elogios, competencia, borradores de respuesta y el plan de acción de {{business}} están en el informe mensual completo.",
    getFullReport: "Obtener informe completo",
    reportPrice: "89 € por informe",
    reportPriceCta: "Informe completo — 89 €",
    getInTouch: "Contactar",
    emptyGridHint:
      "Publique un informe listo desde el panel (Caso de estudio → fila de informes VoC) para mostrarlo aquí.",
    searchPlaceholder: "Buscar por nombre o ubicación…",
    noSearchResults: "Ningún informe coincide con su búsqueda o filtro.",
  },
  integrations: {
    eyebrow: "Integraciones",
    title: "Funciona con las herramientas que ya usas",
    subtitle:
      "Conecta calendarios, plataformas de reservas, mensajería y CRM. Integramos RingsAway con tu stack en la configuración.",
    footnote:
      "¿Necesitas otra cosa? Cuéntanos en el formulario de contacto — integraciones a medida en Enterprise.",
    categories: {
      restaurants: {
        title: "Restaurantes",
        items: {
          coverManager: "CoverManager",
          openTable: "OpenTable",
          googleCalendar: "Google Calendar",
        },
      },
      salonsBeauty: {
        title: "Salones y belleza",
        items: {
          timely: "Timely",
          fresha: "Fresha",
          treatwell: "Treatwell",
        },
      },
      propertyTourism: {
        title: "Propiedad y turismo",
        items: {
          airbnb: "Airbnb",
          bookingCom: "Booking.com",
        },
      },
      communication: {
        title: "Comunicación",
        items: {
          twilio: "Twilio",
          whatsapp: "WhatsApp",
          gmail: "Gmail",
          zadarma: "Zadarma",
        },
      },
      businessTools: {
        title: "Herramientas de negocio",
        items: {
          googleCalendar: "Google Calendar",
          outlook: "Outlook",
          hubspot: "HubSpot",
        },
      },
    },
  },
  pipeline: {
    eyebrow: "Cómo funciona",
    title: "Cómo RingsAway trabaja para tu negocio",
    subtitle:
      "La Recepcionista IA atiende llamadas en vivo. VoC convierte reseñas y feedback en acciones mensuales. Juntos cubren el ciclo completo.",
    inLabel: "Entrada",
    inItems: ["Llamadas a tu número", "Reseñas de clientes", "Consultas"],
    brandLabel: "RingsAway",
    brandItems: ["IA contesta y reserva"],
    outLabel: "Salida",
    outItems: ["Reservas captadas", "Informe de feedback preparado", "Plan y acciones Google"],
    youLabel: "Tú recibes",
    youItems: [
      "Actualizaciones de calendario",
      "Confirmaciones por email",
      "Informe mensual de feedback",
      "Estrategia Google Business",
    ],
  },
  voc: {
    eyebrow: "Informes de opinión del cliente",
    title: "Voz del Cliente, explicada en lenguaje claro",
    introBefore: "VoC no es jerga de grandes corporaciones. Es escuchar lo que dicen los clientes, entender patrones y",
    introEmphasis: "hacer algo al respecto",
    introAfter:
      ", incluido tu perfil de Google Business, donde mucha gente decide si te llama.",
    viewDemoReports: "Ver informes de clientes",
    whatTitle: "¿Qué es VoC?",
    whatBody:
      "Voz del Cliente (VoC) significa escuchar lo que la gente dice de tu negocio: reseñas Google, tu web, encuestas y feedback tras la visita. Luego te ayudamos a darle sentido.",
    whyTitle: "Por qué importa",
    whyBody:
      "Las estrellas solas no dicen qué arreglar. VoC muestra los temas reales (esperas, personal, precios, calidad) para mejorar lo que importa al cliente, no lo que adivinas.",
    actionTitle: "Acción + Google",
    actionBody:
      "Cada mes convertimos el feedback en pasos claros: qué cambiar en el negocio, cómo responder en Google y una estrategia práctica de Google Business para que tu ficha trabaje más.",
    monthlyNote:
      "Cada mes nuestro agente de investigación UX prepara tu informe. Leemos reseñas de Google Business, tu web, encuestas y satisfacción del cliente, para que tengas temas, acciones y un plan Google que puedas seguir.",
    accordionHeading: "Qué incluye tu informe mensual",
    panels: {
      complaints: {
        title: "Principales quejas",
        description:
          "Leemos reseñas Google, feedback web y encuestas, y señalamos de qué se quejan más para que arregles lo correcto primero.",
      },
      praise: {
        title: "Temas de elogio",
        description:
          "Destacamos lo que aman en sus palabras: frases y experiencias que se repiten en reseñas de cinco estrellas.",
      },
      sentiment: {
        title: "Sentimiento del cliente",
        description:
          "Seguimos si el ánimo mejora mes a mes según reseñas y satisfacción, no solo la media de estrellas.",
      },
      competitors: {
        title: "Comparación con competencia",
        description: "Cuando mencionan rivales, anotamos por qué y dónde ya les ganas.",
      },
      suggestions: {
        title: "Ideas para responder reseñas",
        description: "Textos opcionales que sugerimos para Google. Tú eliges qué publicar, con tu voz.",
      },
      google: {
        title: "Estrategia Google Business",
        description:
          "Guía práctica para tu perfil: qué reseñas contestar, qué publicar, qué destacar en fotos u ofertas y cómo el feedback debe moldear tu presencia local.",
        imageAlt: "Perfil de Google Business",
      },
      actions: {
        title: "Plan de acción mensual",
        description:
          "Lista breve y priorizada del mes: arreglos en el negocio, reputación y pasos en Google ordenados por impacto.",
      },
    },
    previews: {
      complaints: {
        author: "James T.",
        source: "Google",
        stars: 2,
        quote:
          "Esperamos 25 minutos para una mesa reservada. El personal fue amable pero claramente desbordado un viernes por la noche.",
        tags: ["Tiempos de espera", "Reservas"],
      },
      praise: {
        author: "Sarah M.",
        source: "Google",
        stars: 5,
        quote:
          "Llamé fuera de horario y reservaron al momento. Equipo amable y justo el hueco que queríamos.",
        tags: ["Reserva fácil", "Fuera de horario"],
      },
      sentiment: {
        chartLabel: "Puntuación de sentimiento",
        trend: "↑ Mejorando",
        months: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
        bars: [42, 48, 45, 58, 64, 72],
      },
      competitors: {
        chartLabel: "Nota media cuando te mencionan",
        note: "De 12 menciones comparativas este mes",
        rows: [
          { name: "Tu negocio", rating: 4.6, highlight: true },
          { name: "Coastal Bistro", rating: 4.2, highlight: false },
          { name: "Harbour Kitchen", rating: 4.4, highlight: false },
        ],
      },
      suggestions: {
        reviewLabel: "Reseña de 3 estrellas",
        reviewAuthor: "James T.",
        reviewQuote:
          "Esperamos 25 minutos para una mesa reservada. El personal fue amable pero claramente desbordado.",
        replyLabel: "Respuesta sugerida en Google",
        replyText:
          "Gracias por contárnoslo, James. Fallamos con tu reserva del viernes y es responsabilidad nuestra. Escríbenos o llama: guardamos tu próxima visita e incluimos un entrante de cortesía.",
      },
      actions: {
        title: "Prioridades de marzo",
        items: [
          { priority: "Alta", text: "Responder a 3 reseñas negativas de febrero" },
          { priority: "Alta", text: "Arreglar el traspaso de reservas del viernes en sala" },
          { priority: "Media", text: "Publicar horario semanal actualizado en Google" },
          { priority: "Baja", text: "Añadir fotos del nuevo menú de noche" },
        ],
      },
    },
  },
  news: {
    eyebrow: "Noticias",
    title: "Actualizaciones y guías",
    subtitle:
      "Noticias del producto y consejos prácticos para negocios locales que viven del teléfono, desde nuestro equipo en Manilva, España.",
    latest: "Lo último",
    viewAll: "Ver todos los artículos",
    viewAllMobile: "Ver todos los artículos →",
    readMore: "Leer más",
    categoryArticle: "Artículo",
    categoryUpdate: "Actualización",
    readArticle: "Leer artículo",
    fromTeam: "Del equipo RingsAway",
    allNews: "Todas las noticias",
    backToHomepage: "Volver al inicio",
    backHome: "← Volver al inicio",
    indexTitle: "Actualizaciones y guías",
    indexSubtitle:
      "Noticias del producto y consejos prácticos para negocios locales que viven del teléfono, desde nuestro equipo en Manilva, España.",
    paginationPrev: "Anterior",
    paginationNext: "Siguiente",
    paginationLabel: "Paginación de noticias",
    paginationPage: "Página {current} de {total}",
    items: [
      {
        slug: "what-is-gsm-local-businesses",
        category: "article",
        title:
          "¿Qué es GSM y por qué sigue importando para los negocios locales?",
        excerpt:
          "GSM marcó las llamadas móviles y los SMS que los negocios locales siguen usando. Qué es GSM, qué códigos de desvío conviene conocer y cómo enlazan con recepcionistas IA y recuperación de llamadas perdidas.",
        readTime: "14 min de lectura",
        tags: [
          "GSM",
          "Desvío de llamadas",
          "Recepcionista IA",
          "SMS",
          "Llamadas perdidas",
          "Negocio local",
          "Teléfono",
        ],
        imageAlt:
          "Teléfono móvil de negocio con desvío de llamadas y SMS para comunicación con clientes locales",
        body: [],
      },
      {
        slug: "missed-calls-are-costing-local-businesses",
        category: "article",
        title: "Las llamadas perdidas cuestan más de lo que creen los negocios locales",
        excerpt:
          "Muchos negocios miden visitas web y reservas, pero las llamadas sin contestar suelen pasar desapercibidas. Por qué cada llamada perdida puede ser ingreso que se escapa.",
        readTime: "5 min de lectura",
        tags: ["Recepcionista IA", "IA", "Llamadas", "Negocio local", "Leads", "Automatización"],
        imageAlt: "Llamada entrante en el teléfono del negocio mientras el equipo atiende clientes",
        body: [],
      },
      {
        slug: "best-bars-sotogrande",
        category: "article",
        title:
          "Mejores bares en Sotogrande: guía local de copas, deporte, cócteles y vistas en la marina",
        excerpt:
          "Guía práctica de bares en Sotogrande, desde terrazas en la marina y cócteles en azoteas hasta pubs deportivos y locales nocturnos, con enlaces a cada venue y categoría en Sotogrande Guide.",
        readTime: "6 min de lectura",
        tags: ["SEO local", "Sotogrande", "Hostelería"],
        imageAlt: "Cócteles y terrazas de bares en la marina de Sotogrande",
        body: [],
      },
      {
        slug: "google-listing-phone-line",
        category: "article",
        title: "La línea de tu ficha de Google es tu escaparate más ocupado",
        excerpt:
          "La mayoría de clientes locales aún llaman antes de reservar online. Si ese número suena ocupado, pierdes trabajos a quien conteste primero.",
        readTime: "4 min de lectura",
        tags: ["SEO local", "Teléfono"],
        imageAlt: "Ficha de Google en un móvil con llamada entrante",
        body: [
          "Para la mayoría de negocios locales, el teléfono de tu ficha de Google genera más consultas serias que el formulario web. Alguien que quiere peluquería, revisión dental o fontanero de urgencia no quiere esperar al lunes por la mañana.",
          "Si la llamada va al buzón o suena ocupado mientras atiendes a un cliente, casi nunca dejan mensaje. Llaman al siguiente resultado en Google. No es un problema de marca: es ingreso perdido que no ves en analítica.",
          "RingsAway contesta en tu número de negocio existente, así que la experiencia sigue siendo familiar. Marcan los mismos dígitos que ya confían del escaparate, web o Maps.",
          "Sigues recibiendo resúmenes, reservas en calendario y emails de confirmación. La diferencia es que tu línea está cubierta cuando no puedes coger el teléfono: noches, fines de semana y horas punta.",
          "Si inviertes en SEO local y reseñas Google, tratar tu línea listada como canal de primera clase es la mejora con más palanca que muchos dueños omiten.",
        ],
      },
      {
        slug: "bilingual-receptionist",
        category: "article",
        title: "Llamadas en inglés y español en un solo número",
        excerpt:
          "Las consultas en dos idiomas son habituales en muchos mercados. Así formamos RingsAway para ambos sin transferencias incómodas.",
        readTime: "5 min de lectura",
        tags: ["Bilingüe", "Configuración"],
        imageAlt: "Llamadas en inglés y español en una línea de negocio",
        body: [
          "En muchos salones, clínicas y oficios de zonas bilingües oirás inglés y español la misma tarde. Tu línea debe reflejarlo, no obligar a pulsar 1 por un idioma que quizá no hablan.",
          "Configuramos RingsAway con saludo, FAQs y reglas de reserva en ambos idiomas. El agente detecta el idioma del llamante y mantiene ese idioma salvo que cambien.",
          "Importa el tono tanto como entender. Un paciente nervioso o un propietario de vacaciones con una avería quiere sentirse comprendido, no pasar por un guion genérico.",
          "En la puesta en marcha capturamos cómo hablas con clientes: servicios, horarios, qué necesitas antes de confirmar y qué es urgente. Ese conocimiento vive en ambos idiomas desde el día uno.",
          "Los dueños dicen que el mayor alivio es no traducir todo ellos mismos. Es saber que las llamadas de noche y fin de semana se atienden bien en inglés o español.",
          "Si sirves a una comunidad mixta, un recepcionista bilingüe en tu número real es más simple que líneas, chats y buzones que nadie revisa.",
        ],
      },
      {
        slug: "voc-reports-march",
        category: "update",
        title: "Novedades en los informes mensuales de opinión del cliente",
        excerpt:
          "Explicadores VoC más claros, listas de acción, menciones de competencia y guía Google Business, todo elaborado por nuestro agente de investigación UX.",
        readTime: "3 min de lectura",
        tags: ["Producto"],
        imageAlt: "Informe mensual de feedback y VoC",
        body: [
          "Los informes mensuales de opinión del cliente (Voz del Cliente o VoC) solo sirven si los abres y sabes qué hacer después, también en Google. Esta actualización viene del feedback de dueños que querían menos jerga, menos datos y más dirección.",
          "Al preparar tu informe, las listas de acción se ordenan por impacto probable: qué arreglar este mes, qué puede esperar y qué ya funciona según elogios en reseñas Google.",
          "También anotamos cuando nombran competidores, para ver por qué te comparan y dónde ya ganas.",
          "Los temas que se repiten varios meses se señalan explícitamente, para que problemas lentos (esperas, parking, confusión de precios) no queden enterrados bajo comentarios nuevos de cinco estrellas.",
          "Los informes son breves a propósito: un resumen en pocos minutos, con detalle opcional si quieres profundizar en reseñas, web o encuestas.",
          "Los planes Growth y Premium incluyen estos informes; si estás en Starter, pregúntanos por subir cuando quieras convertir reseñas en hábito mensual y no en deuda pendiente.",
        ],
      },
    ],
  },
  pricing: {
    eyebrow: "Precios",
    title: "Precios sencillos para negocios en crecimiento",
    subtitle:
      "Empieza con una recepcionista IA y añade insight del cliente a medida que creces.",
    flexNote:
      "Solo mes a mes — sin atarte a una suscripción. Cancela cuando quieras, añade o quita servicios y activa funciones según las necesites.",
    popular: "MÁS POPULAR",
    setupLabel: "Configuración",
    monthlyLabel: "Mensual",
    includedMinutesLabel: "Minutos incluidos",
    includedLabel: "Incluido",
    overageLabel: "Exceso",
    customPrice: "Personalizado",
    perMonth: "/mes",
    excludesVat: "IVA no incl.",
    bookDemo: "Reservar demo",
    contactUs: "Contáctanos",
    setupNote:
      "La configuración estándar es 499 €. Tarifas extra solo aplican para integraciones complejas como WhatsApp Business, sistemas de reserva de mesas, CRMs o flujos personalizados.",
    overageNote:
      "Los minutos IA adicionales se facturan de forma transparente cuando superas tu cupo mensual incluido.",
    addOnsTitle: "Complementos opcionales",
    plans: {
      receptionist: {
        name: "Básico",
        description:
          "Para negocios que quieren llamadas atendidas, FAQs resueltas y citas reservadas.",
        setup: "499 € configuración",
        monthly: "179 €",
        minutes: "300 minutos IA/mes",
        overage: "0,35 €/min tras minutos incluidos",
        features: [
          "Recepcionista IA",
          "Base de conocimiento del negocio",
          "Responde FAQs",
          "Reserva citas",
          "Cancela citas",
          "Integración Google Calendar",
          "Emails de confirmación al cliente",
          "Emails de notificación al propietario",
        ],
        highlight: "",
        cta: "bookDemo",
      },
      bundle: {
        name: "Pro",
        description:
          "Para negocios que quieren atención de llamadas más insight mensual del cliente.",
        setup: "499 € configuración",
        monthly: "249 €",
        minutes: "500 minutos IA/mes",
        overage: "0,30 €/min tras minutos incluidos",
        features: [
          "Todo lo incluido en Básico",
          "Informe mensual Voz del Cliente",
          "Análisis de reseñas Google",
          "Temas positivos y negativos",
          "Tendencias de quejas",
          "Recomendaciones de acción mensuales",
          "Disparadores de post-cita y marketing",
          "Más minutos IA incluidos",
        ],
        highlight:
          "Incluye informes VoC mensuales (puntuales: 89 € cada uno)",
        cta: "bookDemo",
      },
      custom: {
        name: "Business",
        description:
          "Para negocios que requieren flujos e integraciones a medida.",
        setup: "Personalizado",
        monthly: "Personalizado",
        minutes: "Personalizado",
        overage: "",
        features: [
          "Configuración de agente IA a medida",
          "Diseño de flujo personalizado",
          "Integraciones necesarias",
          "Base de conocimiento del negocio",
          "Lógica de reserva y cancelación",
          "Informe VoC mensual si está en el alcance del proyecto",
        ],
        highlight: "",
        cta: "contactUs",
      },
    },
    addOns: [
      { title: "Informe Voz del Cliente", price: "89 € pago único" },
      { title: "Automatización extra", price: "desde 250 € configuración" },
    ],
  },
  addOns: {
    title: "Complementos opcionales",
    subtitle: "",
    items: [
      { title: "Informe Voz del Cliente", price: "89 € pago único" },
      { title: "Automatización extra", price: "desde 250 € configuración" },
    ],
  },
  about: {
    eyebrow: "Nosotros",
    title: "Negocio familiar, con base en España",
    p1: "RingsAway se construye y apoya desde Manilva, La Chullera en la Costa del Sol. Somos un negocio familiar, no un call center anónimo. Tenemos experiencia en UX y tecnología, y 16 años en el sector creando software y servicios que la gente disfruta usar.",
    p2: "Configuramos recepción telefónica IA para tiendas, salones, clínicas y oficios que pierden clientes cuando nadie coge el teléfono, estés donde estés. Cada puesta en marcha se hace en inglés o español, con entrega clara y soporte de nuestro equipo (la onboarding remota funciona bien).",
    p3: "Si quieres que tu número real se atienda bien, sin contratar otra recepcionista a jornada completa, nos encantaría hablar contigo.",
    commonQuestions: "Preguntas frecuentes",
    mapTitle: "Ubicación RingsAway, Manilva, La Chullera, España",
    locationPrimary: "Manilva, La Chullera",
    locationSecondary: "Málaga, Costa del Sol, España",
    openMaps: "Abrir en Google Maps →",
    facts: ["Inglés y español", "Negocio familiar", "16 años en el sector", "Experiencia UX y tech"],
    tagline:
      "Con base en Manilva. Trabajamos con negocios que viven del teléfono en inglés y español, cerca o lejos.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas frecuentes",
    introBefore: "¿No encuentras lo que buscas?",
    introLink: "Hablemos con un café ☕",
    introAfter: "y te guiamos en la configuración.",
    items: [
      {
        id: "item-1",
        question: "¿Usa mi número de negocio actual?",
        answer:
          "Sí. Los clientes marcan el mismo número que ya usan en Google, tu web o el escaparate. RingsAway contesta esa línea; no es otra app ni un chat en la web.",
      },
      {
        id: "item-2",
        question: "¿Está disponible 24/7 de verdad?",
        answer:
          "Tu recepcionista IA contesta cuando tú no puedes: noches, fines de semana y horas punta. Tú eliges cuándo pasar a una persona.",
      },
      {
        id: "item-3",
        question: "¿Cómo llegan las reservas a mi calendario?",
        answer:
          "Las citas confirmadas se sincronizan con Google Calendar (y más en planes superiores). Tú y tu equipo recibís confirmaciones por email con datos del llamante.",
      },
      {
        id: "item-4",
        question: "¿Qué es Voz del Cliente (VoC)?",
        answer:
          "VoC significa escuchar lo que los clientes dicen en reseñas Google, en tu web, en encuestas y tras la visita, y convertirlo en insight útil. Las estrellas solas no dicen si arreglar esperas, formación, precios o la ficha Google. Un buen informe VoC responde: qué dicen, por qué importa a mi negocio y qué hago este mes.",
      },
      {
        id: "item-5",
        question: "¿Qué incluye el informe mensual y el plan Google Business?",
        answer:
          "Cada mes nuestro agente de investigación UX prepara tu informe. Leemos reseñas Google Business, feedback web, encuestas y notas de satisfacción, y enviamos temas, menciones de competencia, ideas para responder, plan de acción priorizado y guía práctica de Google Business (qué publicar, a qué responder, cómo destacar en búsqueda local).",
      },
      {
        id: "item-6",
        question: "¿Para quién es RingsAway?",
        answer:
          "Negocios locales que viven del teléfono: salones, clínicas, oficios, tiendas y consultas que pierden consultas si nadie coge. Estamos en Manilva, España, y trabajamos con dueños en inglés y español. No hace falta estar en la Costa del Sol.",
      },
    ],
  },
  finalCta: {
    title: "Una llamada perdida puede pagarse sola",
    subtitle:
      "Tu línea atendida a todas horas. Más consultas, mejores reseñas y un negocio que crece.",
    bookDemo: "Reservar demo",
  },
  bookDemo: {
    eyebrow: "Reservar demo",
    title: "Elige la hora que te venga bien",
    subtitle:
      "Elige hora abajo. Recibirás invitación de Google Calendar con enlace de Google Meet.",
    bullets: [
      "Llamada de introducción de 30 minutos",
      "Google Meet o teléfono",
      "Inglés o español",
    ],
    openCalendarCta: "Elegir hora",
    notConfigured:
      "El calendario online estará listo pronto. Escríbenos y te enviamos una cita con enlace Meet.",
    emailFallback: "Email para reservar demo",
    meetNote: "Reserva con Google Calendar — enlace Meet al confirmar la cita.",
    viewPricing: "Ver precios",
  },
  footer: {
    description:
      "RingsAway atiende tu línea de negocio con IA y te ayuda a captar más reservas, más informes mensuales de opinión del cliente (VoC) con acciones claras y plan de Google Business.",
    location:
      "Con base en Manilva, La Chullera, España · Inglés y español · clientes en todo el mundo",
    copyright: "Todos los derechos reservados.",
    tagline: "Ayudando a negocios locales a conseguir más clientes.",
    followUs: "Síguenos",
    instagramLabel: "RingsAway en Instagram",
    legalPrivacy: "Política de privacidad",
    legalTerms: "Términos del servicio",
    legalCookies: "Política de cookies",
    legalLastUpdated: "Última actualización:",
  },
  reviewCard: {
    author: "Sarah M.",
    source: "Google",
    quote:
      "Llamé fuera de horario y me reservaron al momento. Ojalá lo hubieran hecho años atrás.",
    tags: ["Facilidad de reserva", "Fuera de horario"],
  },
  contactForm: {
    eyebrow: "Contacto",
    title: "Hablemos con un café",
    subtitle:
      "Cuéntanos tu negocio y qué necesitas — recepción IA, informes VoC o ambos. Te responderemos por email.",
    emailReach: "Escríbenos a",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "tu@negocio.com",
    businessLabel: "Negocio",
    businessPlaceholder: "Salón, clínica, restaurante…",
    phoneLabel: "Teléfono (opcional)",
    phonePlaceholder: "+34 …",
    messageLabel: "Mensaje",
    messagePlaceholder: "¿De qué te gustaría hablar?",
    submit: "Enviar mensaje",
    sending: "Enviando…",
    success: "Gracias — tu mensaje se ha enviado. Te responderemos por email pronto.",
    errorGeneric:
      "No pudimos enviar tu mensaje. Inténtalo de nuevo o escribe a hello@ringsaway.com.",
    privacy: "Solo usamos tus datos para responder a esta consulta.",
  },
  contact: {
    talkCoffee: "Hablemos con un café ☕",
    talkCoffeeLink: "Hablemos con un café ☕",
    mailSubject: "Hablemos con un café - RingsAway",
    mailGreeting: "Hola,",
    mailBodyIntro: "Me gustaría hablar con un café y saber más sobre RingsAway.",
    mailName: "Nombre:",
    mailBusiness: "Negocio:",
    mailPhone: "Teléfono:",
    mailThanks: "Gracias,",
  },
} as const;
