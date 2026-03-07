"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params.get("reference");

  useEffect(() => {
    if (!reference) {
      router.push("/payment/error");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        router.push(`/courses/${data.courseId}`);

      } catch (err) {
        console.error(err);
        router.push("/payment/error");
      }
    };

    verify();
  }, [reference, router]);

  return <p className="p-8">Finalizing payment...</p>;
}