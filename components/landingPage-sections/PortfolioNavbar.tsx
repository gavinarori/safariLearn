"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { IconInnerShadowTop } from "@tabler/icons-react"

export const CorporateTrainingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md shadow-sm">
              <IconInnerShadowTop className="size-4.5" />
            </div>

            <span className="text-lg font-semibold tracking-tight text-foreground">
              SafariLearn
            </span>
          </Link>


          {/* Right buttons */}
          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/login">
                Login
              </Link>
            </Button>

            <Button
              size="sm"
              asChild
            >
              <Link href="/signup">
                Sign up
              </Link>
            </Button>

          </div>

        </div>
      </div>
    </nav>
  )
}