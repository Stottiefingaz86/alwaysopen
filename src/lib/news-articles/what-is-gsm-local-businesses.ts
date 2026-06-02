import type { NewsBodyBlock } from "@/lib/news-content";

function p(value: string): NewsBodyBlock {
  return { type: "paragraph", segments: [{ type: "text", value }] };
}

function h2(text: string): NewsBodyBlock {
  return { type: "heading", level: 2, text };
}

function h3(text: string): NewsBodyBlock {
  return { type: "heading", level: 3, text };
}

function bullets(items: string[]): NewsBodyBlock {
  return { type: "bullets", items };
}

const CONTACT_HREF = "/#contact";

export const whatIsGsmEn: NewsBodyBlock[] = [
  p(
    "When people think about AI receptionists, automated bookings, SMS reminders, missed-call recovery, and call routing, they usually think about software."
  ),
  p(
    "But underneath all of that clever automation is something much older and more important: the mobile network."
  ),
  p(
    "One of the foundations of that network is GSM, short for Global System for Mobile Communications."
  ),
  p(
    "It may sound technical, but GSM has shaped the way businesses communicate with customers for decades. Every phone call, SMS confirmation, appointment reminder, mobile booking alert, and call-forwarding setup depends on telecom infrastructure that started with systems like GSM. And for local businesses, that still matters."
  ),
  h2("What is GSM?"),
  p(
    "GSM is a mobile communication standard that helped make digital mobile phone calls and SMS possible across networks and countries."
  ),
  p(
    "Before modern smartphones, apps, WhatsApp, VoIP, and AI voice agents, GSM helped create a more reliable way for people to call, text, and stay connected through mobile phones. It became one of the reasons mobile communication could scale globally."
  ),
  p("In simple terms, GSM helped turn mobile phones into everyday business tools."),
  h2("Why GSM changed business communication"),
  p(
    "For local businesses, the phone has always been one of the most important sales channels. A customer might call to book an appointment, ask about opening hours, check availability, make a reservation, ask about pricing, confirm a location, follow up after a service, or ask a quick question before buying."
  ),
  p(
    "GSM helped make mobile calling and SMS normal, reliable, and accessible. That meant businesses were no longer tied only to landlines. Customers could reach them on mobile numbers. Staff could answer calls on the move. Businesses could send text updates, reminders, and confirmations."
  ),
  p(
    "In many ways, GSM helped create the customer behaviour that still exists today: people expect to call or message a business and get a fast response."
  ),
  h2("What are GSM codes?"),
  p(
    "GSM codes are short codes you type into your phone's dial pad to control certain mobile network features. They often start with symbols like *, #, **, ##, or *#."
  ),
  p(
    "These codes can be used for things like checking whether call forwarding is active, sending calls to another number, turning off call diverts, checking your IMEI number, or managing call waiting."
  ),
  p(
    "Most people never think about them. But for local businesses, they can be extremely useful — because GSM codes can help control what happens when someone calls your business number. And that is exactly where missed-call recovery begins."
  ),
  h2("Common GSM codes local businesses should know"),
  p(
    "Exact codes can vary depending on your mobile network, country, and provider, but these are some of the most common call-forwarding related GSM codes."
  ),
  h3("Check if all calls are being forwarded"),
  p("Dial: *#21#"),
  p(
    "This checks whether all incoming calls are being forwarded somewhere else. For a business, this is useful when testing whether calls are being diverted to a receptionist, voicemail, AI agent, or backup number."
  ),
  h3("Forward all calls to another number"),
  p("Dial: **21*NUMBER# (replace NUMBER with the destination)"),
  p(
    "This can forward all incoming calls to another number. For example, a salon might forward all calls to an AI receptionist during busy periods or after hours."
  ),
  h3("Turn off all-call forwarding"),
  p("Dial: ##21#"),
  p(
    "This removes unconditional call forwarding. Useful when testing, troubleshooting, or returning the phone line to normal."
  ),
  h3("Forward calls when unanswered"),
  p("Dial: **61*NUMBER#"),
  p(
    "This forwards calls only when nobody answers. It is one of the most useful options for local businesses because the team gets the first chance to answer. If they cannot pick up, the call can route to an AI receptionist, voicemail, or backup number."
  ),
  p(
    "Example: Customer calls → team does not answer → call forwards to AI receptionist → enquiry is captured. The business gets a second chance instead of losing the customer."
  ),
  h3("Forward calls when busy"),
  p("Dial: **67*NUMBER#"),
  p(
    "This forwards calls when the line is busy — useful when you are already on a call. For example, a restaurant taking one reservation can route a second caller to an AI receptionist instead of a busy tone."
  ),
  h3("Forward calls when unreachable"),
  p("Dial: **62*NUMBER#"),
  p(
    "This forwards calls when the phone is switched off, out of signal, or unreachable — helpful for trades, mobile teams, and estate agents."
  ),
  h3("Cancel all call forwarding"),
  p("Dial: ##002#"),
  p(
    "This is one of the most useful reset codes. It is commonly used to cancel call forwarding and diverts across different forwarding conditions. Helpful when troubleshooting or making sure no unexpected forwarding is active."
  ),
  h2("Why GSM codes matter for AI receptionists"),
  p("An AI receptionist is only useful if calls actually reach it. That is where call routing matters."),
  h3("1. Always route calls to the AI receptionist"),
  p(
    "Every call goes straight to the AI receptionist. This can work well for businesses that want full automation, especially after hours or for high-volume enquiry handling."
  ),
  h3("2. Route only missed calls to the AI receptionist"),
  p(
    "Often the best setup for small businesses: the team answers first; if they are busy or unavailable, the AI receptionist steps in. Human touch when possible, no ignored customers when not."
  ),
  h3("3. Route calls when the line is busy"),
  p(
    "Useful for restaurants, salons, clinics, and estate agents where calls often arrive at the same time. The AI can answer, collect details, and move the customer forward."
  ),
  h3("4. Route calls outside business hours"),
  p(
    "After-hours calls can be valuable — table bookings, appointments, availability, quotes. With the right routing, an AI receptionist can capture those opportunities."
  ),
  h2("GSM codes and missed-call recovery"),
  p(
    "Missed-call recovery is one of the simplest ways for a local business to protect revenue. The old journey: customer calls → nobody answers → customer gives up."
  ),
  p(
    "The smarter journey: customer calls → team misses the call → call routes to AI receptionist → customer gives details → SMS confirmation is sent → booking or follow-up is created. That can turn a missed call into a customer — and sometimes one recovered customer pays for the entire system."
  ),
  h2("A simple example for a salon"),
  p(
    "Imagine a busy salon. The team is with clients. The phone rings. Nobody can answer. Without automation, that caller might try another salon."
  ),
  p("With the right setup, the call can route to an AI receptionist that asks:"),
  bullets([
    "What treatment would you like?",
    "Do you have a preferred artist?",
    "Which location suits you best?",
    "What date are you looking for?",
    "What time works for you?",
  ]),
  p(
    "The AI can connect to the booking workflow, check availability, and send a confirmation or follow-up. For the customer it feels easy; for the salon it means fewer lost bookings."
  ),
  h2("A simple example for a restaurant"),
  p(
    "A restaurant is in the middle of lunch service. The phone rings while staff are serving customers. Instead of missing the call, unanswered or busy calls can route to an AI receptionist that handles reservation requests, opening hours, menu questions, allergens, outdoor seating, group bookings, directions, and follow-up messages — while service keeps flowing."
  ),
  h2("Important safety note about GSM codes"),
  p(
    "GSM codes are powerful because they change how your calls are routed. Use them carefully. Never enter codes sent by unknown callers or random messages — some scams trick people into forwarding calls to a number they do not control."
  ),
  p(
    "Before using call-forwarding codes, confirm the correct setup with your mobile provider, telecoms provider, or trusted technical partner. If something looks wrong, a reset code such as ##002# can often cancel active forwarding, depending on the network."
  ),
  h2("Where GSM still shows up today"),
  p(
    "Even with 4G, 5G, VoIP, cloud telephony, SIP trunks, and AI voice agents, GSM still influences how business communication works."
  ),
  h3("1. SMS reminders"),
  p(
    "Appointment reminders remain one of the most effective ways to reduce no-shows. Salons, clinics, restaurants, trades, estate agents, and local services rely on SMS to keep customers informed."
  ),
  p(
    'Example: "Hi Sarah, your appointment is tomorrow at 10:30. Reply YES to confirm." — small message, big impact on time, money, and lost revenue.'
  ),
  h3("2. Booking confirmations"),
  p(
    "When a customer books, they want reassurance. SMS confirmations give instant confidence and close the loop — fewer manual follow-up calls for the team."
  ),
  p(
    'Example: "Thanks for booking with Brows by Sarah. Your appointment with Jess is confirmed for Tuesday at 14:00."'
  ),
  h3("3. Missed-call recovery"),
  p(
    "Many local businesses still miss calls during busy periods. The customer does not always call back. With the right setup, a missed call can trigger an automated SMS, callback workflow, or AI receptionist response."
  ),
  h3("4. AI receptionists"),
  p(
    "AI receptionists answer calls, ask questions, take details, qualify enquiries, handle FAQs, and route customers to the right next step — the next evolution of business phone systems, built on the same habit GSM helped create: customers calling the business."
  ),
  h3("5. Call forwarding and mobile backup"),
  p(
    "Many businesses forward calls from a main number to a mobile, receptionist, team member, or AI system — especially useful for small teams where overflow, after-hours, and on-site work would otherwise mean missed enquiries."
  ),
  h2("Why this matters more than ever"),
  p(
    "Customers are impatient. If they call and nobody answers, they often move on — to the next salon, restaurant, clinic, or tradesperson on Google. That missed call could be worth €50, €100, €500, or more."
  ),
  p(
    "The goal of modern call automation is not to replace the human touch. It is to make sure every customer gets a response when the team is busy."
  ),
  h2("GSM, SMS, call routing, and AI: the new customer journey"),
  p("The old journey: customer calls → nobody answers → customer gives up."),
  p(
    "Today: customer calls → team answers if available → if not, call routes to AI receptionist → details captured → booking checked → SMS confirmation → reminder before the appointment → follow-up for feedback or a review. Much of it still relies on the phone behaviour GSM helped normalise."
  ),
  h2("What local businesses should think about"),
  bullets([
    "How many calls do we miss each week?",
    "How many missed calls turn into lost bookings?",
    "Do customers get a response when we are busy?",
    "Are appointment confirmations automatic?",
    "Are reminders sent before every booking?",
    "Do we follow up after appointments?",
    "Do we collect reviews consistently?",
    "Do we know where our calls are being routed?",
    "What happens when our line is busy or unanswered?",
  ]),
  p(
    'If the answer to any of those is "not really," there is probably money being left on the table.'
  ),
  h2("The future of business calls"),
  p(
    "The future is not just about having a phone number — it is about what happens when someone uses it. A business line should connect to a system that can answer, respond, book, remind, follow up, and learn."
  ),
  p(
    "At RingsAway, we help local businesses turn missed calls into customers through AI receptionists, booking automation, SMS confirmations, appointment reminders, follow-up campaigns, and customer insight reports. Because one missed call can pay for itself — and with the right system, your business never has to miss a customer again."
  ),
  h2("Ready to stop missing customers?"),
  p(
    "RingsAway helps local businesses capture more calls, automate bookings, improve reviews, and understand customers using AI."
  ),
  {
    type: "articleCta",
    title: "Ready to stop missing customers?",
    body: "Talk through your call routing and AI reception setup with our team.",
    buttonLabel: "Talk Over Coffee ☕",
    href: CONTACT_HREF,
  },
];

export const whatIsGsmEs: NewsBodyBlock[] = [
  p(
    "Cuando la gente piensa en recepcionistas IA, reservas automáticas, recordatorios por SMS, recuperación de llamadas perdidas y desvío de llamadas, suele pensar en software."
  ),
  p(
    "Pero debajo de toda esa automatización hay algo mucho más antiguo e importante: la red móvil."
  ),
  p(
    "Una de sus bases es GSM, siglas de Global System for Mobile Communications (Sistema Global de Comunicaciones Móviles)."
  ),
  p(
    "Puede sonar técnico, pero GSM ha marcado cómo los negocios se comunican con los clientes durante décadas. Cada llamada, SMS de confirmación, recordatorio de cita, alerta de reserva y desvío depende de infraestructura que empezó con sistemas como GSM. Y para negocios locales, sigue importando."
  ),
  h2("¿Qué es GSM?"),
  p(
    "GSM es un estándar de comunicación móvil que ayudó a hacer posibles las llamadas digitales y los SMS entre redes y países."
  ),
  p(
    "Antes de smartphones, apps, WhatsApp, VoIP y agentes de voz IA, GSM creó una forma más fiable de llamar, escribir y estar conectado. Fue una razón por la que la comunicación móvil pudo escalar a nivel global."
  ),
  p("En pocas palabras, GSM ayudó a convertir el móvil en herramienta de negocio cotidiana."),
  h2("Por qué GSM cambió la comunicación comercial"),
  p(
    "Para negocios locales, el teléfono sigue siendo uno de los canales de venta más importantes: reservar cita, horarios, disponibilidad, precios, ubicación, seguimiento o una pregunta rápida antes de comprar."
  ),
  p(
    "GSM normalizó llamadas y SMS fiables. Los negocios dejaron de depender solo del fijo; los clientes llaman al móvil, el equipo contesta en movimiento y se envían recordatorios y confirmaciones por texto."
  ),
  p(
    "GSM ayudó a crear un comportamiento que sigue vigente: la gente espera llamar o escribir a un negocio y recibir respuesta rápida."
  ),
  h2("¿Qué son los códigos GSM?"),
  p(
    "Son códigos cortos que marcas en el teclado del teléfono para controlar funciones de la red, a menudo con *, #, **, ## o *#."
  ),
  p(
    "Sirven para comprobar si hay desvío de llamadas, enviar llamadas a otro número, desactivar desvíos, consultar el IMEI o gestionar llamada en espera."
  ),
  p(
    "Casi nadie los usa, pero en negocios locales son muy útiles: controlan qué pasa cuando alguien llama a tu número. Ahí empieza la recuperación de llamadas perdidas."
  ),
  h2("Códigos GSM que conviene conocer"),
  p(
    "Los códigos exactos varían según operador, país y red; estos son los más habituales relacionados con desvío de llamadas."
  ),
  h3("Comprobar si todas las llamadas se desvían"),
  p("Marcar: *#21#"),
  p(
    "Comprueba si todas las entrantes se reenvían a otro sitio. Útil para ver si van a recepción, buzón, IA o número de respaldo."
  ),
  h3("Desviar todas las llamadas"),
  p("Marcar: **21*NUMERO#"),
  p(
    "Reenvía todas las entrantes. Por ejemplo, un salón puede desviar a una recepcionista IA en horas punta o fuera de horario."
  ),
  h3("Desactivar desvío incondicional"),
  p("Marcar: ##21#"),
  p("Elimina el desvío incondicional. Útil al probar, depurar o volver a la línea normal."),
  h3("Desviar si no contestan"),
  p("Marcar: **61*NUMERO#"),
  p(
    "Solo desvía si nadie contesta. Muy útil: el equipo tiene la primera oportunidad; si no puede, la llamada va a IA, buzón o respaldo."
  ),
  p(
    "Ejemplo: cliente llama → no contestan → desvío a recepcionista IA → se captura la consulta. Segunda oportunidad en lugar de perder al cliente."
  ),
  h3("Desviar si la línea está ocupada"),
  p("Marcar: **67*NUMERO#"),
  p(
    "Desvía cuando la línea está ocupada. Un restaurante en una reserva puede atender al segundo cliente con IA en lugar de tono de ocupado."
  ),
  h3("Desviar si no hay cobertura"),
  p("Marcar: **62*NUMERO#"),
  p(
    "Desvía si el teléfono está apagado o sin señal — útil para oficios, equipos móviles e inmobiliarias."
  ),
  h3("Cancelar todos los desvíos"),
  p("Marcar: ##002#"),
  p(
    "Código de reinicio muy útil para cancelar desvíos en varias condiciones. Ayuda al depurar o asegurar que no hay desvíos inesperados."
  ),
  h2("Por qué importan los códigos GSM para recepcionistas IA"),
  p("Una recepcionista IA solo sirve si las llamadas llegan. Ahí entra el enrutamiento."),
  h3("1. Siempre a la recepcionista IA"),
  p(
    "Todas las llamadas van directo a la IA. Funciona bien con automatización total, fuera de horario o mucho volumen de consultas."
  ),
  h3("2. Solo llamadas perdidas"),
  p(
    "Suele ser lo mejor para negocios pequeños: el equipo contesta primero; si están ocupados o no pueden, entra la IA."
  ),
  h3("3. Cuando la línea está ocupada"),
  p(
    "Útil en restaurantes, salones, clínicas e inmobiliarias con llamadas simultáneas. La IA recoge datos y avanza al cliente."
  ),
  h3("4. Fuera del horario comercial"),
  p(
    "Las llamadas fuera de horario pueden valer oro — mesa, cita, disponibilidad, presupuesto. Con el desvío adecuado, la IA las captura."
  ),
  h2("Códigos GSM y recuperación de llamadas perdidas"),
  p(
    "Recuperar llamadas perdidas protege ingresos. Antes: cliente llama → nadie contesta → se va."
  ),
  p(
    "Ahora: llama → no contestan → desvío a IA → datos → SMS de confirmación → reserva o seguimiento. Una llamada recuperada a veces paga todo el sistema."
  ),
  h2("Ejemplo sencillo: un salón"),
  p(
    "Salón a tope, equipo con clientes, teléfono suena. Sin automatización, el cliente prueba otro salón."
  ),
  p("Con el desvío correcto, la IA puede preguntar:"),
  bullets([
    "¿Qué tratamiento quieres?",
    "¿Tienes profesional preferido?",
    "¿Qué ubicación te viene mejor?",
    "¿Qué fecha buscas?",
    "¿Qué hora te encaja?",
  ]),
  p(
    "La IA enlaza con reservas, comprueba disponibilidad y envía confirmación. Fácil para el cliente; menos citas perdidas para el salón."
  ),
  h2("Ejemplo sencillo: un restaurante"),
  p(
    "Servicio de comidas, teléfono suena. Las llamadas sin contestar u ocupadas pueden ir a una IA que gestiona reservas, horarios, carta, alérgenos, terraza, grupos, direcciones y seguimiento — sin frenar el servicio en sala."
  ),
  h2("Nota de seguridad sobre códigos GSM"),
  p(
    "Los códigos cambian el enrutamiento. Úsalos con cuidado. No marques códigos de desconocidos ni mensajes aleatorios: hay estafas que desvían llamadas a números que no controlas."
  ),
  p(
    "Confirma la configuración con tu operador o partner técnico de confianza. Si algo falla, ##002# suele cancelar desvíos activos según la red."
  ),
  h2("Dónde sigue apareciendo GSM hoy"),
  p(
    "Con 4G, 5G, VoIP, telefonía en la nube, SIP e IA de voz, GSM sigue influyendo en la comunicación comercial."
  ),
  h3("1. Recordatorios SMS"),
  p(
    "Siguen siendo de lo más efectivo para reducir ausencias. Salones, clínicas, restaurantes, oficios e inmobiliarias dependen del SMS."
  ),
  p(
    'Ejemplo: "Hola Sarah, tu cita es mañana a las 10:30. Responde SÍ para confirmar."'
  ),
  h3("2. Confirmaciones de reserva"),
  p(
    "Tras reservar, el cliente quiere tranquilidad. El SMS cierra el bucle y reduce llamadas de seguimiento manual."
  ),
  p(
    'Ejemplo: "Gracias por reservar con Brows by Sarah. Tu cita con Jess es el martes a las 14:00."'
  ),
  h3("3. Recuperación de llamadas perdidas"),
  p(
    "Muchos negocios pierden llamadas en horas punta y el cliente no vuelve a llamar. Con el setup adecuado, un SMS automático, devolución de llamada o IA responde al instante."
  ),
  h3("4. Recepcionistas IA"),
  p(
    "Contestan, preguntan, cualifican, resuelven FAQs y enrutan — la evolución del teléfono del negocio sobre el mismo hábito que GSM popularizó: llamar al negocio."
  ),
  h3("5. Desvío y respaldo móvil"),
  p(
    "Muchos desvían del número principal al móvil, recepción, equipo o IA — clave para equipos pequeños con overflow, fuera de horario o trabajo en obra."
  ),
  h2("Por qué importa más que nunca"),
  p(
    "Los clientes no esperan. Si nadie contesta, llaman al siguiente en Google. Esa llamada puede valer 50 €, 100 €, 500 € o más."
  ),
  p(
    "La automatización moderna no sustituye el trato humano: asegura respuesta cuando el equipo está ocupado."
  ),
  h2("GSM, SMS, enrutamiento e IA: el nuevo recorrido del cliente"),
  p("Antes: llama → nadie contesta → se va."),
  p(
    "Hoy: llama → contestan si pueden → si no, IA → datos → reserva → SMS → recordatorio → seguimiento y reseña. Mucho sigue apoyado en el teléfono que GSM normalizó."
  ),
  h2("Preguntas que debería hacerse un negocio local"),
  bullets([
    "¿Cuántas llamadas perdemos a la semana?",
    "¿Cuántas se convierten en reservas perdidas?",
    "¿Respondemos cuando estamos ocupados?",
    "¿Las confirmaciones son automáticas?",
    "¿Enviamos recordatorio antes de cada cita?",
    "¿Hacemos seguimiento tras el servicio?",
    "¿Recogemos reseñas con constancia?",
    "¿Sabemos a dónde se desvían las llamadas?",
    "¿Qué pasa si la línea está ocupada o sin contestar?",
  ]),
  p('Si alguna respuesta es "no del todo", probablemente se está dejando dinero sobre la mesa.'),
  h2("El futuro de las llamadas de negocio"),
  p(
    "No basta con tener número: importa qué pasa cuando alguien marca. Debe enlazar con un sistema que conteste, reserve, recuerde, haga seguimiento y aprenda."
  ),
  p(
    "En RingsAway ayudamos a convertir llamadas perdidas en clientes con recepcionista IA, reservas automáticas, SMS, recordatorios, campañas de seguimiento e informes de opinión del cliente. Una llamada recuperada puede pagarse sola."
  ),
  h2("¿Listo para dejar de perder clientes?"),
  p(
    "RingsAway ayuda a captar más llamadas, automatizar reservas, mejorar reseñas y entender a tus clientes con IA."
  ),
  {
    type: "articleCta",
    title: "¿Listo para dejar de perder clientes?",
    body: "Hablemos de tu enrutamiento de llamadas y recepción IA con nuestro equipo.",
    buttonLabel: "Charlemos con un café ☕",
    href: CONTACT_HREF,
  },
];
