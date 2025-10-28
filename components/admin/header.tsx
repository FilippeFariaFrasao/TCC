'use client'

import { Bell, User, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="bg-background border-b border-border/60 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-1 w-10 rounded-full bg-primary" />
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              Bárbaros Barbearia
            </p>
          </div>
          <h1 className="text-2xl font-bold text-primary">
            Painel Administrativo
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button className="p-2 rounded-lg border border-transparent text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 p-2 rounded-lg border border-transparent hover:bg-accent transition-colors hover:border-primary/30">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Admin
              </span>
            </button>
            <button className="p-2 hover:bg-accent rounded-lg text-red-600">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
