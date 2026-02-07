import { useGetDonorList } from '../../hooks/useQueries';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Loader2, Users } from 'lucide-react';
import { formatCurrency, formatDateTime, formatPaymentMode } from '../../utils/formatters';

export default function DonorListPage() {
  const { data: donors, isLoading } = useGetDonorList();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Donor List</h1>
        <p className="text-gray-600">Complete list of all approved donations</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : donors && donors.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{donor.donorName}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(donor.amount)}</TableCell>
                      <TableCell>{formatDateTime(donor.date)}</TableCell>
                      <TableCell>{formatPaymentMode(donor.paymentMode)}</TableCell>
                      <TableCell className="font-mono text-sm">{donor.transactionId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No approved donations yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
