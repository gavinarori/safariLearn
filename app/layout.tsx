import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { CalendarProvider } from "@/components/event-calendar/calendar-context";
import { AuthProvider } from "@/contexts/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Course Discussions & Collaboration",
  description: "Engage with course threads, participate in discussions, and collaborate in real-time.",
  keywords: [
    "courses",
    "discussion",
    "threads",
    "chat",
    "education",
    "collaboration",
    "online learning",
  ],
  authors: [
    { name: "Your App Name", url: "https://yourappwebsite.com" }
  ],
  creator: "Your App Name",
  publisher: "Your App Name",
  openGraph: {
    title: "Course Discussions & Collaboration",
    description: "Engage with course threads, participate in discussions, and collaborate in real-time.",
    url: "https://yourappwebsite.com",
    siteName: "Course Discussions App",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Course Discussions App"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Course Discussions & Collaboration",
    description: "Engage with course threads, participate in discussions, and collaborate in real-time.",
    images: ["/og-image.png"],
    creator: "@YourTwitterHandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <CalendarProvider> 
       <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </CalendarProvider> 
          </AuthProvider>
      </body>
    </html>
  );
}
