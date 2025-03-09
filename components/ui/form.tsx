import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { Controller, ControllerProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormProps<T extends FieldValues> = React.PropsWithChildren<{
  form: UseFormReturn<T>
  onSubmit: (data: T) => Promise<void> | void
  className?: string
}>

export function Form<T extends FieldValues>({ form, onSubmit, children, className }: FormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      {children}
    </form>
  )
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <Controller {...props} />
  )
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />
}

export function FormLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return <Label className={cn("", className)} {...props} />
}

export function FormControl({ ...props }: React.ComponentPropsWithoutRef<typeof Slot>) {
  return <Slot {...props} />
}

export function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null

  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  )
} 