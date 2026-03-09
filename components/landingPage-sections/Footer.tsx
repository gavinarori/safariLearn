"use client"

import { Linkedin, Twitter, Github, Mail } from "lucide-react"
import { IconInnerShadowTop } from "@tabler/icons-react"
import Link from "next/link"

const footerLinks = {
  platform: [
    { name: "Courses", href: "/courses" },
    { name: "Dashboard", href: "/dashboard" },
  ],
  resources: [
    { name: "Home", href: "/dashboard" },
    { name: "About", href: "#" },
  ],
  company: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms", href: "#" },
  ],
}

export const Footer = () => {
  return (
    <div className="bg-primary pt-20 px-4">

      <footer className="bg-background w-full max-w-[1350px] mx-auto text-foreground pt-10 lg:pt-14 px-6 sm:px-10 md:px-16 lg:px-24 rounded-t-[2rem] overflow-hidden border border-border">

        {/* GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-10">

          {/* LEFT BRAND */}
          <div className="lg:col-span-3 space-y-6">

            <Link href="/" className="flex items-center gap-3">

              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
                <IconInnerShadowTop className="size-5" />
              </div>

              <span className="text-xl font-semibold">
                SafariLearn
              </span>

            </Link>

            <p className="text-sm text-muted-foreground max-w-md">
              SafariLearn helps companies train employees with structured
              courses, quizzes, and real-time manager dashboards.
              Deliver consistent training and track results across teams.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-5">

              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter size={18} />
              </a>

              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin size={18} />
              </a>

              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github size={18} />
              </a>

              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Mail size={18} />
              </a>

            </div>

          </div>

          {/* RIGHT LINKS */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-10">

            {/* PLATFORM */}
            <div>
              <h3 className="font-medium text-sm mb-4">
                Platform
              </h3>

              <ul className="space-y-3 text-sm">
                {footerLinks.platform.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h3 className="font-medium text-sm mb-4">
                Resources
              </h3>

              <ul className="space-y-3 text-sm">
                {footerLinks.resources.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div className="col-span-2 md:col-span-1">

              <h3 className="font-medium text-sm mb-4">
                Company
              </h3>

              <ul className="space-y-3 text-sm">
                {footerLinks.company.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} SafariLearn
          </p>

          <p className="text-sm text-muted-foreground">
            All rights reserved.
          </p>

        </div>

        {/* BIG WORDMARK */}
        <div className="relative">

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-muted rounded-full blur-[100px] pointer-events-none" />

          <h1 className="text-center font-extrabold leading-[0.7] text-transparent text-[clamp(3rem,15vw,15rem)] [-webkit-text-stroke:1px_theme(colors.border)] mt-6 select-none">
            SAFARI
          </h1>

        </div>

      </footer>

    </div>
  )
}