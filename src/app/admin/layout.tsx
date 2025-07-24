import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
} 