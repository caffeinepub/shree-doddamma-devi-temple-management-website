export async function shareToWhatsApp(text: string, url?: string): Promise<void> {
  const message = url ? `${text}\n${url}` : text;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

export async function shareReceipt(receiptNumber: bigint, receiptUrl: string): Promise<void> {
  const text = `Receipt #${receiptNumber} from Shree Doddamma Devi Temple`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: text,
        text: text,
        url: receiptUrl,
      });
      return;
    } catch (error) {
      console.log('Share cancelled or failed, falling back to WhatsApp');
    }
  }

  await shareToWhatsApp(text, receiptUrl);
}
