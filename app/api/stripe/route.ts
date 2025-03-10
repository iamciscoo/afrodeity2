import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items?.length || !shippingAddress) {
      return new NextResponse("Bad request", { status: 400 });
    }

    // Calculate total amount
    const total = items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + Number(item.price) * item.quantity,
      0
    );

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userId: session.user.id,
      },
    });

    // First create the shipping address
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        street: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
    });

    // Then create the order with the address
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total: total,
        addressId: address.id,
        paymentIntent: paymentIntent.id,
        orderItems: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
        address: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 