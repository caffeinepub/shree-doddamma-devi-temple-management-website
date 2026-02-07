import { useGetJatres } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function JatreFestivalsPage() {
  const { data: jatres, isLoading } = useGetJatres();

  const sortedJatres = jatres
    ? [...jatres].sort((a, b) => Number(b.date - a.date))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          ಜಾತ್ರೆ / Jatre & Festivals
        </h1>
        <p className="text-temple-text">Temple festivals and special events</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-temple-primary" />
        </div>
      ) : sortedJatres.length > 0 ? (
        <div className="space-y-6">
          {sortedJatres.map((jatre) => (
            <Card key={jatre.id.toString()} className="border-2 border-temple-accent hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-temple-light p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-temple-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{jatre.name}</CardTitle>
                    <CardDescription className="text-base">
                      {formatDate(jatre.date)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{jatre.description}</p>
                </div>
                {jatre.activities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                    <ul className="space-y-1">
                      {jatre.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-temple-primary mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No festivals or events scheduled yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
