import React, { useState, useRef, useEffect } from 'react';
import { Settings, MapPin, LogOut, Pencil, Camera, X, Crown, FileText, HelpCircle, Shield, User, Sparkles, UserPlus, Smartphone, ChevronLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import appIcon from '@/assets/app-icon.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SyncIndicator } from '@/components/SyncIndicator';
import { TrialReminderBanner } from '@/components/PremiumPaywall';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress, displayName, photoUrl, updateDisplayName, updatePhotoUrl, syncing } = useApp();
  const { user, signOut } = useAuth();
  const { isGuest, isPremium, openPremiumPopup, exitGuestMode } = useGuest();
  const { daysLeftInTrial, isTrialActive, subscription, toggleCancelReminder } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(displayName);

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];

  useEffect(() => {
    setEditedName(displayName);
  }, [displayName]);

  const handleSignOut = async () => {
    try {
      if (isGuest) {
        exitGuestMode();
        toast.success('יצאת ממצב אורח');
        navigate('/');
      } else {
        await signOut();
        toast.success('התנתקת בהצלחה');
        navigate('/');
      }
    } catch (error) {
      toast.error('שגיאה בהתנתקות');
    }
  };

  const handleSaveName = async () => {
    const trimmed = editedName.trim();
    if (trimmed.length < 2) {
      toast.error('השם חייב להכיל לפחות 2 תווים');
      return;
    }
    if (trimmed.length > 24) {
      toast.error('השם יכול להכיל עד 24 תווים');
      return;
    }
    
    // Check if this is the first time setting a nickname (for guests)
    const isFirstNickname = isGuest && (displayName === 'אורח' || !localStorage.getItem('bb_nickname_set'));
    
    await updateDisplayName(trimmed);
    setIsEditingName(false);
    
    if (isFirstNickname) {
      localStorage.setItem('bb_nickname_set', 'true');
      toast.success(`נעים להכיר, ${trimmed}! 👋🍳`, {
        description: 'עכשיו אתה חלק מהמשפחה',
        duration: 4000,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedName(displayName);
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
      await updatePhotoUrl(dataUrl);
    } catch (error) {
      toast.error('שגיאה בעיבוד התמונה');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    await updatePhotoUrl(null);
  };

  return (
    <div className="screen-container bg-background" dir="rtl">
      <div 
        className="scroll-container scrollbar-hide p-4 pt-safe"
        style={{ paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {/* Compact Guest Login CTA - Header Card */}
        {isGuest && (
          <div className="bg-gradient-to-l from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">שמור מתכונים והתקדמות</p>
              </div>
              <Button 
                onClick={() => navigate('/signin')} 
                size="sm"
                className="shrink-0"
              >
                התחבר
              </Button>
            </div>
          </div>
        )}

        {/* Trial Reminder Banner */}
        {isTrialActive && !isGuest && (
          <TrialReminderBanner
            daysLeft={daysLeftInTrial}
            reminderEnabled={subscription?.cancel_reminder_enabled ?? true}
            onToggleReminder={toggleCancelReminder}
          />
        )}

        {/* Profile Header - Compact */}
        <div className="text-center mb-3">
          <div className="relative inline-block">
            <div 
              className="w-16 h-16 gradient-primary rounded-full mx-auto flex items-center justify-center shadow-glow cursor-pointer overflow-hidden group"
              onClick={handlePhotoClick}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary-foreground" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            {photoUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-3 h-3 text-destructive-foreground" />
              </button>
            )}
          </div>
          
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

          <div className="flex items-center justify-center gap-1 mt-2">
            <h1 className="text-xl font-bold">{displayName}</h1>
            <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-muted rounded-full">
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {skillLabels[progress.skillLevel - 1]} • {progress.totalMealsCooked} ארוחות
          </p>
          {user && !isGuest && <p className="text-xs text-muted-foreground" dir="ltr">{user.email}</p>}
          
          {/* Premium Badge */}
          {isPremium && (
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Crown className="w-3 h-3" />
              Premium • חינם עד סוף פברואר
            </div>
          )}
          
          {/* Subscription Badge for logged in users */}
          {isTrialActive && !isGuest && (
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Crown className="w-3 h-3" />
              Premium • תקופת ניסיון
            </div>
          )}
          
          {!isGuest && (
            <div className="flex justify-center mt-2">
              <SyncIndicator syncing={syncing} />
            </div>
          )}
        </div>

        {/* Settings Card - Compact */}
        <div className="bg-card rounded-xl p-3 shadow-card border border-border/50 mb-3">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            הגדרות
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">מיקום</span>
              </div>
              <span className="text-sm text-muted-foreground">ישראל</span>
            </div>
            
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded overflow-hidden">
                  <img src={appIcon} alt="Skill" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm">רמת מיומנות</span>
              </div>
              <span className="text-sm text-muted-foreground">{profile.cookingSkill}/5</span>
            </div>
          </div>
        </div>

        {/* Add to Home Screen Link */}
        <button
          onClick={() => navigate('/install')}
          className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 mb-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">הוסף למסך הבית</p>
              <p className="text-xs text-muted-foreground">גישה מהירה לאפליקציה</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Actions - Compact */}
        <div className="space-y-2">
          {/* Premium Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start h-10" 
            onClick={openPremiumPopup}
          >
            <Sparkles className="w-4 h-4" />
            {isPremium ? 'Premium פעיל' : 'Premium בקרוב'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={() => setIsSignOutDialogOpen(true)}
          >
            <LogOut className="w-4 h-4" />
            {isGuest ? 'יציאה ממצב אורח' : 'התנתק'}
          </Button>
        </div>

        {/* About Link */}
        <button
          onClick={() => navigate('/about')}
          className="w-full bg-card rounded-xl p-4 shadow-card border border-border/50 mb-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">אודות שפי</p>
              <p className="text-xs text-muted-foreground">הסיפור שלנו והצוות</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Legal Links */}
        <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
          <button onClick={() => navigate('/privacy')} className="hover:underline flex items-center gap-1">
            <Shield className="w-3 h-3" />
            פרטיות
          </button>
          <button onClick={() => navigate('/terms')} className="hover:underline flex items-center gap-1">
            <FileText className="w-3 h-3" />
            תנאי שימוש
          </button>
          <button onClick={() => navigate('/support')} className="hover:underline flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            תמיכה
          </button>
        </div>

        {/* App Info */}
        <div className="mt-auto pt-2 text-center text-xs text-muted-foreground">
          <p>שפי – Chefi • נבנה באהבה 🧡</p>
          <p className="text-[10px] opacity-70 mt-0.5">© BudgetBites</p>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>עריכת שם תצוגה</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="הכנס שם תצוגה" maxLength={24} className="text-right" dir="rtl" />
            <p className="text-xs text-muted-foreground mt-2">2-24 תווים</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>ביטול</Button>
            <Button onClick={handleSaveName}>שמור</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isSignOutDialogOpen} onOpenChange={setIsSignOutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isGuest ? 'יציאה ממצב אורח' : 'התנתקות מהחשבון'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isGuest 
                ? 'האם אתה בטוח? ההתקדמות שלך לא תישמר.' 
                : 'האם אתה בטוח שברצונך להתנתק?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isGuest ? 'יציאה' : 'התנתק'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;