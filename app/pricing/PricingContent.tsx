
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { createClient } from "@/superbase/client";
import { toast } from "sonner";

const supabase = createClient();

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Perfect for individuals",
    description: "Access this course with full features",
    amountKES: 2999,
    features: [
      "Full course access",
      "Quizzes & certificates",
      "Progress tracking",
      "Community access",
    ],
    recommended: true,
    cta: "Enroll Now",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For large organizations",
    description: "Custom compliance training at scale",
    amountKES: null,
    features: [
      "Unlimited users",
      "Custom integrations",
      "Dedicated support",
      "SLA & reporting",
    ],
    recommended: false,
    cta: "Contact Sales",
  },
];

export default function PricingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = searchParams.get("courseId");

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
        return;
      }

      setUserEmail(user.email ?? null);
      setUserId(user.id);
    };

    loadUser();
  }, [router]);

  const handlePaystackCheckout = async (plan: typeof pricingPlans[0]) => {
    if (!courseId || !userEmail || !userId) {
      toast.error("Missing required data – please try again");
      return;
    }

    if (plan.id === "enterprise") {
      window.location.href = "mailto:sales@yourcompany.com?subject=Enterprise%20Pricing%20Inquiry";
      return;
    }

    try {
      setLoadingPlan(plan.id);

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          amount: plan.amountKES,
          courseId,
          userId,
          planId: plan.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      window.location.href = data.authorization_url;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong with payment");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-8">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.recommended ? "border-primary shadow-lg bg-primary/5" : ""}`}
          >
            {plan.recommended && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Recommended
              </Badge>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.subtitle}</CardDescription>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {plan.amountKES ? (
                <div className="text-4xl font-bold">
                  KES {(plan.amountKES / 100).toFixed(2)}
                </div>
              ) : (
                <div className="text-2xl font-semibold">Custom Pricing</div>
              )}

              <div className="space-y-2">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                onClick={() => handlePaystackCheckout(plan)}
                disabled={loadingPlan === plan.id || !userId}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  plan.cta
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}