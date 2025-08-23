'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-provider'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Clock,
  Ban,
  FileText,
  Settings,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VersionInfo } from '@/components/version-info'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agendamentos', label: 'Agendamentos', icon: Calendar },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/servicos', label: 'Serviços', icon: Scissors },
  { href: '/horarios', label: 'Horários', icon: Clock },
  { href: '/bloqueios', label: 'Bloqueios', icon: Ban },
  { href: '/relatorios', label: 'Relatórios', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()

  return (
    <div className={cn(
      "bg-background border-r transition-all duration-500 ease-in-out relative flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header com botão de toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <h2 className="text-xl font-bold whitespace-nowrap">Admin</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 flex-shrink-0"
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
                "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors relative group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
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
        "mt-auto p-4 border-t",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground">Bárbaros Admin</span>
          )}
          <VersionInfo variant="text" showDetails />
        </div>
      </div>
    </div>
  )
}