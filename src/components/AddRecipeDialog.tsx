import React, { useState } from 'react';
import { Plus, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCustomRecipes, CustomRecipe } from '@/hooks/useCustomRecipes';
import { cn } from '@/lib/utils';

const EMOJI_OPTIONS = ['🍕', '🍔', '🍝', '🍜', '🥗', '🍲', '🥘', '🍛', '🍱', '🍣', '🥙', '🌮', '🍰', '🍪'];

interface AddRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeAdded?: (recipe: CustomRecipe) => void;
}

export const AddRecipeDialog: React.FC<AddRecipeDialogProps> = ({
  open,
  onOpenChange,
  onRecipeAdded,
}) => {
  const { addCustomRecipe } = useCustomRecipes();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🍽️',
    ingredients: '',
    steps: '',
    prepTime: 30,
    homeCost: 30,
    deliveryCost: 60,
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const recipe = await addCustomRecipe({
        name: formData.name.trim(),
        emoji: formData.emoji,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        steps: formData.steps.split('\n').filter(s => s.trim()),
        prepTime: formData.prepTime,
        homeCost: formData.homeCost,
        deliveryCost: formData.deliveryCost,
        category: 'easy',
      });

      if (recipe) {
        onRecipeAdded?.(recipe);
        onOpenChange(false);
        // Reset form
        setStep(1);
        setFormData({
          name: '',
          emoji: '🍽️',
          ingredients: '',
          steps: '',
          prepTime: 30,
          homeCost: 30,
          deliveryCost: 60,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5" />
            הוספת מתכון חדש
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {step === 1 && (
            <>
              {/* Recipe Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">שם המתכון</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="למשל: פסטה בולונז"
                  className="text-base"
                />
              </div>

              {/* Emoji Selection */}
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

              {/* Prep Time */}
              <div>
                <label className="text-sm font-medium mb-2 block">זמן הכנה (דקות)</label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60, 90].map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData(prev => ({ ...prev, prepTime: time }))}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
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

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.name.trim()}
                className="w-full rounded-xl"
              >
                המשך
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Ingredients */}
              <div>
                <label className="text-sm font-medium mb-2 block">מצרכים (שורה לכל מצרך)</label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="500 גרם בשר טחון&#10;1 בצל קצוץ&#10;2 כפות רסק עגבניות"
                  className="w-full h-32 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="text-sm font-medium mb-2 block">שלבי הכנה (שורה לכל שלב)</label>
                <textarea
                  value={formData.steps}
                  onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
                  placeholder="מטגנים את הבצל&#10;מוסיפים את הבשר&#10;משלימים את הרוטב"
                  className="w-full h-32 p-3 rounded-xl border border-border bg-background text-sm resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl"
                >
                  חזור
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl"
                >
                  {loading ? 'שומר...' : (
                    <>
                      <Plus className="w-4 h-4 ml-1" />
                      שמור מתכון
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
