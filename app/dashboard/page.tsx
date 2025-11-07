"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }
  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard (Mock)</h1>
          <p className="text-muted-foreground">Este panel es un mockup sin funcionalidad real. Más adelante se securizará con Google Sign-In.</p>
          <div className="flex gap-3 mt-4">
            <Button asChild variant="outline">
              <Link href="/">Volver a Home</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="testimonials" className="">
          <TabsList>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">Sobre mí</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Añadir nuevo testimonio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Nombre" />
                  <Input placeholder="Edad" />
                  <Textarea placeholder="Texto del testimonio" />
                  <Input placeholder="URL de imagen o video" />
                  <Button disabled className="bg-primary text-primary-foreground">Guardar (mock)</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Listado de testimonios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Ana (32) — "Me ayudó a recuperar mi calma"</li>
                    <li>• Luis (28) — "Volví a dormir bien después de semanas"</li>
                    <li>• Marta (41) — "Por fin dejé el contacto"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crear producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Nombre del producto (ebook, sesión, programa)" />
                  <Textarea placeholder="Descripción" />
                  <Input placeholder="Precio (€)" />
                  <Button disabled className="bg-primary text-primary-foreground">Guardar (mock)</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productos actuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Ebook "Guía del Contacto Cero" — 0€</li>
                    <li>• Sesión Individual — 97€</li>
                    <li>• Programa 4 Semanas — 297€</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar "Sobre mí"</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Título" />
                  <Textarea placeholder="Descripción" />
                  <Button disabled className="bg-primary text-primary-foreground">Guardar (mock)</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>"Ferdy — Coach emocional..."</p>
                    <p>Video, credenciales y CTA de reservar.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Añadir FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Pregunta" />
                  <Textarea placeholder="Respuesta" />
                  <Button disabled className="bg-primary text-primary-foreground">Guardar (mock)</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Listado de FAQs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• ¿Cuánto dura cada sesión? — 60 minutos.</li>
                    <li>• ¿El programa incluye material? — Sí, guías y ejercicios.</li>
                    <li>• ¿Cuándo veré resultados? — En las primeras semanas.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}