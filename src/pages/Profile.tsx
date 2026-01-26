import React, { useState, useRef, useEffect } from 'react';
import { Settings, MapPin, Pencil, Camera, X, User, Smartphone, ChevronLeft, Info, Heart, Leaf, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import appIcon from '@/assets/app-icon.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const COOKING_LEVELS = [
  { value: 1, label: 'מתחיל', emoji: '🥚' },
  { value: 2, label: 'בסיסי', emoji: '🍳' },
  { value: 3, label: 'מתקדם', emoji: '👨‍🍳' },
  { value: 4, label: 'מומחה', emoji: '⭐' },
  { value: 5, label: 'שף!', emoji: '👑' },
];

const DIETARY_OPTIONS = [
  { value: 'all', label: 'הכל', emoji: '🍽️' },
  { value: 'vegetarian', label: 'צמחוני', emoji: '🥗' },
  { value: 'vegan', label: 'טבעוני', emoji: '🌱' },
  { value: 'kosher', label: 'כשר', emoji: '✡️' },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress, displayName, photoUrl, updateDisplayName, updatePhotoUrl } = useApp();
  const { profile: localProfile, updateProfile: updateLocalProfile } = useLocalProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(displayName);
  const [editedCookingLevel, setEditedCookingLevel] = useState(localProfile?.cookingLevel || 1);
  const [editedDietary, setEditedDietary] = useState(localProfile?.dietaryPreference || 'all');

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];

  useEffect(() => {
    setEditedName(displayName);
    setEditedCookingLevel(localProfile?.cookingLevel || 1);
    setEditedDietary(localProfile?.dietaryPreference || 'all');
  }, [displayName, localProfile]);

  const handleSaveProfile = async () => {
    const trimmed = editedName.trim();
    if (trimmed.length < 2) {
      toast.error('השם חייב להכיל לפחות 2 תווים');
      return;
    }
    if (trimmed.length > 24) {
      toast.error('השם יכול להכיל עד 24 תווים');
      return;
    }
    
    await updateDisplayName(trimmed);
    updateLocalProfile({
      name: trimmed,
      cookingLevel: editedCookingLevel,
      dietaryPreference: editedDietary,
    });
    
    setIsEditingProfile(false);
    toast.success('הפרופיל נשמר ✓');
  };

  const handleCancelEdit = () => {
    setEditedName(displayName);
    setEditedCookingLevel(localProfile?.cookingLevel || 1);
    setEditedDietary(localProfile?.dietaryPreference || 'all');
    setIsEditingProfile(false);
  };

  const handleResetApp = () => {
    // Clear all local storage data
    localStorage.removeItem('chefi_profile');
    localStorage.removeItem('chefi_progress');
    localStorage.removeItem('chefi_cooked_meals');
    localStorage.removeItem('chefi_favorites');
    localStorage.removeItem('chefi_custom_recipes');
    localStorage.removeItem('chefi_photo');
    localStorage.removeItem('chefi_display_name');
    
    toast.success('האפליקציה אופסה בהצלחה');
    
    // Navigate to welcome screen and reload
    navigate('/', { replace: true });
    window.location.reload();
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
      toast.success('התמונה נשמרה ✓');
    } catch (error) {
      toast.error('שגיאה בעיבוד התמונה');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    await updatePhotoUrl(null);
    toast.success('התמונה הוסרה ✓');
  };

  const currentDietary = DIETARY_OPTIONS.find(d => d.value === (localProfile?.dietaryPreference || 'all'));

  return (
    <div className="screen-container bg-background" dir="rtl">
      <div 
        className="scroll-container scrollbar-hide p-4 pt-safe"
        style={{ paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {/* Profile Header - Compact */}
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <div 
              className="w-20 h-20 gradient-primary rounded-full mx-auto flex items-center justify-center shadow-glow cursor-pointer overflow-hidden group"
              onClick={handlePhotoClick}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary-foreground" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            {photoUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-3 h-3 text-destructive-foreground" />
              </button>
            )}
          </div>
          
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

          <div className="flex items-center justify-center gap-1 mt-3">
            <h1 className="text-xl font-bold">{displayName}</h1>
            <button onClick={() => setIsEditingProfile(true)} className="p-1 hover:bg-muted rounded-full">
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {skillLabels[(localProfile?.cookingLevel || 1) - 1]} • {progress.totalMealsCooked} ארוחות
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 mb-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{progress.totalMealsCooked}</p>
              <p className="text-xs text-muted-foreground">ארוחות</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-savings">₪{progress.totalSavings}</p>
              <p className="text-xs text-muted-foreground">חיסכון</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{localProfile?.cookingLevel || 1}/5</p>
              <p className="text-xs text-muted-foreground">רמה</p>
            </div>
          </div>
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
            
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded overflow-hidden">
                  <img src={appIcon} alt="Skill" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm">רמת מיומנות</span>
              </div>
              <span className="text-sm text-muted-foreground">{localProfile?.cookingLevel || 1}/5</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">העדפת תזונה</span>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <span>{currentDietary?.emoji}</span>
                <span>{currentDietary?.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Support Chefi Card */}
        <div className="bg-gradient-to-l from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-200 dark:border-pink-800/30 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">תמיכה בשפי 💝</p>
              <p className="text-xs text-muted-foreground">בקרוב תוכלו לתמוך בפיתוח</p>
            </div>
            <span className="text-xs text-pink-500 font-medium bg-pink-100 dark:bg-pink-900/30 px-2 py-1 rounded-full">
              בקרוב
            </span>
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

        {/* Reset App */}
        <button
          onClick={() => setIsResetDialogOpen(true)}
          className="w-full bg-card rounded-xl p-4 shadow-card border border-destructive/30 mb-3 flex items-center justify-between hover:bg-destructive/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-destructive/10 rounded-full flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-destructive">איפוס האפליקציה</p>
              <p className="text-xs text-muted-foreground">התחל מחדש מההתחלה</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* App Info */}
        <div className="mt-auto pt-2 text-center text-xs text-muted-foreground">
          <p>שפי – Chefi • נבנה באהבה 🧡</p>
          <p className="text-[10px] opacity-70 mt-0.5">© BudgetBites</p>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>עריכת פרופיל</DialogTitle></DialogHeader>
          <div className="py-4 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">שם</label>
              <Input 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)} 
                placeholder="הכנס שם" 
                maxLength={24} 
                className="text-right" 
                dir="rtl" 
              />
              <p className="text-xs text-muted-foreground mt-1">2-24 תווים</p>
            </div>

            {/* Cooking Level */}
            <div>
              <label className="block text-sm font-medium mb-2">רמת בישול</label>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {COOKING_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setEditedCookingLevel(level.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all shrink-0",
                      editedCookingLevel === level.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="text-lg">{level.emoji}</span>
                    <span className="text-xs font-medium whitespace-nowrap">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-sm font-medium mb-2">העדפת תזונה</label>
              <div className="grid grid-cols-4 gap-2">
                {DIETARY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setEditedDietary(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 px-2 py-3 rounded-xl transition-all",
                      editedDietary === option.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>ביטול</Button>
            <Button onClick={handleSaveProfile}>שמור</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset App Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">איפוס האפליקציה</DialogTitle>
            <DialogDescription className="text-right">
              פעולה זו תמחק את כל הנתונים שלך כולל הפרופיל, המתכונים השמורים והמועדפים. האם להמשיך?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>ביטול</Button>
            <Button variant="destructive" onClick={handleResetApp}>איפוס</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
