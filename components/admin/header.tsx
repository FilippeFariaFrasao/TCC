'use client'

import { Bell, User, LogOut } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Painel Administrativo
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">Admin</span>
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}