import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { SidebarProvider } from '@/components/admin/sidebar-provider'
import { ThemeProvider } from '@/components/theme-provider'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="barbearia-theme">
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}