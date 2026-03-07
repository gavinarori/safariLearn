
import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="p-8">Finalizing payment...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}