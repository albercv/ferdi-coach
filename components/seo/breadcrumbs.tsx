import { Breadcrumb } from "@/components/ui/breadcrumb"

interface PageBreadcrumbsProps {
  items: Array<{ name: string; href?: string }>
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  const breadcrumbItems = [{ name: "Inicio", href: "/" }, ...items]

  return (
    <div className="container px-4 py-4">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}
