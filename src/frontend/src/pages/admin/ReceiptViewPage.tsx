import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetReceipt, useCancelReceipt, useRegenerateReceipt } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, Download, Printer, Share2, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime, formatPaymentMode } from '../../utils/formatters';
import { generateReceiptPDF, printReceipt } from '../../utils/receiptExport';
import { shareReceipt } from '../../utils/share';
import { TEMPLE_CONFIG } from '../../config/temple';

export default function ReceiptViewPage() {
  const { receiptNumber } = useParams({ from: '/admin/receipts/$receiptNumber' });
  const navigate = useNavigate();
  const receiptNum = receiptNumber ? BigInt(receiptNumber) : null;
  
  const { data: receipt, isLoading } = useGetReceipt(receiptNum);
  const cancelMutation = useCancelReceipt();
  const regenerateMutation = useRegenerateReceipt();

  const handleDownload = async () => {
    if (!receipt) return;
    await generateReceiptPDF(receipt);
  };

  const handlePrint = () => {
    if (!receipt) return;
    printReceipt(receipt);
  };

  const handleShare = async () => {
    if (!receipt) return;
    const receiptUrl = window.location.href;
    await shareReceipt(receipt.receiptNumber, receiptUrl);
  };

  const handleCancel = async () => {
    if (!receipt || !receiptNum) return;
    if (!confirm('Are you sure you want to cancel this receipt? Note: Cancelling a receipt does NOT adjust the temple balance.')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(receiptNum);
      alert('Receipt cancelled successfully. The temple balance remains unchanged.');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRegenerate = async () => {
    if (!receipt || !receiptNum) return;
    try {
      await regenerateMutation.mutateAsync(receiptNum);
      alert('Receipt regenerated successfully.');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Receipt not found</p>
        <Button onClick={() => navigate({ to: '/admin' })} className="mt-4">
          Back to Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receipt #{receipt.receiptNumber.toString()}</h1>
          <p className="text-gray-600">View and manage receipt</p>
        </div>
        <Button onClick={() => navigate({ to: '/admin' })} variant="outline">
          Back to Admin
        </Button>
      </div>

      {receipt.isCancelled && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            This receipt has been cancelled and should not be used as a valid donation receipt.
          </AlertDescription>
        </Alert>
      )}

      <Card className={`border-2 mb-6 ${receipt.isCancelled ? 'border-red-200 bg-red-50/30' : 'border-green-200'}`}>
        <CardHeader className="text-center border-b-2 border-gray-200">
          <div className="mb-4">
            <img
              src="/assets/generated/temple-crest.dim_512x512.png"
              alt="Temple Crest"
              className="h-16 w-16 mx-auto mb-2"
            />
          </div>
          <CardTitle className="text-2xl">{receipt.templeName}</CardTitle>
          <p className="text-gray-600">{receipt.location}</p>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            Receipt #{receipt.receiptNumber.toString()}
          </p>
          {receipt.isCancelled && (
            <div className="mt-4">
              <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold border-2 border-red-300">
                CANCELLED
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Date</p>
              <p className="text-lg text-gray-900">{formatDateTime(receipt.date)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Donor Name</p>
              <p className="text-lg text-gray-900">{receipt.donorName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Payment Mode</p>
              <p className="text-lg text-gray-900">{formatPaymentMode(receipt.paymentMode)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Transaction ID</p>
              <p className="text-lg text-gray-900 font-mono">{receipt.transactionId}</p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
            <p className="text-sm font-semibold text-green-700 mb-2">Amount</p>
            <p className="text-4xl font-bold text-green-900">{formatCurrency(receipt.amount)}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Received By</p>
            <p className="text-lg text-gray-900">{receipt.receiver}</p>
          </div>

          <div className="pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-600">
            <p>Thank you for your generous donation</p>
            <p className="mt-1">{receipt.templeName} - {receipt.location}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Button onClick={handleDownload} variant="default" disabled={receipt.isCancelled}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="outline" disabled={receipt.isCancelled}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button onClick={handleShare} variant="outline" disabled={receipt.isCancelled}>
          <Share2 className="mr-2 h-4 w-4" />
          Share to WhatsApp
        </Button>
        <Button
          onClick={handleRegenerate}
          variant="outline"
          disabled={regenerateMutation.isPending || receipt.isCancelled}
        >
          {regenerateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Regenerate
        </Button>
      </div>

      {!receipt.isCancelled && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-yellow-100 border-yellow-300">
              <AlertDescription className="text-yellow-900 text-sm">
                <strong>Important:</strong> Cancelling a receipt does NOT adjust the temple balance. The
                donation amount will remain in the temple account. Only cancel receipts that were issued
                in error.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleCancel}
              variant="destructive"
              disabled={cancelMutation.isPending}
              className="w-full"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Receipt
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
