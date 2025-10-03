import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-lg">Ferdy | Coach del desamor</span>
            </div>
            <p className="text-primary-foreground/80 max-w-md">
              Coach especializado en procesos de desamor y ruptura amorosa. Te acompaño para que recuperes tu bienestar
              emocional y salgas fortalecido de esta experiencia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#sesiones"
                  title="Sesiones individuales de coaching emocional para superar rupturas de pareja"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sesiones 1 a 1
                </Link>
              </li>
              <li>
                <Link
                  href="#programa-4"
                  title="Programa intensivo de 4 semanas para superar ruptura de pareja completamente"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Programa 4
                </Link>
              </li>
              <li>
                <Link
                  href="#guias"
                  title="Guías gratuitas descargables para comenzar tu proceso de sanación emocional"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Guías digitales
                </Link>
              </li>
              <li>
                <Link
                  href="#sobre-mi"
                  title="Conoce a Ferdy, coach emocional especializado en rupturas de pareja y dependencia emocional"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sobre mí
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:hola@ferdycoach.com"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  hola@ferdycoach.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com/ferdycoach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Ferdy Coach. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacidad"
              className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/cancelacion"
              className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm transition-colors"
            >
              Política de cancelación
            </Link>
            <Link
              href="/contacto"
              className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
