import { useGetTempleAccountBalance } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Wallet, Clock, Loader2, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/ui/button';

export default function BalanceDashboardPage() {
  const { data: account, isLoading, refetch, isRefetching } = useGetTempleAccountBalance();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Balance Dashboard</h1>
          <p className="text-gray-600">Temple account balance overview</p>
        </div>
        <Button onClick={() => refetch()} disabled={isRefetching} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : account ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-900">Current Balance</CardTitle>
                  <CardDescription className="text-green-700">Total temple funds</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-900">{formatCurrency(account.balance)}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Last Updated</CardTitle>
                  <CardDescription className="text-blue-700">Most recent change</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-blue-900">
                {formatDateTime(account.lastUpdated)}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card className="mt-8 border-2 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">Important Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-800 leading-relaxed">
            The balance is automatically updated when you approve payments. Each approved payment adds
            the donation amount to the temple balance. The balance does not change when receipts are
            cancelled.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
