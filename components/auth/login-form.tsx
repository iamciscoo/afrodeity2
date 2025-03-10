"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "@/auth"
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
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const searchParams = useSearchParams()
  const [isPending, setPending] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormData) {
    setPending(true)

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (!result?.ok) {
        toast.error("Invalid email or password")
        return
      }

      const returnUrl = searchParams.get("from") || "/"
      window.location.replace(returnUrl)
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
            Sign In
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signIn("github")}
          disabled={isPending}
        >
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signIn("google")}
          disabled={isPending}
        >
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>
    </div>
  )
} 