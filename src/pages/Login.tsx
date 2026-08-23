import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación")
    }
  }

  const fillDemo = () => {
    setEmail("maria@mievento.com")
    setPassword("demo1234")
    if (mode === "register") setName("María García")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg md:grid-cols-2">
        {}
        <div
          className="relative hidden flex-col justify-between p-10 text-white md:flex"
          style={{ background: "linear-gradient(135deg,#2563eb,#1e3a5f)" }}
        >
          <div>
            <span
              className="flex size-11 items-center justify-center rounded-xl text-xl font-bold"
              style={{ background: "#f1c40f" }}
            >
              M
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              Bienvenido a la
              <br />
              Plataforma
            </h2>
            <p className="mt-3 max-w-xs text-sm opacity-85">
              Gestiona actividades, exámenes, foros y clases en línea. Todo en
              un solo lugar.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm">
            {["Actividades y agenda", "Foro estudiantil", "Videollamadas en vivo", "Panel para administradores"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full" style={{ background: "#f1c40f" }} />
                  {item}
                </li>
              )
            )}
          </ul>

          <p className="text-xs uppercase tracking-[3px] opacity-70">
            Plataforma Educativa
          </p>
        </div>

        {}
        <div className="bg-white p-7 sm:p-9">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {mode === "login"
                ? "Accede a tu panel de la plataforma"
                : "Únete y empieza a organizar todo"}
            </p>
          </div>

          {error && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "login" | "register")}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="grid gap-2">
                  <Label htmlFor="reg-name">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="reg-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="pl-10"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </Button>
            </form>
          </Tabs>

          <div className="pt-5">
            <button
              type="button"
              onClick={fillDemo}
              className="mx-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 underline-offset-4 hover:underline"
            >
              <CheckCircle2 size={14} /> Usar cuenta demo
            </button>
            <p className="mt-2 text-center text-xs leading-relaxed text-gray-500">
              <strong>Admin:</strong> maria@mievento.com / demo1234 ·{" "}
              <strong>Usuario:</strong> carlos@mievento.com / demo1234
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
