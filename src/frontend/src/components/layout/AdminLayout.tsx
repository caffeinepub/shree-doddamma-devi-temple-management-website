import { Link } from '@tanstack/react-router';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { TEMPLE_CONFIG } from '../../config/temple';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/balance', label: 'Balance' },
    { to: '/admin/approvals', label: 'Approvals' },
    { to: '/admin/donors', label: 'Donors' },
    { to: '/admin/committee', label: 'Committee' },
    { to: '/admin/jatre', label: 'Jatre' },
    { to: '/admin/contacts', label: 'Contacts' },
    { to: '/admin/gallery', label: 'Gallery' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/admin" className="flex items-center gap-3">
              <img
                src="/assets/generated/temple-crest.dim_512x512.png"
                alt="Temple Crest"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
                <p className="text-xs text-gray-600">{TEMPLE_CONFIG.name}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <nav className="hidden lg:flex gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  activeProps={{ className: 'bg-gray-100 text-gray-900' }}
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
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  activeProps={{ className: 'bg-gray-100 text-gray-900' }}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          <p>Admin Portal - {TEMPLE_CONFIG.name}</p>
        </div>
      </footer>
    </div>
  );
}
