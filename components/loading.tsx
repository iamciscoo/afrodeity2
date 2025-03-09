import { Icons } from "@/components/icons"

export function Loading() {
  return (
    <div className="flex h-[450px] w-full items-center justify-center">
      <Icons.spinner className="h-8 w-8 animate-spin" />
    </div>
  )
} 