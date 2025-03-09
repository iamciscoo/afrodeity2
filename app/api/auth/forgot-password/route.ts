import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

function generateResetToken(): string {
  return crypto.randomUUID()
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = forgotPasswordSchema.parse(json)

    const user = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return new NextResponse("Password reset email sent", { status: 200 })
    }

    const resetToken = generateResetToken()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${resetToken}`

    await resend.emails.send({
      from: "Afrodeity <noreply@afrodeity.com>",
      to: user.email,
      subject: "Reset your password",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })

    return new NextResponse("Password reset email sent", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    console.error("Password reset error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
} 