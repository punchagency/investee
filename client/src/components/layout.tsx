import { Link, useLocation } from "wouter";
import { Building2, PieChart, Search, Menu, X, MapPin, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChatBot } from "@/components/chatbot";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Building2 },
    { href: "/property-search", label: "Property Search", icon: MapPin },
    { href: "/calculator", label: "Calculator", icon: Search },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/learning", label: "Learn", icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-lg tracking-tight text-primary transition-colors hover:text-primary/80">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <span>Investee</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                    location === item.href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
              >
                  {item.label}
              </Link>
            ))}
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                          "text-lg font-medium transition-colors hover:text-primary flex items-center gap-3 px-2 py-1",
                          location === item.href
                            ? "text-primary font-semibold bg-secondary/20 rounded-md"
                            : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                  ))}
                   <Link href="/dashboard">
                     <Button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-semibold" onClick={() => setIsOpen(false)}>Dashboard</Button>
                   </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <ChatBot />

      <footer className="border-t border-border/40 bg-muted/30 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl px-4 md:px-8">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with <span className="font-semibold">Investee</span>. The marketplace for commercial real estate financing.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
             <Link href="/terms"><a className="hover:underline">Terms</a></Link>
             <Link href="/privacy"><a className="hover:underline">Privacy</a></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
