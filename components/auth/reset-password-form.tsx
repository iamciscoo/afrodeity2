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
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof formSchema>

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isPending, setPending] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: FormData) {
    setPending(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      if (!response.ok) {
        throw new Error("Something went wrong")
      }

      toast.success("Password reset successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Failed to reset password")
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem className="space-y-1">
          <FormLabel className="block text-sm font-medium">New Password</FormLabel>
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
        <FormItem className="space-y-1">
          <FormLabel className="block text-sm font-medium">Confirm Password</FormLabel>
          <FormControl>
            <Input
              {...form.register("confirmPassword")}
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
          Reset Password
        </Button>
      </form>
    </Form>
  )
} 