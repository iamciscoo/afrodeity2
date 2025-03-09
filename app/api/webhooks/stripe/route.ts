import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"
import { OrderStatus } from "@prisma/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

async function getOrderByPaymentIntentId(paymentIntentId: string) {
  return prisma.order.findUnique({
    where: {
      paymentIntent: paymentIntentId,
    },
  })
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent

  switch (event.type) {
    case "payment_intent.succeeded": {
      const order = await getOrderByPaymentIntentId(paymentIntent.id)

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        )
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PROCESSING },
      })

      break
    }

    case "payment_intent.payment_failed": {
      const order = await getOrderByPaymentIntentId(paymentIntent.id)

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        )
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      })

      break
    }
  }

  return NextResponse.json({ received: true })
} 