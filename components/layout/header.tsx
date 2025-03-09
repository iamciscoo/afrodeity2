"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "next-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { UserNav } from "@/components/layout/user-nav"

interface HeaderProps {
  user?: User & {
    id: string
    role: "ADMIN" | "USER"
  }
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className={cn("flex items-center", isSearchOpen ? "flex-1" : "hidden md:flex")}>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search products..."
                className="h-9 flex-1 md:w-[300px] lg:w-[400px]"
              />
              <Button type="submit" size="sm" className="h-9">
                Search
              </Button>
            </form>
          </div>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
} 