"use client"

import { Button } from "@/components/ui/button"

export function GoogleSignInButton() {
  const handleClick = () => {
    try {
      window.location.assign("/login")
    } catch {}
  }

  return (
    <Button onClick={handleClick} className="text-sm px-2 py-1 border border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">
      Login
    </Button>
  )
}