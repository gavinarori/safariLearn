"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import { IconInnerShadowTop } from "@tabler/icons-react"
import Link from "next/link"

const navigationLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Integrations", href: "#integrations" },
]

export const CorporateTrainingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleLinkClick = (href: string) => {
    closeMobileMenu()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50" 
        : "bg-background/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md shadow-sm">
              <IconInnerShadowTop className="size-4.5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              SafariLearn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-baseline space-x-8">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="
                    text-muted-foreground hover:text-foreground 
                    px-3 py-2 text-sm font-medium transition-colors 
                    duration-200 relative group
                  "
                >
                  {link.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary 
                    transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/demo">Book a Demo</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/get-started">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="text-foreground hover:text-primary p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-8 space-y-6">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="
                    block w-full text-left text-foreground hover:text-primary 
                    py-3 text-base font-medium transition-colors
                  "
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-6 border-t border-border space-y-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/demo">Book a Demo</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/get-started">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}