import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonProps {
  title: string;
  text: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  title,
  text,
  className,
  variant = 'outline',
  size = 'default',
  children,
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
        });
      } catch (err) {
        // User cancelled or error - silent fail
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast.success('הועתק ללוח! 📋');
      } catch {
        toast.error('לא הצלחנו להעתיק');
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
    >
      {children || (
        <>
          <Share2 className="w-4 h-4 ml-2" />
          שתף
        </>
      )}
    </Button>
  );
};
