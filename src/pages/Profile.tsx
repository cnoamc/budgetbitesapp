import React from 'react';
import { Settings, RefreshCw, User, MapPin, ChefHat, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress } = useApp();
  const { user, signOut } = useAuth();

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];

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

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 gradient-primary rounded-full mx-auto flex items-center justify-center mb-4 shadow-glow">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-1">השף הביתי</h1>
          <p className="text-muted-foreground">
            {skillLabels[progress.skillLevel - 1]} • {progress.totalMealsCooked} ארוחות
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2" dir="ltr">
              {user.email}
            </p>
          )}
        </div>

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
                <ChefHat className="w-5 h-5 text-muted-foreground" />
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
