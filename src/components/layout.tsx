import { Link, useLocation } from "wouter";
import { Building2, PieChart, Search, Menu, X, MapPin, Bell, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChatBot } from "@/components/chatbot";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();

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
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                  Dashboard
                </Button>
              </Link>
            )}
            
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu-trigger">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} style={{ objectFit: 'cover' }} />
                      <AvatarFallback>
                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium" data-testid="user-display-name">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-testid="button-logout">
                    <a href="/api/logout" className="flex items-center gap-2 cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild data-testid="button-login">
                <a href="/api/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Log in
                </a>
              </Button>
            )}
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
                   {isAuthenticated && (
                     <Link href="/dashboard">
                       <Button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-semibold" onClick={() => setIsOpen(false)}>Dashboard</Button>
                     </Link>
                   )}
                   
                   <div className="mt-6 pt-4 border-t">
                     {isAuthenticated && user ? (
                       <div className="space-y-3">
                         <div className="flex items-center gap-3 px-2">
                           <Avatar className="h-10 w-10">
                             <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} style={{ objectFit: 'cover' }} />
                             <AvatarFallback>
                               {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                             </AvatarFallback>
                           </Avatar>
                           <div>
                             <p className="font-medium text-sm">
                               {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                             </p>
                             {user.email && user.firstName && (
                               <p className="text-xs text-muted-foreground">{user.email}</p>
                             )}
                           </div>
                         </div>
                         <Button variant="outline" className="w-full" asChild onClick={() => setIsOpen(false)}>
                           <a href="/api/logout" className="flex items-center justify-center gap-2">
                             <LogOut className="h-4 w-4" />
                             Log out
                           </a>
                         </Button>
                       </div>
                     ) : (
                       <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                         <a href="/api/login" className="flex items-center justify-center gap-2">
                           <LogIn className="h-4 w-4" />
                           Log in
                         </a>
                       </Button>
                     )}
                   </div>
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
             <Link href="/terms" className="hover:underline">Terms</Link>
             <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
