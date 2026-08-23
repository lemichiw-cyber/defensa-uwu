import { ChevronsLeft, ChevronsRight, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { sidebarItems } from "@/data/sidebar"

interface SidebarProps {
  collapsed: boolean
  active: string
  esAdmin: boolean
  onToggleCollapse: () => void
  onSelect: (id: string) => void
}

export function Sidebar({
  collapsed,
  active,
  esAdmin,
  onToggleCollapse,
  onSelect,
}: SidebarProps) {

  const visibles = sidebarItems.filter((item) => !item.soloAdmin || esAdmin)

  return (
    <aside
      className={cn(
        "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-gray-200/80 bg-white transition-[width] duration-300 ease-in-out md:flex",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {visibles.map(({ id, label, icon: Icon, soloAdmin }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              title={collapsed ? label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-violet-600"
                    : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && soloAdmin && (
                <Lock className="ml-auto size-3.5 text-violet-400" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={onToggleCollapse}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronsRight className="size-5" />
          ) : (
            <>
              <ChevronsLeft className="size-5" />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
