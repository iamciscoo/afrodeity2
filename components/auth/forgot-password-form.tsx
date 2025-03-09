"use client"

import * as React from "react"
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
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function ForgotPasswordForm() {
  const [isPending, setPending] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: FormData) {
    setPending(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        toast.error("Something went wrong. Please try again.")
        return
      }

      toast.success("Password reset email sent. Please check your inbox.")
      form.reset()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormItem className="space-y-1">
        <FormLabel className="block text-sm font-medium">Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="name@example.com"
            className="w-full"
            {...form.register("email")}
          />
        </FormControl>
        {form.formState.errors.email && (
          <FormMessage className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </FormMessage>
        )}
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
        Send Reset Link
      </Button>
    </Form>
  )
} 