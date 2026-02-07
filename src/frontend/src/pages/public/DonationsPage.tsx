import { useState } from 'react';
import { HandHeart, CheckCircle } from 'lucide-react';
import { TEMPLE_CONFIG } from '../../config/temple';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function DonationsPage() {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDonate = () => {
    const upiLink = `upi://pay?pa=${TEMPLE_CONFIG.upiId}&pn=ShreeDoddammaDeviTemple`;
    window.location.href = upiLink;
    setShowInstructions(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-temple-primary mb-2">ದಾನ / Donations</h1>
        <p className="text-temple-text">Support {TEMPLE_CONFIG.name}</p>
      </div>

      <Card className="mb-6 border-2 border-temple-accent">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-temple-light p-4 rounded-full">
              <HandHeart className="h-12 w-12 text-temple-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Make a Donation</CardTitle>
          <CardDescription>
            Your generous contributions help maintain the temple and support community activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button onClick={handleDonate} size="lg" className="text-lg px-8 py-6">
              Donate to Shree Doddamma Devi Temple
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              Supports PhonePe, Google Pay, and any UPI app
            </p>
          </div>

          {showInstructions && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                Please submit your payment details to generate receipt
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3 text-blue-900">How it works:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Click the donate button above to open your UPI app</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Complete the payment in your UPI app (PhonePe, Google Pay, etc.)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Submit your payment details using the Payment Confirmation form</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Admin will manually verify your payment</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">5.</span>
                <span>Receipt will be generated after admin approval</span>
              </li>
            </ol>
          </div>

          <div className="text-center">
            <a
              href="/payment-confirmation"
              className="text-temple-primary hover:underline font-medium"
            >
              Go to Payment Confirmation Form →
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-gray-900">Important Note</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          All donations are manually verified by the temple administration before receipts are issued.
          This ensures transparency and accuracy in our donation records. Please allow some time for
          verification after submitting your payment details.
        </p>
      </div>
    </div>
  );
}
