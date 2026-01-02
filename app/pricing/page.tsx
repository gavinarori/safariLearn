"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Users } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Perfect for small teams",
    description: "Get your team started with essential compliance training",
    monthlyPrice: 2999, // 29.99 USD in cents
    pricePerEmployee: 300, // 3 USD per employee/month
    employees: "Up to 10 employees",
    features: [
      "Up to 10 employees",
      "5 compliance courses",
      "Basic progress tracking",
      "Email support",
      "Certificate generation",
      "1 admin account",
    ],
    excluded: ["Advanced analytics", "Custom branding", "API access", "Dedicated support"],
    recommended: false,
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "For growing companies",
    description: "Scale your compliance training across departments",
    monthlyPrice: 9999, // 99.99 USD in cents
    pricePerEmployee: 150, // 1.50 USD per employee/month
    employees: "Up to 100 employees",
    features: [
      "Up to 100 employees",
      "Unlimited courses",
      "Advanced analytics & reports",
      "Custom course content",
      "Manager dashboard",
      "Up to 5 admin accounts",
      "Priority email & chat support",
      "API access",
    ],
    excluded: ["Custom branding", "Dedicated support", "SLA guarantee"],
    recommended: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For large organizations",
    description: "Full-featured compliance training at scale",
    monthlyPrice: null, // Custom pricing
    pricePerEmployee: null,
    employees: "500+ employees",
    features: [
      "Unlimited employees",
      "Unlimited courses",
      "Advanced analytics & compliance reports",
      "Full API access",
      "Custom integrations (HRIS, LMS)",
      "Unlimited admin accounts",
      "Dedicated account manager",
      "24/7 priority support",
      "SLA guarantee",
      "Custom branding & white-label",
      "Role-based access control (RBAC)",
      "SSO & SAML support",
    ],
    excluded: [],
    recommended: false,
    cta: "Contact Sales",
  },
]

const paymentMethods = [
  { id: "paystack", name: "Paystack", icon: "💳", description: "Credit/Debit Card" },
  { id: "mpesa", name: "M-Pesa", icon: "📱", description: "Mobile Money" },
]

const comparisonFeatures = [
  { name: "Team Size", key: "teamSize" },
  { name: "Courses", key: "courses" },
  { name: "Progress Analytics", key: "analytics" },
  { name: "Manager Dashboard", key: "dashboard" },
  { name: "API Access", key: "api" },
  { name: "Custom Integrations", key: "integrations" },
  { name: "Support", key: "support" },
  { name: "White Label", key: "whiteLable" },
]

export default function PricingPage() {
  const [selectedPayment, setSelectedPayment] = useState("paystack")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const handleSelectPlan = (planId: string) => {
    if (planId === "enterprise") {
      window.location.href = "mailto:sales@compliance.io"
    } else {
      setSelectedPlan(planId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            ComplianceHub
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/pricing" className="text-sm text-primary font-medium">
              Pricing
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Start Free Trial</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <Badge className="w-fit mx-auto">Flexible Plans for Every Company Size</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-balance">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your organization. All plans include core compliance features. Upgrade anytime as
            you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Annual <span className="text-sm ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative transition-all duration-300 ${plan.recommended ? "md:scale-105 md:z-10" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">MOST POPULAR</Badge>
                </div>
              )}

              <Card
                className={`h-full flex flex-col overflow-hidden transition-all ${
                  plan.recommended ? "border-primary/50 bg-primary/5 shadow-lg" : "border-muted hover:border-primary/30"
                }`}
              >
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.subtitle}</CardDescription>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-6">
                  {/* Pricing */}
                  <div className="space-y-1">
                    {plan.monthlyPrice ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            {billingCycle === "monthly"
                              ? `$${(plan.monthlyPrice / 100).toFixed(2)}`
                              : `$${((plan.monthlyPrice * 12 * 0.8) / 100).toFixed(2)}`}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        {plan.pricePerEmployee && (
                          <p className="text-xs text-muted-foreground">
                            ${(plan.pricePerEmployee / 100).toFixed(2)} per employee/month
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl font-semibold">Custom Pricing</div>
                    )}
                  </div>

                  {/* Employee Count */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{plan.employees}</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${plan.recommended ? "" : "variant-outline"}`}
                    variant={plan.recommended ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>

                  {/* Features List */}
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-semibold text-muted-foreground">What's included:</p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}

                    {plan.excluded.length > 0 && (
                      <div className="space-y-3 pt-4 border-t">
                        {plan.excluded.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 opacity-50">
                            <X className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-sm line-through">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      {selectedPlan && selectedPlan !== "enterprise" && (
        <section className="max-w-2xl mx-auto px-4 py-16 bg-muted/30 rounded-lg border">
          <h2 className="text-2xl font-bold mb-8 text-center">Select Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPayment === method.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/30"
                }`}
              >
                <div className="text-3xl mb-2">{method.icon}</div>
                <p className="font-semibold">{method.name}</p>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </button>
            ))}
          </div>

          <Button className="w-full mt-8" size="lg">
            Proceed to {selectedPayment === "paystack" ? "Paystack" : "M-Pesa"} Checkout
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            All transactions are encrypted and secure. No setup fees or hidden charges.
          </p>
        </section>
      )}

      {/* Feature Comparison */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Detailed Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold">Feature</th>
                {pricingPlans.map((plan) => (
                  <th key={plan.id} className="text-center py-4 px-4 font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature) => (
                <tr key={feature.key} className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium">{feature.name}</td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Can I change plans anytime?",
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
            },
            {
              q: "Do you offer discounts for annual billing?",
              a: "Yes! Annual plans include a 20% discount compared to monthly pricing. ",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept Paystack (credit/debit cards) and M-Pesa (mobile money) for maximum flexibility.",
            },
            {
              q: "Is there a free trial?",
              a: "Yes, start with a 14-day free trial on any plan. No credit card required to get started.",
            },
            {
              q: "Do you provide customer support?",
              a: "All plans include support. Starter plans get email support, Professional gets priority email/chat, and Enterprise gets 24/7 dedicated support.",
            },
          ].map((faq, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-t py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Transform Your Compliance Training?</h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of companies using ComplianceHub to streamline employee training and ensure regulatory
            compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">ComplianceHub</h3>
            <p className="text-sm text-muted-foreground">Enterprise compliance training for the modern workplace.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ComplianceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
