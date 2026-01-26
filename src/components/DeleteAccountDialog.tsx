import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const isConfirmed = confirmText.toUpperCase() === 'DELETE';

  const handleClose = () => {
    setConfirmText('');
    onOpenChange(false);
  };

  const handleDeleteAccount = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('יש להתחבר מחדש');
        setIsDeleting(false);
        return;
      }

      // Call the delete-account edge function
      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Delete account error:', error);
        toast.error('שגיאה במחיקת החשבון');
        setIsDeleting(false);
        return;
      }

      // Clear local storage
      localStorage.clear();

      // Sign out
      await signOut();

      // Close dialog
      handleClose();

      // Show success toast
      toast.success('החשבון נמחק בהצלחה');

      // Navigate to welcome screen
      navigate('/');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('שגיאה במחיקת החשבון');
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm" dir="rtl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle className="text-destructive">מחיקת חשבון</DialogTitle>
          </div>
          <DialogDescription className="text-right leading-relaxed">
            פעולה זו תמחק לצמיתות את החשבון שלך ואת כל המידע המשויך אליו. 
            לא ניתן לבטל פעולה זו.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium mb-1">מה יימחק:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>כל המתכונים השמורים שלך</li>
              <li>היסטוריית הבישולים</li>
              <li>המועדפים</li>
              <li>הפרופיל והעדפות</li>
            </ul>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              הקלד <span className="font-bold text-destructive">DELETE</span> לאישור
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="text-center font-mono"
              dir="ltr"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1"
          >
            ביטול
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!isConfirmed || isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                מוחק...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                מחק לצמיתות
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
