import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { prisma } from "@/lib/db"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

async function getPasswordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hash).toString('hex');
}

// Ensure NEXTAUTH_SECRET is set
const authSecret = process.env.NEXTAUTH_SECRET
if (!authSecret && process.env.NODE_ENV === 'production') {
  throw new Error('NEXTAUTH_SECRET is not set in production')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = loginSchema.safeParse(credentials)

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data
            const user = await prisma.user.findUnique({
              where: { email }
            })
            
            if (!user || !user.password) return null
            
            const hashedPassword = await getPasswordHash(password)
            const passwordsMatch = user.password === hashedPassword
            
            if (passwordsMatch) return user
          }
          
          console.log("Invalid credentials")
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      try {
        const user = await prisma.user.findUnique({
          where: { id: token.sub }
        })

        if (!user) return token

        token.role = user.role

        return token
      } catch (error) {
        console.error("JWT error:", error)
        return token
      }
    }
  }
}) 