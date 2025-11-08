'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-provider'
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  UserCheck,
  Scissors,
  Clock,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VersionInfo } from '@/components/version-info'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agendamentos', label: 'Agendamentos', icon: Calendar },
  { href: '/calendario', label: 'Calendário', icon: CalendarDays },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/colaboradores', label: 'Colaboradores', icon: UserCheck },
  { href: '/servicos', label: 'Serviços', icon: Scissors },
  { href: '/horarios', label: 'Horários', icon: Clock },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()

  return (
    <div
      className={cn(
        "bg-background border-r transition-all duration-500 ease-in-out relative flex flex-col shadow-[4px_0_30px_-28px_rgba(0,0,0,0.6)]",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header com botão de toggle */}
      <div className="p-4 border-b border-border/60 bg-gradient-to-r from-transparent via-transparent to-primary/10 flex items-center justify-between">
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
            Bárbaros Barbearia
          </p>
          <h2 className="text-xl font-bold whitespace-nowrap text-primary">
            Admin
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 flex-shrink-0 text-primary hover:text-primary-foreground hover:bg-primary/15 border border-transparent hover:border-primary/30 transition-colors"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navegação */}
      <nav className="px-4 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl mb-1 transition-all relative group overflow-hidden border border-transparent",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-12px_rgba(245,124,0,0.9)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-primary-foreground/80"
                  : "hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
                isCollapsed
                  ? "justify-center p-2 mx-0"
                  : "gap-3 px-3 py-2"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-primary/70 group-hover:text-primary"
                )}
              />
              <span className={cn(
                "truncate transition-all duration-300 ease-in-out",
                isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}>
                {item.label}
              </span>

              {/* Tooltip para sidebar colapsada */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé com versão */}
      <div className={cn(
        "mt-auto p-4 border-t border-border/60 bg-gradient-to-r from-primary/5 via-transparent to-transparent",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <span className="text-xs font-medium tracking-wide text-primary">
              Bárbaros Admin
            </span>
          )}
          <VersionInfo variant="text" showDetails />
        </div>
      </div>
    </div>
  )
}
