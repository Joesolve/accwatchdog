"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  AlertTriangle,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Newspaper,
  BookOpen,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Statistics", href: "/admin/statistics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
  { name: "Cases", href: "/admin/cases", icon: Scale },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Resources", href: "/admin/resources", icon: BookOpen },
];

const adminNavigation = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <span className="text-sm font-bold">ACC</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">ACC Admin</p>
          <p className="text-xs text-slate-400">Management Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Admin-only section */}
        {session?.user?.role === "ADMIN" && (
          <>
            <Separator className="my-4 bg-slate-700" />
            <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase">
              Administration
            </p>
            <div className="space-y-1">
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-white">
              {session?.user?.name ? getInitials(session.user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{session?.user?.role}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-300 hover:text-white hover:bg-slate-800"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Public Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
