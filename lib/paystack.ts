export const startPaystackPayment = ({
  email,
  amount,
  reference,
  onSuccess,
}: {
  email: string
  amount: number
  reference: string
  onSuccess: () => void
}) => {
  const handler = (window as any).PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100,
    currency: "KSH",
    reference,
    callback: () => {
      onSuccess()
    },
  })

  handler.openIframe()
}
