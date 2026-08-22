import { ThemeProvider } from "@/components/ui/theme/ThemeContext"
import { useState } from "react"
import { ToastProvider } from "@/components/ui/toast/ToastContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Dashboard } from "@/pages/Dashboard"
import { Landing } from "@/pages/Landing"
import { NewEventDialog } from "@/components/NewEventDialog"
import { LoginPage } from "@/pages/Login"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { eventsApi, type EventItem } from "@/lib/api"
import { type EventItem as LocalEventItem } from "@/data/events"

type View = "landing" | "dashboard"

function AppContent() {
  const { user, loading } = useAuth()
  const [view, setView] = useState<View>("landing")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

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
    setEditingEvent(null)
    setDialogOpen(true)
  }

  const openEditEvent = (event: LocalEventItem) => {
    setEditingEvent(event as EventItem)
    setDialogOpen(true)
  }

  const handleSave = async (data: {
    title: string
    description?: string
    date: string
    time: string
    location: string
    image: string
  }) => {
    const apiData = {
      ...data,
      description: data.description ?? null,
      status: "proximo" as const,
    }
    if (editingEvent) {
      await eventsApi.update(editingEvent.id, apiData)
    } else {
      await eventsApi.create(apiData)
    }
    setDialogOpen(false)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <Navbar view={view} onNavigate={setView} onNewEvent={openNewEvent} />
      <div className="flex-1">
        {view === "dashboard" ? (
          <Dashboard
            key={refreshKey}
            onNewEvent={openNewEvent}
            onEditEvent={openEditEvent}
            onDeleteEvent={() => {}}
          />
        ) : (
          <Landing onNewEvent={openNewEvent} onSeeEvents={() => setView("dashboard")} />
        )}
      </div>
      <Footer />
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