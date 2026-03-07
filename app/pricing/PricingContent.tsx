"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";

import { createClient } from "@/superbase/client";
import { toast } from "sonner";

const supabase = createClient();

const seatPlans = [
  { id: "individual", name: "Individual", seats: 1, description: "Single learner access" },
  { id: "team_10", name: "Team 10", seats: 10, description: "Invite up to 10 employees", recommended: true },
  { id: "team_25", name: "Team 25", seats: 25, description: "Invite up to 25 employees" },
  { id: "team_50", name: "Team 50", seats: 50, description: "Invite up to 50 employees" },
];

export default function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");
  const coursePrice = Number(searchParams.get("price")) || 0;

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(
          "/login?redirect=" +
            encodeURIComponent(window.location.pathname + window.location.search)
        );
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("users")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (profile?.company_id) setCompanyId(profile.company_id);
    };

    loadUser();
  }, [router]);

  const calculatePrice = (seats: number) => {
    const total = coursePrice * seats;
    const discount = total * 0.1;
    return total - discount;
  };

  const handleCheckout = async (plan: any) => {
    if (!courseId || !userEmail || !userId) {
      toast.error("Missing required data");
      return;
    }

    try {
      setLoadingPlan(plan.id);

      const amountKES = calculatePrice(plan.seats);
      const amount = Math.round(amountKES * 100);

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail,
          amount,
          courseId,
          userId,
          companyId,
          planId: plan.id,
          seats: plan.seats,
          currency: "KES"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      window.location.href = data.authorization_url;

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Payment error");
    } finally {
      setLoadingPlan(null);
    }
  };

  if (!coursePrice) {
    return (
      <div className="py-20 text-center">
        <p>Course pricing unavailable</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">Team & Individual Pricing</h2>
        <p className="text-muted-foreground mt-2">
          Save 10% when enrolling teams
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {seatPlans.map((plan) => {
          const finalPrice = calculatePrice(plan.seats);
          const originalPrice = coursePrice * plan.seats;

          return (
            <Card key={plan.id} className={`relative ${plan.recommended ? "border-primary shadow-lg bg-primary/5" : ""}`}>

              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">

                <div>
                  <div className="text-4xl font-bold">
                    KES {finalPrice.toLocaleString()}
                  </div>

                  {plan.seats > 1 && (
                    <div className="text-sm line-through text-muted-foreground">
                      KES {originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={loadingPlan === plan.id}
                  onClick={() => handleCheckout(plan)}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Buy ${plan.seats} Seat${plan.seats > 1 ? "s" : ""}`
                  )}
                </Button>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}