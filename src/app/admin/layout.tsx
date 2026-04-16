import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
          <AdminSidebar user={session.user as any} />
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
