import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"

const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(6),
})

async function getPasswordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hash).toString('hex');
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = resetPasswordSchema.parse(json)

    const user = await prisma.user.findUnique({
      where: { resetToken: body.token },
      select: {
        id: true,
        email: true,
        resetTokenExpiry: true,
      },
    })

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return new NextResponse("Invalid or expired reset token", { status: 400 })
    }

    const hashedPassword = await getPasswordHash(body.password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return new NextResponse(JSON.stringify({ email: user.email }), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    console.error("Password reset error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
} 