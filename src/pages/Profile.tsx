import React from 'react';
import { Settings, RefreshCw, User, MapPin, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { resetAll } from '@/lib/storage';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, progress } = useApp();

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];

  const handleReset = () => {
    if (window.confirm('האם אתה בטוח שאתה רוצה לאפס את כל הנתונים?')) {
      resetAll();
      navigate('/');
      window.location.reload();
    }
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
            onClick={() => navigate('/')}
          >
            <RefreshCw className="w-5 h-5" />
            מילוי שאלון מחדש
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleReset}
          >
            <RefreshCw className="w-5 h-5" />
            איפוס כל הנתונים
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
