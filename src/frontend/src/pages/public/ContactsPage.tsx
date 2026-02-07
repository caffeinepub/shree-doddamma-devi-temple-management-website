import { useGetContacts } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Phone, Loader2 } from 'lucide-react';

export default function ContactsPage() {
  const { data: contacts, isLoading } = useGetContacts();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          ಸಂಪರ್ಕ ಸಂಖ್ಯೆ / Contact Numbers
        </h1>
        <p className="text-temple-text">Get in touch with the temple</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-temple-primary" />
        </div>
      ) : contacts && contacts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id.toString()} className="border-2 border-temple-accent hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-temple-light p-3 rounded-full">
                    <Phone className="h-6 w-6 text-temple-primary" />
                  </div>
                  <CardTitle className="text-lg">{contact.contactType}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={`tel:${contact.contactNumber}`}
                  className="text-2xl font-bold text-temple-primary hover:underline"
                >
                  {contact.contactNumber}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No contact numbers added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
