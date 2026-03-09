import { CorporateTrainingNavbar } from "@/components/landingPage-sections/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/landingPage-sections/ProductTeaserCard"
import { CorporateTrainingHero } from "@/components/landingPage-sections/Hero"
import { CaseStudiesCarousel } from "@/components/landingPage-sections/CaseStudiesCarousel"
import { FAQSection } from "@/components/landingPage-sections/FAQSection"
import { Footer } from "@/components/landingPage-sections/Footer"

export const metadata = {
  title: "SafariLearn - Transform Team Learning",
  description: "Empower your teams with structured, engaging learning experiences. Track progress in real-time and measure impact.",
}

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-background">
      <CorporateTrainingNavbar />
      <ProductTeaserCard />
      <CorporateTrainingHero />
      <CaseStudiesCarousel />
      <FAQSection />
      <Footer />
    </div>
  )
}
