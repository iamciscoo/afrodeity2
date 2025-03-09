"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"

interface DashboardHeaderProps {
  user?: User & {
    id: string
    role: "ADMIN" | "USER"
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Dashboard
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="ml-auto" asChild>
              <Link href="/">View Store</Link>
            </Button>
          </div>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
} 