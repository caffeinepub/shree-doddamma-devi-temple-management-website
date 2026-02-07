export function formatCurrency(amount: bigint): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPaymentMode(mode: string): string {
  const modeMap: Record<string, string> = {
    phonePe: 'PhonePe',
    gPay: 'Google Pay',
    upi: 'UPI',
    cash: 'Cash',
    cheque: 'Cheque',
  };
  return modeMap[mode] || mode;
}

export function formatCommitteeRole(role: string): string {
  const roleMap: Record<string, string> = {
    president: 'President',
    secretary: 'Secretary',
    member: 'Member',
  };
  return roleMap[role] || role;
}

export function getCurrentTimestamp(): bigint {
  return BigInt(Date.now() * 1000000);
}
