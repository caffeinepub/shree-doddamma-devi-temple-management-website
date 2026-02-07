import type { Receipt } from '../backend';
import { formatCurrency, formatDateTime, formatPaymentMode } from './formatters';

export async function generateReceiptPDF(receipt: Receipt): Promise<void> {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the receipt');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${receipt.receiptNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
          }
          .receipt {
            border: 2px solid #333;
            padding: 30px;
            position: relative;
          }
          ${receipt.isCancelled ? `
          .receipt::before {
            content: 'CANCELLED';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(255, 0, 0, 0.2);
            font-weight: bold;
            z-index: 1;
          }
          ` : ''}
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .temple-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .receipt-number {
            font-size: 18px;
            color: #666;
          }
          .details {
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .label {
            font-weight: bold;
          }
          .amount {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="temple-name">${receipt.templeName}</div>
            <div>${receipt.location}</div>
            <div class="receipt-number">Receipt #${receipt.receiptNumber}</div>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="label">Date:</span>
              <span>${formatDateTime(receipt.date)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Donor Name:</span>
              <span>${receipt.donorName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Payment Mode:</span>
              <span>${formatPaymentMode(receipt.paymentMode)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Transaction ID:</span>
              <span>${receipt.transactionId}</span>
            </div>
          </div>
          
          <div class="amount">
            Amount: ${formatCurrency(receipt.amount)}
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="label">Received By:</span>
              <span>${receipt.receiver}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your generous donation</p>
            <p>${receipt.templeName} - ${receipt.location}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function printReceipt(receipt: Receipt): void {
  generateReceiptPDF(receipt);
}
