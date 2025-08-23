'use client'

import { Bell, User, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Painel Administrativo
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <button className="p-2 hover:bg-accent rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg">
              <User className="h-5 w-5" />
              <span className="text-sm">Admin</span>
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