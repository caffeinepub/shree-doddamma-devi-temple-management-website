import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { TEMPLE_CONFIG } from '../../config/temple';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'ಮುಖಪುಟ / Home' },
    { to: '/donations', label: 'ದಾನ / Donate' },
    { to: '/payment-confirmation', label: 'ಪಾವತಿ / Payment' },
    { to: '/total-collection', label: 'ಸಂಗ್ರಹ / Collection' },
    { to: '/committee', label: 'ಸಮಿತಿ / Committee' },
    { to: '/jatre', label: 'ಜಾತ್ರೆ / Jatre' },
    { to: '/gallery', label: 'ಗ್ಯಾಲರಿ / Gallery' },
    { to: '/contacts', label: 'ಸಂಪರ್ಕ / Contact' },
    { to: '/location', label: 'ಸ್ಥಳ / Location' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-temple-pattern">
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b-2 border-temple-accent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/temple-crest.dim_512x512.png"
                alt="Temple Crest"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-temple-primary">
                  {TEMPLE_CONFIG.nameKannada}
                </h1>
                <p className="text-sm text-temple-secondary">{TEMPLE_CONFIG.name}</p>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-temple-primary hover:bg-temple-light rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className="hidden lg:flex gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-temple-text hover:bg-temple-light hover:text-temple-primary rounded-lg transition-colors"
                  activeProps={{ className: 'bg-temple-light text-temple-primary' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-temple-text hover:bg-temple-light hover:text-temple-primary rounded-lg transition-colors"
                  activeProps={{ className: 'bg-temple-light text-temple-primary' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-temple-dark text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-2">{TEMPLE_CONFIG.name}</h3>
              <p className="text-sm opacity-90">{TEMPLE_CONFIG.location}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Quick Links</h3>
              <div className="space-y-1 text-sm">
                <Link to="/donations" className="block hover:text-temple-accent transition-colors">
                  Donate
                </Link>
                <Link to="/committee" className="block hover:text-temple-accent transition-colors">
                  Committee
                </Link>
                <Link to="/contacts" className="block hover:text-temple-accent transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Admin</h3>
              <Link
                to="/admin/login"
                className="text-sm hover:text-temple-accent transition-colors inline-block"
              >
                Admin Login
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm">
            <p>
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-temple-accent transition-colors"
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
