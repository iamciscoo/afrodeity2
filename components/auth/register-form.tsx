"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isPending, setPending] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormData) {
    setPending(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Something went wrong")
      }

      toast.success("Account created successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem className="space-y-1">
            <FormLabel className="block text-sm font-medium">Name</FormLabel>
            <FormControl>
              <Input
                {...form.register("name")}
                type="text"
                placeholder="John Doe"
                className="w-full"
                disabled={isPending}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
          <FormItem className="space-y-1">
            <FormLabel className="block text-sm font-medium">Email</FormLabel>
            <FormControl>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full"
                disabled={isPending}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
          <FormItem className="space-y-1">
            <FormLabel className="block text-sm font-medium">Password</FormLabel>
            <FormControl>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full"
                disabled={isPending}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            variant="default"
            size="lg"
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  )
} 