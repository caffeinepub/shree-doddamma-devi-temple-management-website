import { useGetDonationReport } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Heart, TrendingUp, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TotalCollectionPage() {
  const { data: report, isLoading } = useGetDonationReport();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          ಒಟ್ಟು ಸಂಗ್ರಹ / Total Collection
        </h1>
        <p className="text-temple-text">Community contributions to the temple</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-temple-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-900">Total Amount</CardTitle>
                  <CardDescription className="text-green-700">All approved donations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-900">
                {report ? formatCurrency(report.totalAmount) : '₹0'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Total Collections</CardTitle>
                  <CardDescription className="text-blue-700">Number of donations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-900">
                {report ? report.totalCollections.toString() : '0'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mt-8 border-2 border-temple-accent">
        <CardHeader>
          <CardTitle>Privacy Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">
            For privacy reasons, individual donor details are not displayed publicly. Only the aggregate
            total collection amount and number of donations are shown. Detailed donor information is
            available only to temple administrators.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <a href="/donations" className="text-temple-primary hover:underline font-medium">
          Make a Donation →
        </a>
      </div>
    </div>
  );
}
