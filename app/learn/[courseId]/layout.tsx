
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compliance Courses",
  description: "Explore and enroll in compliance training courses for your team",
}

export default function learnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}