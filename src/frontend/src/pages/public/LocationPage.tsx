import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { TEMPLE_CONFIG } from '../../config/temple';

export default function LocationPage() {
  const handleNavigate = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${TEMPLE_CONFIG.coordinates.lat},${TEMPLE_CONFIG.coordinates.lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">ಸ್ಥಳ / Location</h1>
        <p className="text-temple-text">Find us at {TEMPLE_CONFIG.location}</p>
      </div>

      <Card className="border-2 border-temple-accent mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-temple-light p-3 rounded-full">
              <MapPin className="h-6 w-6 text-temple-primary" />
            </div>
            <CardTitle>{TEMPLE_CONFIG.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{TEMPLE_CONFIG.location}</p>
          <Button onClick={handleNavigate} className="w-full" size="lg">
            <Navigation className="mr-2 h-5 w-5" />
            Navigate to Temple
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-lg overflow-hidden border-2 border-temple-accent shadow-lg">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8!2d${TEMPLE_CONFIG.coordinates.lng}!3d${TEMPLE_CONFIG.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzUwLjgiTiA3N8KwMzYnMzYuNCJF!5e0!3m2!1sen!2sin!4v1234567890`}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Temple Location"
        />
      </div>
    </div>
  );
}
