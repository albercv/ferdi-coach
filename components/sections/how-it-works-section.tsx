export default function HowItWorksSection() {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground text-sm">
            Elige tu servicio y comienza tu transformación
          </p>
        </div>

        {/* Upper Part - Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 1 Sesión Individual */}
          <div className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#517e61'}}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{color: '#517e61'}}>1 Sesión Individual</h3>
            <p className="text-xs text-muted-foreground mb-2">Sesión personalizada 1-a-1</p>
            <p className="text-lg font-bold mb-3" style={{color: '#517e61'}}>€97</p>
            <button className="w-full py-1.5 px-3 rounded-md transition-colors text-xs font-medium" style={{backgroundColor: '#517e61', color: 'white'}}>
              Reservar Ahora
            </button>
          </div>

          {/* Programa 4 Semanas */}
          <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow relative" style={{border: '2px solid #517e61'}}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#b5ac69', color: 'white'}}>
                Más Popular
              </span>
            </div>
            <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#517e61'}}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{color: '#517e61'}}>Programa 4 Semanas</h3>
            <p className="text-xs text-muted-foreground mb-2">Transformación completa</p>
            <p className="text-lg font-bold mb-3" style={{color: '#517e61'}}>€297</p>
            <button className="w-full py-1.5 px-3 rounded-md transition-colors text-xs font-medium" style={{backgroundColor: '#517e61', color: 'white'}}>
              Empezar Programa
            </button>
          </div>

          {/* Guía Digital */}
          <div className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#517e61'}}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{color: '#517e61'}}>Guía Digital</h3>
            <p className="text-xs text-muted-foreground mb-2">Recursos y ejercicios</p>
            <p className="text-lg font-bold mb-3" style={{color: '#517e61'}}>€47</p>
            <button className="w-full py-1.5 px-3 rounded-md transition-colors text-xs font-medium" style={{backgroundColor: '#517e61', color: 'white'}}>
              Descargar Guía
            </button>
          </div>
        </div>

        {/* Lower Part - Purchase Process */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-center mb-4" style={{color: '#517e61'}}>Proceso de Compra</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
             {/* Step 1 - Dorado secundario */}
             <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #b5ac69'}}>
               <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#b5ac69'}}>
                 <span className="text-xs font-bold text-white">1</span>
               </div>
               <h4 className="font-medium text-xs mb-1" style={{color: '#b5ac69'}}>Elige tu servicio</h4>
               <p className="text-xs text-muted-foreground">Selecciona el plan ideal</p>
             </div>

             {/* Step 2 - Amarillo claro */}
             <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #a09e5f'}}>
               <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#a09e5f'}}>
                 <span className="text-xs font-bold text-white">2</span>
               </div>
               <h4 className="font-medium text-xs mb-1" style={{color: '#a09e5f'}}>Pago seguro</h4>
               <p className="text-xs text-muted-foreground">Proceso 100% seguro</p>
             </div>

             {/* Step 3 - Verde-amarillento */}
             <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #6b8f5a'}}>
               <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#6b8f5a'}}>
                 <span className="text-xs font-bold text-white">3</span>
               </div>
               <h4 className="font-medium text-xs mb-1" style={{color: '#6b8f5a'}}>Reserva tu cita</h4>
               <p className="text-xs text-muted-foreground">Elige fecha y hora</p>
             </div>

             {/* Step 4 - Verde primario */}
             <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #517e61'}}>
               <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#517e61'}}>
                 <span className="text-xs font-bold text-white">4</span>
               </div>
               <h4 className="font-medium text-xs mb-1" style={{color: '#517e61'}}>Confirmación</h4>
               <p className="text-xs text-muted-foreground">Recibe tu confirmación</p>
             </div>
           </div>

          <div className="text-center text-xs text-muted-foreground">
            <p className="mb-1">🔒 Pago 100% seguro con encriptación SSL</p>
            <p>📅 Política de cambios flexible hasta 24h antes</p>
          </div>
        </div>
      </div>
    </section>
  )
}
