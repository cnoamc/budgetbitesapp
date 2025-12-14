import React, { useState, useRef, useEffect } from 'react';
import { Settings, RefreshCw, User, MapPin, LogOut, Pencil, Camera, X, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chefIcon from '@/assets/chef-icon.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationSettings } from '@/components/NotificationSettings';
import { getBBProfile, saveBBProfile, BBProfile } from '@/lib/storage';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress } = useApp();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bbProfile, setBBProfile] = useState<BBProfile>(() => getBBProfile());
  const [isEditingName, setIsEditingName] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [editedName, setEditedName] = useState(bbProfile.displayName);

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];

  useEffect(() => {
    const stored = getBBProfile();
    setBBProfile(stored);
    setEditedName(stored.displayName);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('התנתקת בהצלחה');
      navigate('/auth');
    } catch (error) {
      toast.error('שגיאה בהתנתקות');
    }
  };

  const handleRestartOnboarding = () => {
    navigate('/onboarding');
  };

  const handleSaveName = () => {
    const trimmed = editedName.trim();
    if (trimmed.length < 2) {
      toast.error('השם חייב להכיל לפחות 2 תווים');
      return;
    }
    if (trimmed.length > 24) {
      toast.error('השם יכול להכיל עד 24 תווים');
      return;
    }
    const updated = { ...bbProfile, displayName: trimmed };
    setBBProfile(updated);
    saveBBProfile(updated);
    setIsEditingName(false);
    toast.success('השם עודכן בהצלחה');
  };

  const handleCancelEdit = () => {
    setEditedName(bbProfile.displayName);
    setIsEditingName(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File, maxSize: number = 512): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          const offsetX = (img.width - size) / 2;
          const offsetY = (img.height - size) / 2;
          
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, maxSize, maxSize);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('סוג קובץ לא נתמך. יש לבחור JPG, PNG או WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('הקובץ גדול מדי. גודל מקסימלי: 5MB');
      return;
    }

    try {
      const dataUrl = await compressImage(file);
      const updated = { ...bbProfile, photoDataUrl: dataUrl };
      setBBProfile(updated);
      saveBBProfile(updated);
      toast.success('התמונה עודכנה בהצלחה');
    } catch (error) {
      toast.error('שגיאה בעיבוד התמונה');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    const updated = { ...bbProfile, photoDataUrl: null };
    setBBProfile(updated);
    saveBBProfile(updated);
    toast.success('התמונה הוסרה');
  };


  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div 
              className="w-24 h-24 gradient-primary rounded-full mx-auto flex items-center justify-center shadow-glow cursor-pointer overflow-hidden group"
              onClick={handlePhotoClick}
            >
              {bbProfile.photoDataUrl ? (
                <img 
                  src={bbProfile.photoDataUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={chefIcon} alt="Profile" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            {bbProfile.photoDataUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto();
                }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
              >
                <X className="w-3 h-3 text-destructive-foreground" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">לחץ כדי להחליף תמונה</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center justify-center gap-2 mt-3">
            <h1 className="text-2xl font-bold">{bbProfile.displayName}</h1>
            <button
              onClick={() => setIsEditingName(true)}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-muted-foreground">
            {skillLabels[progress.skillLevel - 1]} • {progress.totalMealsCooked} ארוחות
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2" dir="ltr">
              {user.email}
            </p>
          )}
        </div>

        {/* Edit Name Dialog */}
        <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>עריכת שם תצוגה</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="הכנס שם תצוגה"
                maxLength={24}
                className="text-right"
                dir="rtl"
              />
              <p className="text-xs text-muted-foreground mt-2">
                2-24 תווים
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                ביטול
              </Button>
              <Button onClick={handleSaveName}>
                שמור
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 text-center">
            <p className="text-3xl font-bold text-savings mb-1">₪{progress.totalSavings}</p>
            <p className="text-sm text-muted-foreground">נחסך בסה״כ</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 text-center">
            <p className="text-3xl font-bold mb-1">{progress.totalMealsCooked}</p>
            <p className="text-sm text-muted-foreground">ארוחות שבושלו</p>
          </div>
        </div>


        {/* Profile Info */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            הגדרות
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>מיקום</span>
              </div>
              <span className="text-muted-foreground">ישראל</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded overflow-hidden">
                  <img src={chefIcon} alt="Skill" className="w-full h-full object-cover" />
                </div>
                <span>רמת מיומנות התחלתית</span>
              </div>
              <span className="text-muted-foreground">{profile.cookingSkill}/5</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">🍔</span>
                <span>הזמנות שבועיות</span>
              </div>
              <span className="text-muted-foreground">{profile.weeklyOrders} פעמים</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsNotificationSettingsOpen(true)}
          >
            <Bell className="w-5 h-5" />
            הגדרות התראות
            {unreadCount > 0 && (
              <span className="mr-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleRestartOnboarding}
          >
            <RefreshCw className="w-5 h-5" />
            מילוי שאלון מחדש
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            התנתק
          </Button>
        </div>

        {/* Notification Settings Dialog */}
        <Dialog open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>הגדרות התראות</DialogTitle>
              <DialogDescription>בחר אילו התראות לקבל ומתי</DialogDescription>
            </DialogHeader>
            <NotificationSettings />
          </DialogContent>
        </Dialog>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>BudgetBites v1.0</p>
          <p>נבנה באהבה 🧡</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
