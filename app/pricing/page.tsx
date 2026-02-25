
import { Suspense } from "react";
import PricingContent from "./PricingContent";   // ← new client file
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero – fully static */}
      <section className="py-20 text-center space-y-4">
        <Badge>Course Pricing</Badge>
        <h1 className="text-5xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Unlock full access to this course and start learning immediately.
        </p>
      </section>

      {/* Pricing cards – dynamic part wrapped in Suspense */}
      <Suspense fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-lg">Loading pricing options...</p>
        </div>
      }>
        <PricingContent />
      </Suspense>
    </div>
  );
}