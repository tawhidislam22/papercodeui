import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        {/* On mobile: pad top for the fixed header bar (h-14). On desktop: pad left for sidebar (w-60). */}
        <main className="pt-14 lg:pt-0 lg:ml-60">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
