import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
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
    <Card className="w-full max-w-md mx-auto mt-16">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "login"
              ? "Accede a tu panel de eventos"
              : "Empieza a organizar tus mejores momentos"}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200" role="alert">
            {error}
          </div>
        )}

        <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "register")} className="space-y-4">
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
                  placeholder="tú@ejemplo.com"
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

        <div className="pt-4">
          <button
            type="button"
            onClick={fillDemo}
            className="text-sm text-primary underline-offset-4 hover:underline flex items-center gap-1.5 justify-center mx-auto"
          >
            <CheckCircle2 size={14} /> Usar demo (maria@mievento.com / demo1234)
          </button>
        </div>
      </div>
    </Card>
  )
}