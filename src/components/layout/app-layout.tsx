import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export function AppLayout({ children, showHeader = true }: { children: React.ReactNode, showHeader?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {showHeader && <Header />}
      <main className="flex-1 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
