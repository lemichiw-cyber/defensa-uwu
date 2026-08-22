import { createContext, useContext, useState } from "react"

type Toast = {
  id: number
  message: string
  variant?: "default" | "destructive"
}

type ToastContextValue = {
  toast: (props: { message: string; variant?: "default" | "destructive" }) => number
  dismiss: (id: number) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextId, setNextId] = useState(1)

  const toast = (props: { message: string; variant?: "default" | "destructive" }) => {
    const id = nextId
    const newToast: Toast = { id, message: props.message, variant: props.variant ?? "default" }
    setToasts((prev) => [...prev, newToast])
    setNextId((prev) => prev + 1)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
    return id
  }

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

export { ToastProvider }
