import { useState } from 'react';
import { useSubmitPaymentConfirmation } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { getCurrentTimestamp } from '../../utils/formatters';
import { PaymentMode } from '../../backend';

export default function PaymentConfirmationPage() {
  const [formData, setFormData] = useState({
    donorName: '',
    mobileNumber: '',
    amountPaid: '',
    paymentMode: '' as PaymentMode | '',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitPaymentConfirmation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentMode) {
      alert('Please select a payment mode');
      return;
    }

    const amount = parseFloat(formData.amountPaid);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const dateTimestamp = new Date(formData.date).getTime() * 1000000;

    try {
      await submitMutation.mutateAsync({
        donorName: formData.donorName,
        mobileNumber: formData.mobileNumber,
        amountPaid: BigInt(Math.round(amount)),
        paymentMode: formData.paymentMode,
        transactionId: formData.transactionId,
        date: BigInt(dateTimestamp),
      });

      setSubmitted(true);
      setFormData({
        donorName: '',
        mobileNumber: '',
        amountPaid: '',
        paymentMode: '',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to submit payment confirmation'}`);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Submitted for Verification</h2>
              <p className="text-green-800 mb-6">
                Your payment details have been submitted successfully. The temple administration will
                verify your payment and generate a receipt after approval.
              </p>
              <div className="space-y-3">
                <Button onClick={() => setSubmitted(false)} variant="default">
                  Submit Another Payment
                </Button>
                <div>
                  <a href="/" className="text-temple-primary hover:underline text-sm">
                    Return to Home
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">
          ಪಾವತಿ ದೃಢೀಕರಣ / Payment Confirmation
        </h1>
        <p className="text-temple-text">Submit your payment details for verification</p>
      </div>

      <Card className="border-2 border-temple-accent">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Please fill in all the details accurately. Your payment will be verified by the admin before
            a receipt is generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="donorName">Donor Name *</Label>
              <Input
                id="donorName"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                required
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
              />
            </div>

            <div>
              <Label htmlFor="amountPaid">Amount Paid (₹) *</Label>
              <Input
                id="amountPaid"
                type="number"
                min="1"
                step="1"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                required
                placeholder="Enter amount"
              />
            </div>

            <div>
              <Label htmlFor="paymentMode">Payment Mode *</Label>
              <Select
                value={formData.paymentMode}
                onValueChange={(value) => setFormData({ ...formData, paymentMode: value as PaymentMode })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phonePe">PhonePe</SelectItem>
                  <SelectItem value="gPay">Google Pay</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                required
                placeholder="Enter transaction ID or reference number"
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800 text-sm">
                Your submission will be marked as "Pending verification". A receipt will be generated only
                after manual admin approval.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Payment Details'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
