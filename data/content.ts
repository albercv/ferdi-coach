interface Testimonial {
  name: string
  age: number
  text: string
  rating: number
  video?: string
  image?: string
}

export const siteContent = {
  hero: {
    title: "Supera tu ruptura de pareja en 4 semanas",
    subtitle:
      "Coach emocional especializado en procesos de duelo amoroso. Te acompaño para recuperar tu bienestar, autoestima y paz mental después de una separación.",
    bullets: [
      "Duelo amoroso y sanación emocional",
      "Dependencia emocional y límites sanos",
      "Autoestima y confianza personal",
    ],
    ctaPrimary: "Reservar sesión gratuita",
    ctaSecondary: "Ver servicios",
  },

  forWho: {
    title: "¿Acabas de terminar una relación?",
    subtitle: "Si te identificas con alguna de estas situaciones, puedo ayudarte a superar tu ruptura de pareja",
    cards: [
      {
        icon: "heart-crack",
        title: "Ruptura reciente",
        description: "Acabas de terminar una relación y sientes que no puedes seguir adelante. El dolor emocional es intenso y necesitas apoyo profesional para procesar el duelo amoroso.",
      },
      {
        icon: "clock",
        title: "Dependencia emocional",
        description: "Tienes dificultades para establecer límites sanos en tus relaciones. Sientes que necesitas constantemente la validación de tu ex pareja o de otros para sentirte bien contigo mismo.",
      },
      {
        icon: "users",
        title: "Patrones tóxicos",
        description: "Repites los mismos errores en tus relaciones amorosas. Quieres romper con patrones de dependencia emocional y construir relaciones más sanas en el futuro.",
      },
      {
        icon: "target",
        title: "Baja autoestima",
        description: "La ruptura ha afectado tu autoestima y confianza personal. Necesitas recuperar tu amor propio y aprender a valorarte independientemente de una relación de pareja.",
      },
    ],
  },

  sessions: {
    title: "Cómo te puedo ayudar a superar tu ruptura",
    cards: [
      {
        title: "Sesiones individuales de coaching emocional",
        description: "Acompañamiento personalizado para superar tu ruptura de pareja",
        whatYouGet: {
          title: "Qué incluye cada sesión:",
          items: [
            "Sesión 1 a 1 de 60 minutos por videollamada",
            "Plan personalizado para tu proceso de duelo amoroso",
            "Herramientas prácticas para gestionar emociones",
            "Ejercicios específicos para romper la dependencia emocional",
            "Seguimiento entre sesiones vía WhatsApp"
          ]
        },
        idealFor: "Personas que necesitan apoyo inmediato tras una ruptura reciente",
        format: "Videollamada de 60 minutos",
        pricing: {
          full: "€97",
          note: "Sesión individual"
        },
        cta: "Reservar sesión"
      },
      {
        title: "Programa intensivo: Supera tu ruptura en 4 semanas",
        promise: "Transforma tu dolor en crecimiento personal y recupera tu bienestar emocional",
        keyPoints: [
          {
            title: "Semana 1: Aceptación del duelo",
            description: "Aprende a procesar el dolor de la ruptura de forma sana"
          },
          {
            title: "Semana 2: Rompe la dependencia emocional",
            description: "Establece límites sanos y recupera tu independencia"
          },
          {
            title: "Semana 3: Reconstruye tu autoestima",
            description: "Fortalece tu amor propio y confianza personal"
          },
          {
            title: "Semana 4: Diseña tu nueva vida",
            description: "Crea un plan para relaciones futuras más sanas"
          }
        ],
        includes: "4 sesiones individuales + material de apoyo + seguimiento diario",
        bonus: "Guía 'Kit de emergencia emocional' + acceso a comunidad privada",
        pricing: {
          full: "€297"
        },
        cta: "Comenzar programa"
      }
    ]
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
      video: "ferdy-presentation",
    },
    {
      name: "M.J.",
      age: 28,
      text: "El programa me ayudó no solo a superar mi ruptura, sino a entender patrones que tenía en mis relaciones. Ahora me siento mucho más segura de mí misma.",
      rating: 5,
      image: "hero-img-v2",
    },
    // Tarjetas de prueba para el layout
    {
      name: "Test Usuario 1",
      age: 30,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet.",
      rating: 4,
      image: "hero-img-v2",
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
    {
      name: "Ana G.",
      age: 35,
      text: "El coaching emocional de Ferdy me ayudó a entender que merecía una relación sana. Ahora tengo herramientas para no repetir patrones tóxicos.",
      rating: 5,
      video: "ferdy-presentation",
    },
    {
      name: "Carlos R.",
      age: 29,
      text: "Pensé que nunca superaría mi ruptura después de 8 años juntos. El programa me dio esperanza y un camino claro hacia la sanación.",
      rating: 5,
      image: "hero-img-v2",
    },
  ] as Testimonial[],

  about: {
    title: "Sobre mí (Ferdy)",
    description:
      "Soy Ferdy, coach emocional especializado en procesos de ruptura de pareja. Tras 12 años de matrimonio mi ruptura me llevó a dejar un país que llevo en mi corazón, Perú, personas que amaba y también una profesión que ya no me llenaba, la cocina. Tras una etapa de duelo personal inicié un viaje de mochilero por el sudeste asiático donde me encontré conmigo mismo y con una verdad clara: quería ayudar a otros a superar una ruptura. No fue fácil, primero tuve que transitar mi propia sanación emocional antes de guiar a otros. Estudié coaching transpersonal para contar con las herramientas necesarias y hoy quiero compartirlas contigo junto con lo más valioso que tengo, mi experiencia personal y sobre todo mi presencia auténtica.",
    credentials: [
      "Formación en coaching transpersonal para superar rupturas de pareja",
      "Enfoque integral: combinación de introspección, fuerza interior y acompañamiento emocional",
      "Guiar sin juicios, con comprensión y cercanía en procesos de duelo amoroso",
      "Hablo desde la experiencia: estuve en tu lugar y salí adelante tras mi ruptura",
    ],
  },

  faq: {
    title: "Preguntas frecuentes sobre coaching para superar rupturas",
    subtitle: "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura",
    items: [
      {
        question: "¿Qué diferencia hay entre una sesión suelta y el Programa 4?",
        answer:
          "La sesión individual de coaching emocional te proporciona alivio y claridad inmediata para superar tu ruptura de pareja. El Programa 4 consolida hábitos duraderos de bienestar emocional y acompaña tu progreso con seguimiento personalizado durante 4 semanas completas.",
      },
      {
        question: "¿Y si recaigo o contacto con mi ex pareja?",
        answer:
          "Las recaídas emocionales son parte natural del proceso de superar una ruptura. Lo analizamos juntos sin juicios y seguimos fortaleciendo tu proceso de sanación emocional. Te proporciono herramientas específicas para manejar estos momentos y convertirlos en oportunidades de crecimiento personal.",
      },
      {
        question: "¿Necesito estar 'listo' para empezar el coaching emocional?",
        answer:
          "Nunca se está completamente listo para superar una ruptura de pareja. Tu transformación emocional comienza en el momento exacto que decides avanzar y buscar apoyo profesional. El coaching emocional te acompaña desde donde estés ahora hacia tu bienestar.",
      },
      {
        question: "¿Y si ya estoy yendo al psicólogo?",
        answer:
          "El coaching emocional es completamente complementario con la terapia psicológica. Yo viví personalmente el dolor de una ruptura tras 12 años de matrimonio y aquí te enseño a transformar ese dolor en poder personal. Combinamos enfoques para potenciar tu proceso de sanación.",
      },
      {
        question: "¿Trabajas con hombres o mujeres para superar rupturas?",
        answer:
          "Trabajo tanto con hombres como con mujeres que buscan superar su ruptura de pareja. Mi metodología de coaching emocional transforma el dolor en fuerza interior con conciencia plena, adaptándose a las necesidades específicas de cada persona independientemente de su género.",
      },
      {
        question: "¿Cuál es la política de cancelación de las sesiones?",
        answer:
          "Puedes realizar cambios o cancelaciones de tus sesiones de coaching emocional hasta 24 horas antes del horario programado. Esto nos permite reorganizar la agenda y mantener la continuidad de tu proceso de sanación emocional tras la ruptura.",
      },
    ],
  },
} as const
