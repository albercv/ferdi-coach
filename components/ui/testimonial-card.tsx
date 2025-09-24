import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  age: number
  text: string
  rating: number
}

export function TestimonialCard({ name, age, text, rating }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
          ))}
        </div>
        <blockquote className="text-muted-foreground mb-4 italic pl-4 border-l-2 border-destructive/30">
          <span className="text-destructive">“</span>
          {text}
          <span className="text-destructive">”</span>
        </blockquote>
        <cite className="text-sm font-medium text-foreground not-italic">
          {name}, {age} años
        </cite>
      </CardContent>
    </Card>
  )
}
