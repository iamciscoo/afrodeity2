"use client"

import Link from "next/link"
import { User, Order } from "@prisma/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentCustomersProps {
  customers: (User & {
    orders: Order[]
  })[]
}

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={customer.image || ""} alt={customer.name || ""} />
                <AvatarFallback>
                  {customer.name?.charAt(0) || customer.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {customer.name || customer.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customer.orders.length} order{customer.orders.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            href="/dashboard/customers"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View all customers
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 