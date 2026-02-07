import { useState } from 'react';
import {
  useGetPendingPayments,
  useApprovePayment,
  useRejectPayment,
  useEditPaymentConfirmation,
} from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, CheckCircle, XCircle, Edit } from 'lucide-react';
import { formatCurrency, formatDateTime, formatPaymentMode } from '../../utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { PaymentConfirmation, PaymentMode } from '../../backend';

export default function PaymentApprovalsPage() {
  const { data: payments, isLoading } = useGetPendingPayments();
  const approveMutation = useApprovePayment();
  const rejectMutation = useRejectPayment();
  const editMutation = useEditPaymentConfirmation();

  const [editingPayment, setEditingPayment] = useState<PaymentConfirmation | null>(null);
  const [editForm, setEditForm] = useState({
    donorName: '',
    mobileNumber: '',
    amountPaid: '',
    paymentMode: '' as PaymentMode | '',
    transactionId: '',
    date: '',
  });

  const handleEdit = (payment: PaymentConfirmation) => {
    setEditingPayment(payment);
    setEditForm({
      donorName: payment.donorName,
      mobileNumber: payment.mobileNumber,
      amountPaid: payment.amountPaid.toString(),
      paymentMode: payment.paymentMode,
      transactionId: payment.transactionId,
      date: new Date(Number(payment.date) / 1000000).toISOString().split('T')[0],
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPayment || !editForm.paymentMode) return;

    try {
      const dateTimestamp = new Date(editForm.date).getTime() * 1000000;
      await editMutation.mutateAsync({
        paymentId: editingPayment.id,
        donorName: editForm.donorName,
        mobileNumber: editForm.mobileNumber,
        amountPaid: BigInt(editForm.amountPaid),
        paymentMode: editForm.paymentMode,
        transactionId: editForm.transactionId,
        date: BigInt(dateTimestamp),
      });
      setEditingPayment(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleApprove = async (paymentId: bigint) => {
    if (!confirm('Are you sure you want to approve this payment? This will add the amount to the temple balance and generate a receipt.')) {
      return;
    }

    try {
      await approveMutation.mutateAsync(paymentId);
      alert('Payment approved successfully! Receipt has been generated.');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleReject = async (paymentId: bigint) => {
    if (!confirm('Are you sure you want to reject this payment?')) {
      return;
    }

    try {
      await rejectMutation.mutateAsync(paymentId);
      alert('Payment rejected successfully.');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Approvals</h1>
        <p className="text-gray-600">Review and approve pending payment confirmations</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id.toString()} className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{payment.donorName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted: {formatDateTime(payment.date)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
                    Pending Verification
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Mobile:</span>{' '}
                    <span className="text-gray-900">{payment.mobileNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Amount:</span>{' '}
                    <span className="text-gray-900 font-bold">
                      {formatCurrency(payment.amountPaid)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Payment Mode:</span>{' '}
                    <span className="text-gray-900">{formatPaymentMode(payment.paymentMode)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Transaction ID:</span>{' '}
                    <span className="text-gray-900">{payment.transactionId}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    onClick={() => handleEdit(payment)}
                    variant="outline"
                    size="sm"
                    disabled={editMutation.isPending}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleApprove(payment.id)}
                    variant="default"
                    size="sm"
                    disabled={approveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(payment.id)}
                    variant="destructive"
                    size="sm"
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pending payments to review</p>
          </CardContent>
        </Card>
      )}

      {editingPayment && (
        <Dialog open={!!editingPayment} onOpenChange={() => setEditingPayment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Payment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-donorName">Donor Name</Label>
                <Input
                  id="edit-donorName"
                  value={editForm.donorName}
                  onChange={(e) => setEditForm({ ...editForm, donorName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-mobileNumber">Mobile Number</Label>
                <Input
                  id="edit-mobileNumber"
                  value={editForm.mobileNumber}
                  onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-amountPaid">Amount</Label>
                <Input
                  id="edit-amountPaid"
                  type="number"
                  value={editForm.amountPaid}
                  onChange={(e) => setEditForm({ ...editForm, amountPaid: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-paymentMode">Payment Mode</Label>
                <Select
                  value={editForm.paymentMode}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, paymentMode: value as PaymentMode })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="edit-transactionId">Transaction ID</Label>
                <Input
                  id="edit-transactionId"
                  value={editForm.transactionId}
                  onChange={(e) => setEditForm({ ...editForm, transactionId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} disabled={editMutation.isPending} className="flex-1">
                  {editMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button onClick={() => setEditingPayment(null)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
