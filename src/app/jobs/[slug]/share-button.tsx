'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.href, // Share the current page URL
        });
      } catch (error) {
        // Handle user cancellation of the share sheet
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Error sharing:', error);
        toast({
          variant: 'destructive',
          title: 'فشلت المشاركة',
          description: 'حدث خطأ أثناء محاولة مشاركة الإعلان.',
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      // Copy the URL to the clipboard instead
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: 'تم نسخ الرابط!',
          description: 'تم نسخ رابط الإعلان إلى الحافظة لمشاركته.',
        });
      });
    }
  };

  // Only render the button in a browser environment where sharing or clipboard is possible
  if (typeof navigator === 'undefined' || (!navigator.share && !navigator.clipboard)) {
      return null;
  }

  return (
    <Button onClick={handleShare} variant="outline" className="w-fit">
      <Share2 className="ml-2 h-4 w-4" />
      مشاركة
    </Button>
  );
}
