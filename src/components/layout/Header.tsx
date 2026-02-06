"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "Dashboard", href: "/dashboard" },
  {
    name: "Information",
    href: "#",
    children: [
      { name: "Case Highlights", href: "/cases" },
      { name: "News & Updates", href: "/news" },
      { name: "Educational Resources", href: "/resources" },
    ],
  },
  { name: "Report Corruption", href: "/report-corruption" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-white">ACC</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-primary">Anti-Corruption Commission</p>
            <p className="text-xs text-muted-foreground">Sierra Leone</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-1">
          {navigation.map((item) =>
            item.children ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.name} asChild>
                      <Link
                        href={child.href}
                        className={cn(
                          pathname === child.href && "bg-accent"
                        )}
                      >
                        {child.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent"
                )}
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin Portal
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <p className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    {item.name}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-3 py-2 pl-6 text-sm rounded-md",
                        pathname === child.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/60 hover:bg-accent"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-4 border-t">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
