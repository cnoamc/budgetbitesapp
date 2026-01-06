import React, { useState } from 'react';
import { Plus, ChefHat, ArrowRight, Sparkles, Pencil, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCustomRecipes } from '@/hooks/useCustomRecipes';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const EMOJI_OPTIONS = ['🍕', '🍔', '🍝', '🍜', '🥗', '🍲', '🥘', '🍛', '🍱', '🍣', '🥙', '🌮', '🍰', '🍪'];
const DIFFICULTY_OPTIONS = [
  { id: 'beginner', label: 'מתחיל', emoji: '🌱' },
  { id: 'intermediate', label: 'בינוני', emoji: '🍳' },
  { id: 'advanced', label: 'מתקדם', emoji: '👨‍🍳' },
];

interface AddRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeAdded?: () => void;
}

export const AddRecipeDialog: React.FC<AddRecipeDialogProps> = ({
  open,
  onOpenChange,
  onRecipeAdded,
}) => {
  const { addCustomRecipe } = useCustomRecipes();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [isEditingExplanation, setIsEditingExplanation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🍽️',
    ingredients: '',
    steps: '',
    prepTime: 30,
    servings: 2,
    difficulty: 'beginner',
    tips: '',
    donenessChecks: '',
    chefNotes: '',
    explanationText: '',
  });

  const generateExplanationPreview = async () => {
    setGeneratingPreview(true);
    try {
      const { data, error } = await supabase.functions.invoke('cooking-assistant', {
        body: {
          messages: [{
            role: 'user',
            content: `אני יוצר מתכון חדש בשם "${formData.name}".
המצרכים: ${formData.ingredients}
השלבים: ${formData.steps}
טיפים: ${formData.tips || 'אין'}
רמת קושי: ${formData.difficulty}

כתוב הסבר קצר וידידותי (3-4 משפטים) שאני אוכל להשתמש בו כדי להסביר את המתכון לאחרים. ההסבר צריך להיות בגוף ראשון, כאילו אני מדבר, ולכלול את הרעיון מאחורי המנה ומה מיוחד בה.`
          }],
          recipeName: null,
        },
      });

      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        explanationText: data.message || `מתכון ל${formData.name} - מנה טעימה שקל להכין בבית!`
      }));
    } catch (error) {
      console.error('Error generating preview:', error);
      setFormData(prev => ({
        ...prev,
        explanationText: `${formData.name} היא מנה מדהימה שאני אוהב להכין! היא מתאימה לכל רמה ומביאה טעם ביתי אמיתי. עקבו אחרי הצעדים ותקבלו תוצאה מושלמת.`
      }));
    } finally {
      setGeneratingPreview(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const recipeMemory = {
        name: formData.name,
        servings: formData.servings,
        difficulty: formData.difficulty,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        steps: formData.steps.split('\n').filter(s => s.trim()).map((step, idx) => ({
          step_number: idx + 1,
          instruction: step
        })),
        tips: formData.tips.split('\n').filter(t => t.trim()),
        doneness_checks: formData.donenessChecks.split('\n').filter(d => d.trim()),
        chef_notes: formData.chefNotes,
        explanation_text: formData.explanationText,
      };

      const recipe = await addCustomRecipe({
        name: formData.name.trim(),
        emoji: formData.emoji,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        steps: formData.steps.split('\n').filter(s => s.trim()),
        prepTime: formData.prepTime,
        homeCost: 30,
        deliveryCost: 60,
        category: 'easy',
        servings: formData.servings,
        difficulty: formData.difficulty,
        tips: formData.tips.split('\n').filter(t => t.trim()),
        donenessChecks: formData.donenessChecks.split('\n').filter(d => d.trim()),
        chefNotes: formData.chefNotes,
        recipeMemoryJson: recipeMemory,
        explanationText: formData.explanationText,
      });

      if (recipe) {
        onRecipeAdded?.();
        onOpenChange(false);
        resetForm();
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      emoji: '🍽️',
      ingredients: '',
      steps: '',
      prepTime: 30,
      servings: 2,
      difficulty: 'beginner',
      tips: '',
      donenessChecks: '',
      chefNotes: '',
      explanationText: '',
    });
    setIsEditingExplanation(false);
  };

  const goToStep = async (nextStep: number) => {
    if (nextStep === 4 && !formData.explanationText) {
      await generateExplanationPreview();
    }
    setStep(nextStep);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5" />
            {step === 4 ? 'כך שפי יציג את המתכון שלך 🍽️' : 'הוספת מתכון חדש'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">שם המתכון</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="למשל: פסטה בולונז"
                  className="text-base"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">בחר אייקון</label>
                <div className="grid grid-cols-7 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                      className={cn(
                        "w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all",
                        formData.emoji === emoji
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-secondary hover:bg-muted"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">זמן הכנה (דקות)</label>
                  <div className="flex gap-1">
                    {[15, 30, 45, 60].map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData(prev => ({ ...prev, prepTime: time }))}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                          formData.prepTime === time
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-muted"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">מנות</label>
                  <div className="flex gap-1">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData(prev => ({ ...prev, servings: num }))}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                          formData.servings === num
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-muted"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">רמת קושי</label>
                <div className="flex gap-2">
                  {DIFFICULTY_OPTIONS.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setFormData(prev => ({ ...prev, difficulty: diff.id }))}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1",
                        formData.difficulty === diff.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-muted"
                      )}
                    >
                      <span>{diff.emoji}</span>
                      <span>{diff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => goToStep(2)}
                disabled={!formData.name.trim()}
                className="w-full rounded-xl"
              >
                המשך
                <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              </Button>
            </>
          )}

          {/* Step 2: Ingredients & Steps */}
          {step === 2 && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">מצרכים (שורה לכל מצרך)</label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="500 גרם בשר טחון&#10;1 בצל קצוץ&#10;2 כפות רסק עגבניות"
                  className="w-full h-28 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">שלבי הכנה (שורה לכל שלב)</label>
                <textarea
                  value={formData.steps}
                  onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
                  placeholder="מטגנים את הבצל&#10;מוסיפים את הבשר&#10;משלימים את הרוטב"
                  className="w-full h-28 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl">
                  חזור
                </Button>
                <Button 
                  onClick={() => goToStep(3)} 
                  disabled={!formData.ingredients.trim() || !formData.steps.trim()}
                  className="flex-1 rounded-xl"
                >
                  המשך
                  <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Tips & Extra Info */}
          {step === 3 && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">טיפים וטעויות נפוצות (אופציונלי)</label>
                <textarea
                  value={formData.tips}
                  onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                  placeholder="אל תוסיפו מלח בהתחלה&#10;חכו שהמחבת תהיה חמה"
                  className="w-full h-20 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">איך יודעים שזה מוכן? (אופציונלי)</label>
                <textarea
                  value={formData.donenessChecks}
                  onChange={(e) => setFormData(prev => ({ ...prev, donenessChecks: e.target.value }))}
                  placeholder="הבשר משחים צבע&#10;הרוטב מתחיל לבעבע"
                  className="w-full h-20 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">הערות לשף (אופציונלי)</label>
                <textarea
                  value={formData.chefNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, chefNotes: e.target.value }))}
                  placeholder="איך שפי צריך להסביר את המתכון..."
                  className="w-full h-16 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-xl">
                  חזור
                </Button>
                <Button onClick={() => goToStep(4)} className="flex-1 rounded-xl">
                  <Sparkles className="w-4 h-4 ml-1" />
                  צפה בתצוגה מקדימה
                </Button>
              </div>
            </>
          )}

          {/* Step 4: Preview & Confirm */}
          {step === 4 && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                ההסבר הזה ילווה כל מי שיבשל את המתכון שלך<br/>
                כאילו אתה עומד לידו במטבח.
              </p>

              {generatingPreview ? (
                <div className="bg-secondary/50 rounded-2xl p-6 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">שפי מכין את ההסבר...</p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 border border-primary/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-xl">
                      👨‍🍳
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">שפי מציג:</p>
                      <p className="text-xs text-muted-foreground">{formData.name}</p>
                    </div>
                  </div>
                  
                  {isEditingExplanation ? (
                    <textarea
                      value={formData.explanationText}
                      onChange={(e) => setFormData(prev => ({ ...prev, explanationText: e.target.value }))}
                      className="w-full h-24 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm leading-relaxed bg-background/50 rounded-xl p-3">
                      {formData.explanationText || 'טוען...'}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">שפי משתמש בניסוח הזה כדי:</p>
                <ul className="space-y-0.5 mr-3">
                  <li>• להסביר את הרעיון מאחורי המנה</li>
                  <li>• להדריך שלב־אחר־שלב בצורה ברורה</li>
                  <li>• לשמור על הטיפים והסגנון שלך</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingExplanation(!isEditingExplanation)}
                  className="flex-1 rounded-xl"
                  disabled={generatingPreview}
                >
                  <Pencil className="w-4 h-4 ml-1" />
                  {isEditingExplanation ? 'סיים עריכה' : 'ערוך ניסוח'}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || generatingPreview}
                  className="flex-1 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                      שומר...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 ml-1" />
                      שמור והמשך
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground">
                ℹ️ הניסוח נשמר יחד עם המתכון וישתנה רק אם תבחר לערוך אותו שוב
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};