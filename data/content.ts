export const siteContent = {
  hero: {
    title: "Del adiós al RENACER. Tu nuevo YO",
    subtitle:
      "Te acompaño a transformar el dolor de tu ruptura en crecimiento personal y libertad.",
    bullets: [
      "Herramientas que me ayudaron y que ahora comparto contigo.",
      "Acompañamiento cercano, sin juicios, con pasos concretos.",
      "Metodología cercana y realista adaptada a tus necesidades personales.",
    ],
    ctaPrimary: "Reservar sesión gratuita",
    ctaSecondary: "Ver Programa 4",
  },

  forWho: {
    title: "¿Estás viviendo alguna de estas situaciones?",
    subtitle:
      "Si te identificas con alguna de estas experiencias, mi método puede ayudarte a transformar tu dolor en crecimiento personal",
    cards: [
      { title: "Ruptura reciente", description: "Tu relación ha terminado y sientes que no puedes seguir adelante", icon: "heart-crack" },
      { title: "Duelo prolongado", description: "Han pasado meses y sigues sin poder superarlo completamente", icon: "clock" },
      { title: "Dependencia emocional", description: "Reconoces patrones tóxicos que se repiten en tus relaciones", icon: "users" },
      { title: "Contacto cero fallido", description: "Has intentado aplicar contacto cero pero recaes constantemente", icon: "target" }
    ],
  },

  sessions: {
    title: "Sesiones 1 a 1",
    description: "Acompañamiento personalizado para tu proceso de sanación emocional",
    benefits: [
      "Sesión de diagnóstico gratuita",
      "Plan personalizado según tu situación",
      "Herramientas específicas para tu caso",
      "Seguimiento continuo entre sesiones",
      "Acceso a recursos exclusivos",
    ],
    prices: {
      single: "75€",
      pack4: "280€",
    },
  },

  program4: {
    title: "Programa 4 - Transformación completa",
    promise: "En 4 semanas recuperarás tu bienestar emocional y estarás listo para una nueva etapa",
    milestones: [
      {
        week: 1,
        title: "Aceptación y comprensión",
        description: "Entender qué ha pasado y por qué te sientes así",
      },
      {
        week: 2,
        title: "Contacto cero efectivo",
        description: "Implementar estrategias para mantener la distancia necesaria",
      },
      {
        week: 3,
        title: "Reconstrucción personal",
        description: "Trabajar en tu autoestima y redescubrir quién eres",
      },
      {
        week: 4,
        title: "Proyección al futuro",
        description: "Prepararte para nuevas relaciones y oportunidades",
      },
    ],
    bonus: [
      "Guía de contacto cero (PDF)",
      "Meditaciones guiadas para el desamor",
      "Plantillas de journaling emocional",
      "Acceso al grupo privado de apoyo",
    ],
    price: "497€",
  },

  guides: [
    {
      title: "Guía del Contacto Cero",
      description: "Todo lo que necesitas saber para implementar el contacto cero de forma efectiva",
      price: "29€",
    },
    {
      title: "Workbook de Sanación Emocional",
      description: "Ejercicios prácticos para procesar tus emociones y avanzar en tu proceso",
      price: "39€",
    },
    {
      title: "Kit de Emergencia Emocional",
      description: "Herramientas rápidas para momentos de Crisis y recaídas emocionales",
      price: "19€",
    },
  ],

  testimonials: [
    {
      name: "M.",
      age: 32,
      text: "Después de 6 meses sin poder superar mi ruptura, en solo 4 semanas con Ferdy conseguí recuperar mi paz mental. Sus herramientas son realmente efectivas.",
      rating: 5,
    },
    {
      name: "M.J.",
      age: 28,
      text: "El programa me ayudó no solo a superar mi ruptura, sino a entender patrones que tenía en mis relaciones. Ahora me siento mucho más segura de mí misma.",
      rating: 5,
    },
    // Tarjetas de prueba para el layout
    {
      name: "Test Usuario 1",
      age: 30,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet.",
      rating: 4,
    },
    {
      name: "Test Usuario 2",
      age: 42,
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: 4,
    },
    {
      name: "Test Usuario 3",
      age: 25,
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      rating: 5,
    },
  ],

  about: {
    title: "Sobre mí",
    description:
      "Soy Ferdy, coach especializado en procesos de desamor y ruptura amorosa. Durante los últimos 5 años he ayudado a más de 500 personas a superar sus rupturas y recuperar su bienestar emocional.",
    credentials: [
      "Certificado en Coaching Emocional",
      "Especialización en Terapia de Pareja",
      "Formación en Inteligencia Emocional",
      "Más de 500 casos de éxito",
    ],
  },

  faq: [
    {
      question: "¿Cuánto tiempo dura el proceso de recuperación?",
      answer:
        "Cada persona es diferente, pero con el Programa 4 la mayoría de mis clientes experimentan una mejora significativa en 4 semanas. El proceso completo puede tomar entre 2-6 meses dependiendo de cada caso.",
    },
    {
      question: "¿Las sesiones son presenciales u online?",
      answer:
        "Todas las sesiones se realizan online a través de videollamada, lo que te permite acceder desde cualquier lugar y en horarios flexibles.",
    },
    {
      question: "¿Qué pasa si no veo resultados?",
      answer:
        "Ofrezco garantía de satisfacción. Si después de las primeras 2 semanas no sientes que estás avanzando, te devuelvo el 100% de tu inversión.",
    },
    {
      question: "¿Puedo combinar sesiones individuales con el Programa 4?",
      answer:
        "Sí, muchos clientes combinan ambos servicios para un acompañamiento más intensivo. Te haré un descuento especial si decides tomar ambos.",
    },
  ],
} as const
