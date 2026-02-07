import { Link } from '@tanstack/react-router';
import { Heart, HandHeart, Users, Calendar, Image, Phone, MapPin, FileText } from 'lucide-react';
import { TEMPLE_CONFIG } from '../../config/temple';

export default function HomePage() {
  const sections = [
    {
      to: '/donations',
      icon: HandHeart,
      title: 'ದಾನ',
      subtitle: 'Donate',
      description: 'Support the temple',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      to: '/payment-confirmation',
      icon: FileText,
      title: 'ಪಾವತಿ ದೃಢೀಕರಣ',
      subtitle: 'Payment Confirmation',
      description: 'Submit payment details',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      to: '/total-collection',
      icon: Heart,
      title: 'ಒಟ್ಟು ಸಂಗ್ರಹ',
      subtitle: 'Total Collection',
      description: 'View donations',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      to: '/committee',
      icon: Users,
      title: 'ಸಮಿತಿ',
      subtitle: 'Committee',
      description: 'Temple committee',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      to: '/jatre',
      icon: Calendar,
      title: 'ಜಾತ್ರೆ',
      subtitle: 'Jatre & Festivals',
      description: 'Upcoming events',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600',
    },
    {
      to: '/gallery',
      icon: Image,
      title: 'ಗ್ಯಾಲರಿ',
      subtitle: 'Gallery',
      description: 'Photos & videos',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600',
    },
    {
      to: '/contacts',
      icon: Phone,
      title: 'ಸಂಪರ್ಕ ಸಂಖ್ಯೆ',
      subtitle: 'Contact Numbers',
      description: 'Get in touch',
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
      iconColor: 'text-teal-600',
    },
    {
      to: '/location',
      icon: MapPin,
      title: 'ಸ್ಥಳ',
      subtitle: 'Location',
      description: 'Find us',
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <img
          src="/assets/generated/temple-crest.dim_512x512.png"
          alt="Temple Crest"
          className="h-24 w-24 mx-auto mb-4 object-contain"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          {TEMPLE_CONFIG.nameKannada}
        </h1>
        <h2 className="text-xl md:text-2xl text-temple-secondary mb-2">{TEMPLE_CONFIG.name}</h2>
        <p className="text-temple-text">{TEMPLE_CONFIG.location}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.to}
              to={section.to}
              className={`${section.color} border-2 rounded-xl p-6 transition-all hover:shadow-lg hover:scale-105`}
            >
              <div className="text-center">
                <div className={`${section.iconColor} mb-3 flex justify-center`}>
                  <Icon size={40} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-lg mb-1">{section.title}</h3>
                <p className="text-sm font-medium text-gray-700 mb-1">{section.subtitle}</p>
                <p className="text-xs text-gray-600">{section.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 border-2 border-temple-accent">
        <h3 className="text-2xl font-bold text-temple-primary text-center mb-4">
          ಸ್ವಾಗತ / Welcome
        </h3>
        <p className="text-temple-text text-center leading-relaxed">
          Welcome to the digital home of {TEMPLE_CONFIG.name}. We are a community temple serving the
          people of {TEMPLE_CONFIG.location}. This platform allows you to make donations, view temple
          activities, and stay connected with our community.
        </p>
      </div>
    </div>
  );
}
