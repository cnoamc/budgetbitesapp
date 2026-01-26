import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Leaf, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FixedScreenLayout } from '@/components/layouts';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import appIcon from '@/assets/app-icon.png';
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

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { createProfile, hasProfile, loading } = useLocalProfile();
  
  const [name, setName] = useState('');
  const [cookingLevel, setCookingLevel] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already has profile, redirect to home
  useEffect(() => {
    if (!loading && hasProfile) {
      navigate('/home', { replace: true });
    }
  }, [loading, hasProfile, navigate]);

  const handleStart = () => {
    createProfile(name, cookingLevel, dietaryPreference);
    navigate('/home');
  };

  const handleSkip = () => {
    createProfile('שף', 1, 'all');
    navigate('/home');
  };

  if (loading) {
    return (
      <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
        <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl animate-pulse">
          <img src={appIcon} alt="שפי – Chefi" className="w-full h-full object-cover" />
        </div>
      </FixedScreenLayout>
    );
  }

  return (
    <FixedScreenLayout>
      {/* Blue gradient background */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)'
        }} 
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col" dir="rtl">
        {/* Header */}
        <div className="pt-safe px-6 pt-8 pb-4 text-center">
          <div 
            className={`transition-all duration-500 ${
              mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <div 
              className="w-20 h-20 rounded-[24px] overflow-hidden mx-auto"
              style={{
                boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.3)'
              }}
            >
              <img src={appIcon} alt="שפי – Chefi" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mt-4">בוא נכיר! 👋</h1>
          <p className="text-white/80 text-sm mt-1">רק כמה פרטים ונתחיל לבשל</p>
        </div>

        {/* Form Card */}
        <div className="flex-1 bg-background rounded-t-3xl px-5 pt-5 pb-6 overflow-y-auto">
          {/* Name Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-foreground">איך קוראים לך?</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="השם שלך"
              className="h-12 text-base bg-muted/50 border border-border/50 rounded-xl w-full"
              maxLength={24}
              dir="rtl"
            />
          </div>

          {/* Cooking Level */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-foreground">רמת הבישול שלך (אופציונלי)</label>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
              {COOKING_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setCookingLevel(level.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 min-w-[56px] h-[60px] px-2 py-2 rounded-xl transition-all shrink-0 border",
                    cookingLevel === level.value
                      ? "bg-primary text-primary-foreground shadow-md border-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/50"
                  )}
                >
                  <span className="text-lg leading-none">{level.emoji}</span>
                  <span className="text-[10px] font-medium whitespace-nowrap leading-none">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preference */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">העדפת תזונה (אופציונלי)</label>
            <div className="grid grid-cols-4 gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDietaryPreference(option.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 h-[68px] px-1 py-2 rounded-xl transition-all border",
                    dietaryPreference === option.value
                      ? "bg-primary text-primary-foreground shadow-md border-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/50"
                  )}
                >
                  <span className="text-xl leading-none">{option.emoji}</span>
                  <span className="text-[10px] font-medium leading-none">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mt-auto">
            <Button
              onClick={handleStart}
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
              disabled={!name.trim()}
            >
              התחל 🚀
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full h-11 text-muted-foreground hover:bg-muted/50"
            >
              דלג
            </Button>
          </div>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default CreateProfile;
