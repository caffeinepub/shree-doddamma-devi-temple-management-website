import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Wallet,
  CheckSquare,
  Users as UsersIcon,
  Users,
  Calendar,
  Phone,
  Image,
  FileText,
} from 'lucide-react';

export default function AdminHomePage() {
  const sections = [
    {
      to: '/admin/balance',
      icon: Wallet,
      title: 'Balance Dashboard',
      description: 'View temple account balance',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      to: '/admin/approvals',
      icon: CheckSquare,
      title: 'Payment Approvals',
      description: 'Verify and approve payments',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      to: '/admin/donors',
      icon: UsersIcon,
      title: 'Donor List',
      description: 'View all donors',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      to: '/admin/committee',
      icon: Users,
      title: 'Committee Management',
      description: 'Manage committee members',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      to: '/admin/jatre',
      icon: Calendar,
      title: 'Jatre Management',
      description: 'Manage festivals and events',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600',
    },
    {
      to: '/admin/contacts',
      icon: Phone,
      title: 'Contacts Management',
      description: 'Manage contact numbers',
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
      iconColor: 'text-teal-600',
    },
    {
      to: '/admin/gallery',
      icon: Image,
      title: 'Gallery Management',
      description: 'Manage photos and videos',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage temple operations and content</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.to} to={section.to}>
              <Card className={`${section.color} border-2 hover:shadow-lg transition-all h-full`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`${section.iconColor}`}>
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="text-sm">{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
