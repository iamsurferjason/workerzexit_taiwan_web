import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '後台管理',
  description: 'WORKERZ EXIT 後台管理登入與內容維護頁面。',
  path: '/admin',
  noIndex: true,
})

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Login page 不需要 sidebar
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {session ? (
        <div className="flex">
          <AdminSidebar user={session.user} />
          <main className="flex-1 min-h-screen ml-0 lg:ml-64 p-6 lg:p-8">
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
