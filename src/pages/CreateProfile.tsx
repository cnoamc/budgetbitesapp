import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FixedScreenLayout } from '@/components/layouts';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { triggerHaptic } from '@/hooks/useHaptics';
import appIcon from '@/assets/app-icon.png';
import { cn } from '@/lib/utils';

const AGE_RANGES = [
  { key: 'age.under18', emoji: '🧒' },
  { key: 'age.18-25', emoji: '🧑' },
  { key: 'age.26-35', emoji: '👨' },
  { key: 'age.36-45', emoji: '🧔' },
  { key: 'age.46-55', emoji: '👴' },
  { key: 'age.55+', emoji: '🎖️' },
];

const COOKING_LEVELS = [
  { value: 1, key: 'cooking.beginner', emoji: '🥚' },
  { value: 2, key: 'cooking.basic', emoji: '🍳' },
  { value: 3, key: 'cooking.advanced', emoji: '👨‍🍳' },
  { value: 4, key: 'cooking.expert', emoji: '⭐' },
  { value: 5, key: 'cooking.chef', emoji: '👑' },
];

const DIETARY_OPTIONS = [
  { value: 'all', key: 'diet.all', emoji: '🍽️' },
  { value: 'vegetarian', key: 'diet.vegetarian', emoji: '🥗' },
  { value: 'vegan', key: 'diet.vegan', emoji: '🌱' },
  { value: 'kosher', key: 'diet.kosher', emoji: '✡️' },
];

const FOOD_OPTIONS = [
  { id: 'burgers', key: 'food.burgers', emoji: '🍔' },
  { id: 'pasta', key: 'food.pasta', emoji: '🍝' },
  { id: 'pizza', key: 'food.pizza', emoji: '🍕' },
  { id: 'asian', key: 'food.asian', emoji: '🍜' },
  { id: 'home', key: 'food.home', emoji: '🍲' },
  { id: 'sushi', key: 'food.sushi', emoji: '🍣' },
  { id: 'salads', key: 'food.salads', emoji: '🥗' },
  { id: 'desserts', key: 'food.desserts', emoji: '🍰' },
  { id: 'meat', key: 'food.meat', emoji: '🥩' },
  { id: 'seafood', key: 'food.seafood', emoji: '🦐' },
];

const TOTAL_STEPS = 4; // name, age, cooking+diet, food

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { createProfile, hasProfile, loading } = useLocalProfile();
  const { t, dir, locale } = useLanguage();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [cookingLevel, setCookingLevel] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState('all');
  const [foodPrefs, setFoodPrefs] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && hasProfile) {
      navigate('/home', { replace: true });
    }
  }, [loading, hasProfile, navigate]);

  const handleAgeSelect = (key: string) => {
    triggerHaptic('medium');
    setAgeRange(key);
  };

  const handleFoodToggle = (id: string) => {
    triggerHaptic('light');
    setFoodPrefs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleNext = () => {
    triggerHaptic('light');
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleFinish = () => {
    createProfile(name, cookingLevel, dietaryPreference, ageRange, foodPrefs);
    navigate('/welcome-done');
  };

  const handleSkip = () => {
    createProfile(locale === 'he' ? 'שף' : 'Chef', 1, 'all');
    navigate('/welcome-done');
  };

  const canProceed = () => {
    if (step === 0) return !!name.trim();
    return true;
  };

  const BackArrow = locale === 'he' ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
        <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl animate-pulse">
          <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
        </div>
      </FixedScreenLayout>
    );
  }

  return (
    <FixedScreenLayout>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }} />

      <div className="relative z-10 flex-1 flex flex-col" dir={dir}>
        {/* Header */}
        <div className="pt-safe px-6 pt-8 pb-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-20 h-20 rounded-[24px] overflow-hidden mx-auto" style={{ boxShadow: '0 20px 50px -15px rgba(0,0,0,0.3)' }}>
              <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold text-white mt-4">{t('onboarding.letsKnow')}</h1>
          <p className="text-white/80 text-sm mt-1">{t('onboarding.fewDetails')}</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === step ? "w-8 bg-white" : i < step ? "w-2 bg-white/80" : "w-2 bg-white/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="flex-1 bg-background rounded-t-3xl px-5 pt-5 pb-6 overflow-y-auto flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: locale === 'he' ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: locale === 'he' ? 30 : -30 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {/* Step 0: Name */}
              {step === 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">{t('onboarding.nameLabel')}</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('onboarding.namePlaceholder')}
                    className="h-12 text-base bg-muted/50 border border-border/50 rounded-xl w-full"
                    maxLength={24}
                    dir={dir}
                    autoFocus
                  />
                </div>
              )}

              {/* Step 1: Age */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">{t('onboarding.ageLabel')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {AGE_RANGES.map((age) => (
                      <button
                        key={age.key}
                        onClick={() => handleAgeSelect(age.key)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 h-[72px] px-2 rounded-xl transition-all border",
                          ageRange === age.key
                            ? "bg-primary text-primary-foreground shadow-md border-primary"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/50"
                        )}
                      >
                        <span className="text-xl">{age.emoji}</span>
                        <span className="text-xs font-medium">{t(age.key)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Cooking Level + Diet */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">{t('onboarding.cookingLabel')}</label>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 mb-5">
                    {COOKING_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => { triggerHaptic('light'); setCookingLevel(level.value); }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 min-w-[56px] h-[60px] px-2 py-2 rounded-xl transition-all shrink-0 border",
                          cookingLevel === level.value
                            ? "bg-primary text-primary-foreground shadow-md border-primary"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/50"
                        )}
                      >
                        <span className="text-lg leading-none">{level.emoji}</span>
                        <span className="text-[10px] font-medium whitespace-nowrap leading-none">{t(level.key)}</span>
                      </button>
                    ))}
                  </div>

                  <label className="block text-sm font-medium mb-2 text-foreground">{t('onboarding.dietLabel')}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {DIETARY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { triggerHaptic('light'); setDietaryPreference(option.value); }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 h-[68px] px-1 py-2 rounded-xl transition-all border",
                          dietaryPreference === option.value
                            ? "bg-primary text-primary-foreground shadow-md border-primary"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/50"
                        )}
                      >
                        <span className="text-xl leading-none">{option.emoji}</span>
                        <span className="text-[10px] font-medium leading-none">{t(option.key)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Food Preferences */}
              {step === 3 && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">{t('onboarding.foodLabel')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {FOOD_OPTIONS.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleFoodToggle(food.id)}
                        className={cn(
                          "flex items-center gap-3 h-[56px] px-4 rounded-xl transition-all border",
                          foodPrefs.includes(food.id)
                            ? "bg-primary text-primary-foreground shadow-md border-primary"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/50"
                        )}
                      >
                        <span className="text-xl">{food.emoji}</span>
                        <span className="text-sm font-medium">{t(food.key)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="space-y-3 mt-6 pt-4">
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-14 rounded-2xl px-4"
                >
                  <BackArrow className="w-5 h-5" />
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg"
                disabled={!canProceed()}
              >
                {step === TOTAL_STEPS - 1 ? t('onboarding.start') : t('onboarding.next')}
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full h-11 text-muted-foreground hover:bg-muted/50"
            >
              {t('onboarding.skip')}
            </Button>
          </div>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default CreateProfile;
