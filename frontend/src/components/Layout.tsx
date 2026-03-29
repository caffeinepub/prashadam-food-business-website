import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, Phone, Mail, Shield, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsAdmin } from '@/hooks/useQueries';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-light">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/assets/generated/prashadam-logo-enhanced-transparent.dim_400x400.png"
                alt="Prashadam Food"
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold text-primary">Prashadam Food</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  activeProps={{ className: 'text-primary' }}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                    activeProps={{ className: 'text-primary' }}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                  <Link
                    to="/deployment"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                    activeProps={{ className: 'text-primary' }}
                  >
                    <Server className="w-4 h-4" />
                    Deployment
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => handleNavClick(link.path)}
                      className="text-left text-lg font-medium transition-colors hover:text-primary py-2"
                    >
                      {link.name}
                    </button>
                  ))}
                  {isAuthenticated && isAdmin && (
                    <>
                      <button
                        onClick={() => handleNavClick('/admin')}
                        className="text-left text-lg font-medium transition-colors hover:text-primary py-2 flex items-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Admin
                      </button>
                      <button
                        onClick={() => handleNavClick('/deployment')}
                        className="text-left text-lg font-medium transition-colors hover:text-primary py-2 flex items-center gap-2"
                      >
                        <Server className="w-5 h-5" />
                        Deployment
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-kraft-dark text-kraft-dark-foreground border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/assets/generated/prashadam-logo-enhanced-transparent.dim_400x400.png"
                  alt="Prashadam Food"
                  className="h-14 w-14 object-contain"
                />
                <span className="text-xl font-bold">Prashadam Food</span>
              </div>
              <p className="text-sm text-kraft-dark-foreground/80">
                Pure Vegetarian Jain & Vaishnav Cuisine
                <br />
                No Onion, No Garlic
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-kraft-dark-foreground/80 hover:text-kraft-dark-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <a
                    href="tel:8802452190"
                    className="text-kraft-dark-foreground/80 hover:text-kraft-dark-foreground transition-colors"
                  >
                    8802452190
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <a
                    href="mailto:support@prashadamfood.com"
                    className="text-kraft-dark-foreground/80 hover:text-kraft-dark-foreground transition-colors"
                  >
                    support@prashadamfood.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-kraft-dark-foreground/20 text-center text-sm text-kraft-dark-foreground/80">
            <p>
              © 2026 Prashadam Food. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
