import { Link, useLocation } from "wouter";
import { Building2, PieChart, Search, Menu, X, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChatBot } from "@/components/chatbot";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Building2 },
    { href: "/property-search", label: "Property Search", icon: MapPin },
    { href: "/calculator", label: "Calculator", icon: Search },
    { href: "/learning", label: "Learn", icon: Search },
    { href: "/proposal", label: "Proposal Designs", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-slate-900 transition-colors hover:opacity-80">
              <InvesteeLogo size={36} />
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

      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <InvesteeLogo size={28} />
                <h2 className="text-xl font-bold text-slate-900">Investee</h2>
              </div>
              <p className="text-sm text-slate-500 max-w-xs mb-6">
                The leading ecosystem connecting investors, owners, and contractors for streamlined real estate development.
              </p>
              <div className="flex gap-4">
                <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fillRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Platform</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="/property-search" className="hover:text-primary transition-colors">Browse Properties</Link></li>
                <li><Link href="/learning" className="hover:text-primary transition-colors">Success Stories</Link></li>
                <li><Link href="/calculator" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/learning" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Roles</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="/calculator" className="hover:text-primary transition-colors">For Investors</Link></li>
                <li><Link href="/property-search" className="hover:text-primary transition-colors">For Owners</Link></li>
                <li><Link href="/calculator" className="hover:text-primary transition-colors">For Lenders</Link></li>
                <li><Link href="/calculator" className="hover:text-primary transition-colors">For Contractors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="/learning" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><a href="mailto:contact@investee.com" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2024 Investee. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <a href="#" className="hover:text-slate-900">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
