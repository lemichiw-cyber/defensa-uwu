import { ThemeProvider } from "@/components/ui/theme/ThemeContext"
import { useState } from "react"
import { ToastProvider, useToast } from "@/components/ui/toast/ToastContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Dashboard } from "@/pages/Dashboard"
import { Landing } from "@/pages/Landing"
import { NewEventDialog } from "@/components/NewEventDialog"
import { Splash } from "@/components/Splash"
import { LoginPage } from "@/pages/Login"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { eventsApi, type EventItem } from "@/lib/api"
import { type EventItem as LocalEventItem } from "@/data/events"

type View = "landing" | "dashboard"

function AppContent() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [view, setView] = useState<View>("landing")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [splash, setSplash] = useState(false)
  const [pendingSection, setPendingSection] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (view === "dashboard" && !user) {
    return <LoginPage onSuccess={() => setView("dashboard")} />
  }

  const openNewEvent = () => {

    if (!user) {
      toast({ message: "Inicia sesión para crear eventos", variant: "destructive" })
      setView("dashboard")
      return
    }
    setEditingEvent(null)
    setDialogOpen(true)
  }

  const openEditEvent = (event: LocalEventItem) => {
    setEditingEvent(event as EventItem)
    setDialogOpen(true)
  }

  const entrarConSeccion = (sectionId: string) => {
    setPendingSection(sectionId)
    setView("dashboard")
    setSplash(true)
    window.scrollTo({ top: 0 })
  }

  const handleSave = async (data: {
    title: string
    description?: string
    date: string
    time: string
    location: string
    image: string
  }) => {
    const base = {
      title: data.title,
      description: data.description ?? null,
      date: data.date,
      time: data.time,
      location: data.location,
      image: data.image,
    }
    try {
      if (editingEvent) {

        await eventsApi.update(editingEvent.id, base)
        toast({ message: "Evento actualizado correctamente" })
      } else {
        await eventsApi.create({ ...base, status: "proximo" })
        toast({ message: "Evento creado correctamente" })
      }
      setDialogOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      toast({
        message:
          err instanceof Error ? err.message : "No se pudo guardar el evento",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <Navbar view={view} onNavigate={setView} onNewEvent={openNewEvent} />
      <div className="flex-1">
        {view === "dashboard" ? (
          <Dashboard
            key={`${refreshKey}:${pendingSection ?? "inicio"}`}
            initialSection={pendingSection}
            onNewEvent={openNewEvent}
            onEditEvent={openEditEvent}
            onDeleteEvent={() => {}}
          />
        ) : (
          <Landing onEnterSection={entrarConSeccion} />
        )}
      </div>
      <Footer />
      {}
      {view === "dashboard" && splash && (
        <Splash onDone={() => setSplash(false)} />
      )}
      <NewEventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editingEvent}
        onSave={handleSave}
      />
    </div>
  )
}

export default function App() {
  return (<ThemeProvider><AuthProvider><ToastProvider><AppContent /></ToastProvider></AuthProvider></ThemeProvider>)
}