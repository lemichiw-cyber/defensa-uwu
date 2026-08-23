import { useEffect, useState } from "react"

export function Splash({ onDone }: { onDone: () => void }) {
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {

    const inicio = Date.now()
    const tick = setInterval(() => {
      const p = Math.min(100, ((Date.now() - inicio) / 3000) * 100)
      setProgreso(p)
    }, 50)
    const timer = setTimeout(onDone, 3000)
    return () => {
      clearInterval(tick)
      clearTimeout(timer)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 text-center text-white"
      style={{ background: "linear-gradient(135deg, #2563eb, #1e3a5f)" }}
      role="status"
      aria-label="Cargando plataforma"
    >
      <div
        className="size-10 rounded-full border-4 border-white/30 border-t-white"
        style={{ animation: "spin 1s linear infinite" }}
      />
      <h1 className="text-2xl font-bold">Cargando Plataforma</h1>
      <p className="opacity-80">Serás redirigido automáticamente en unos segundos...</p>

      {}
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-yellow-400 transition-[width] duration-100"
          style={{ width: `${progreso}%` }}
        />
      </div>

      <button
        onClick={onDone}
        className="rounded-[20px] bg-white px-6 py-2.5 font-bold text-blue-600 transition-transform hover:scale-105 hover:shadow-lg"
      >
        Entrar Ahora
      </button>
    </div>
  )
}
