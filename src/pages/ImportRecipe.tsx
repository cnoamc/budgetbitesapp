import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link, ExternalLink, Instagram, Youtube, ArrowRight, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FixedScreenLayout } from '@/components/layouts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ImportSource = 'link' | 'manual' | null;
type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

const socialPlatforms = [
  { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-black' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'bg-red-500' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'bg-red-600' },
  { id: 'facebook', name: 'Facebook', icon: '👤', color: 'bg-blue-600' },
];

export const ImportRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [source, setSource] = useState<ImportSource>(null);
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [importedRecipe, setImportedRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-import if URL is provided
  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setUrl(urlParam);
      setSource('link');
      handleImport(urlParam);
    }
  }, [searchParams]);

  const handleImport = async (importUrl: string) => {
    if (!importUrl.trim()) {
      toast.error('יש להזין כתובת URL');
      return;
    }

    if (!user) {
      toast.error('יש להתחבר כדי לייבא מתכונים');
      navigate('/signin');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      // Call edge function to scrape and parse recipe
      const { data, error: fnError } = await supabase.functions.invoke('import-recipe', {
        body: { url: importUrl },
      });

      if (fnError) throw fnError;

      if (!data?.success) {
        throw new Error(data?.error || 'לא הצלחנו לייבא את המתכון');
      }

      // Save to custom_recipes
      const recipe = data.recipe;
      const { data: inserted, error: insertError } = await supabase
        .from('custom_recipes')
        .insert({
          user_id: user.id,
          name: recipe.name || 'מתכון מיובא',
          emoji: recipe.emoji || '📥',
          ingredients: recipe.ingredients || [],
          steps: recipe.steps || [],
          prep_time: recipe.prepTime || 30,
          home_cost: recipe.homeCost || 30,
          delivery_cost: recipe.deliveryCost || 60,
          category: recipe.category || 'easy',
          chef_notes: `מקור: ${importUrl}`,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setImportedRecipe(inserted);
      setStatus('success');
      toast.success('המתכון יובא בהצלחה! 🎉');

    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'שגיאה בייבוא המתכון');
      setStatus('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleImport(url);
  };

  const handleGoToRecipe = () => {
    if (importedRecipe?.id) {
      navigate(`/my-recipe/${importedRecipe.id}`);
    } else {
      navigate('/recipes');
    }
  };

  return (
    <FixedScreenLayout className="bg-background">
      <div className="flex-1 flex flex-col p-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">ייבוא מתכון</h1>
            <p className="text-sm text-muted-foreground">שמור מתכונים מכל מקום</p>
          </div>
        </div>

        {status === 'idle' && !source && (
          <div className="space-y-6 animate-fade-in">
            {/* From Social */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">מרשתות חברתיות</h2>
              <div className="grid grid-cols-5 gap-2">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSource('link')}
                    className={`aspect-square rounded-2xl ${platform.color} flex items-center justify-center text-2xl shadow-md hover:scale-105 transition-transform`}
                  >
                    {platform.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* From Web */}
            <button
              onClick={() => setSource('link')}
              className="w-full p-4 bg-card rounded-2xl border border-border/50 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div className="text-right flex-1">
                <p className="font-medium">מאתר אינטרנט</p>
                <p className="text-sm text-muted-foreground">הדבק קישור למתכון</p>
              </div>
            </button>

            {/* Manual */}
            <button
              onClick={() => navigate('/recipes')}
              className="w-full p-4 bg-card rounded-2xl border border-border/50 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-right flex-1">
                <p className="font-medium">הוסף ידנית</p>
                <p className="text-sm text-muted-foreground">כתוב את המתכון בעצמך</p>
              </div>
            </button>
          </div>
        )}

        {source === 'link' && status === 'idle' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">הדבק קישור למתכון</label>
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="text-left"
                    dir="ltr"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!url.trim()}>
                  <Link className="w-4 h-4" />
                  ייבא מתכון
                </Button>
              </form>
            </div>
            
            <button
              onClick={() => setSource(null)}
              className="w-full text-center text-sm text-muted-foreground"
            >
              חזרה
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-lg font-medium">מייבא מתכון...</p>
            <p className="text-sm text-muted-foreground text-center">
              קורא את התוכן ומחלץ את המתכון
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-xl font-bold">המתכון יובא בהצלחה!</p>
            {importedRecipe && (
              <div className="bg-card rounded-2xl p-4 border border-border/50 w-full max-w-sm">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{importedRecipe.emoji || '📥'}</span>
                  <div>
                    <p className="font-semibold">{importedRecipe.name}</p>
                    <p className="text-sm text-muted-foreground">נוסף למתכונים שלך</p>
                  </div>
                </div>
              </div>
            )}
            <Button onClick={handleGoToRecipe} className="w-full max-w-sm mt-4">
              לצפייה במתכון
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-xl font-bold">לא הצלחנו לייבא</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              {error || 'נסה שוב או הוסף את המתכון ידנית'}
            </p>
            <div className="flex gap-2 w-full max-w-sm">
              <Button 
                variant="outline" 
                onClick={() => { setStatus('idle'); setSource('link'); }}
                className="flex-1"
              >
                נסה שוב
              </Button>
              <Button 
                onClick={() => navigate('/recipes')}
                className="flex-1"
              >
                הוסף ידנית
              </Button>
            </div>
          </div>
        )}
      </div>
    </FixedScreenLayout>
  );
};

export default ImportRecipe;
