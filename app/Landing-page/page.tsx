import {  CorporateTrainingNavbar} from "@/components/landingPage-sections/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/landingPage-sections/ProductTeaserCard"
import { CorporateTrainingHero} from "@/components/landingPage-sections/Hero"
import { CaseStudiesCarousel } from "@/components/landingPage-sections/CaseStudiesCarousel"
import { IntegrationCarousel } from "@/components/landingPage-sections/IntegrationCarousel"
import { PricingSection } from "@/components/landingPage-sections/PricingSection"
import { FAQSection } from "@/components/landingPage-sections/FAQSection"
import { Footer } from "@/components/landingPage-sections/Footer"

export default function Page() {
  return (
    <>
      <CorporateTrainingNavbar />
      <ProductTeaserCard />
      <CorporateTrainingHero />
      <CaseStudiesCarousel />
      <FAQSection />
      <Footer />
    </>
  )
}
