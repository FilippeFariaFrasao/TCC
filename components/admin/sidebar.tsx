'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Clock,
  Ban,
  FileText,
  Settings,
} from 'lucide-react'

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

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Bárbaros Admin</h2>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}