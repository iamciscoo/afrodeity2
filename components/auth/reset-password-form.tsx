import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import type { FieldValues, UseFormReturn } from "react-hook-form"
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

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: FormData) {
    const token = searchParams.get("token")

    if (!token) {
      toast.error("Missing reset token")
      return
    }

    startTransition(async () => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      if (!response.ok) {
        toast.error("Something went wrong. Please try again.")
        return
      }

      toast.success("Password reset successful. You can now login with your new password.")
      form.reset()
    })
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormItem className="space-y-1">
        <FormLabel className="block text-sm font-medium">New Password</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Enter your new password"
            className="w-full"
            {...form.register("password")}
          />
        </FormControl>
        {form.formState.errors.password && (
          <FormMessage className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </FormMessage>
        )}
      </FormItem>
      <FormItem className="space-y-1">
        <FormLabel className="block text-sm font-medium">Confirm Password</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Confirm your new password"
            className="w-full"
            {...form.register("confirmPassword")}
          />
        </FormControl>
        {form.formState.errors.confirmPassword && (
          <FormMessage className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
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
        Reset Password
      </Button>
    </Form>
  )
} 