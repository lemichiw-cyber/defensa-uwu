import { useToast } from "@/components/ui/toast/ToastContext"

export function Toast({ message, variant = "default" }: { message: string; variant?: "default" | "destructive" }) {
  const { toast } = useToast()
  toast({ message, variant })
  return null
}
