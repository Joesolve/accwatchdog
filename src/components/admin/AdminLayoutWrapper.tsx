"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AdminSidebar } from "./AdminSidebar";
import { Loader2 } from "lucide-react";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const { status } = useSession();

  // Don't show sidebar on login page or when not authenticated
  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Show login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, show nothing (middleware will redirect)
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated user - show full admin layout with sidebar
  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
