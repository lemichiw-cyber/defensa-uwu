import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { CheckCircle2, XCircle, X } from "lucide-react"

type ToastVariant = "default" | "destructive"

type ToastItem = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (props: { message: string; variant?: ToastVariant }) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const AUTO_DISMISS_MS = 4000

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (props: { message: string; variant?: ToastVariant }) => {
      const id = nextId.current++
      setToasts((prev) => [
        ...prev,
        { id, message: props.message, variant: props.variant ?? "default" },
      ])
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      return id
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-xs flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border p-3 shadow-lg transition-all ${
              t.variant === "destructive"
                ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                : "border-violet-200 bg-white text-gray-800 dark:border-violet-800 dark:bg-[#1e293b] dark:text-gray-100"
            }`}
            style={{ animation: "toast-in .25s ease-out" }}
          >
            {t.variant === "destructive" ? (
              <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
            )}
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar notificación"
              className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

export { ToastProvider }
