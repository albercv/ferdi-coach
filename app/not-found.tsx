export default function NotFound() {
  return (
    <main className="container px-4 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-muted-foreground mb-8">La ruta que has intentado abrir no existe o fue movida.</p>
      <a href="/" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-accent-foreground font-medium hover:opacity-90 transition-colors">
        Volver al inicio
      </a>
    </main>
  )
}