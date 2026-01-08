import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link, ExternalLink, ArrowRight, Loader2, CheckCircle, AlertCircle, Plus, X, ChevronLeft, Globe, Camera, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollablePageLayout } from '@/components/layouts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TikTokIcon, FacebookIcon, InstagramIcon, YouTubeIcon, PinterestIcon } from '@/components/SocialIcons';

type ImportSource = 'link' | 'manual' | null;
type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  steps: { text: string; highlight?: string }[];
  appLink?: string;
}

const socialPlatforms: SocialPlatform[] = [
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: <TikTokIcon className="w-5 h-5" />, 
    color: 'bg-black',
    appLink: 'https://tiktok.com',
    steps: [
      { text: 'פתח את המתכון ולחץ על', highlight: 'Share' },
      { text: 'החלק ימינה ולחץ על', highlight: 'More' },
      { text: 'החלק שוב ולחץ על', highlight: 'More' },
      { text: 'גלול למטה ובחר את', highlight: 'BudgetBites' },
    ]
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <FacebookIcon className="w-5 h-5" />, 
    color: 'bg-blue-600',
    appLink: 'https://facebook.com',
    steps: [
      { text: 'פתח את המתכון ולחץ על', highlight: 'Share' },
      { text: 'החלק ימינה ולחץ על', highlight: 'More' },
      { text: 'החלק שוב ולחץ על', highlight: 'More' },
      { text: 'גלול למטה ובחר את', highlight: 'BudgetBites' },
    ]
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <InstagramIcon className="w-5 h-5" />, 
    color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    appLink: 'https://instagram.com',
    steps: [
      { text: 'פתח את המתכון ולחץ על', highlight: 'Share' },
      { text: 'החלק ימינה ולחץ על', highlight: 'Share to...' },
      { text: 'החלק שוב ולחץ על', highlight: 'More' },
      { text: 'גלול למטה ובחר את', highlight: 'BudgetBites' },
    ]
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: <YouTubeIcon className="w-5 h-5" />, 
    color: 'bg-red-600',
    appLink: 'https://youtube.com',
    steps: [
      { text: 'פתח את המתכון ולחץ על', highlight: 'Share' },
      { text: 'החלק ימינה ולחץ על', highlight: 'More' },
      { text: 'החלק שוב ולחץ על', highlight: 'More' },
      { text: 'גלול למטה ובחר את', highlight: 'BudgetBites' },
    ]
  },
  { 
    id: 'pinterest', 
    name: 'Pinterest', 
    icon: <PinterestIcon className="w-5 h-5" />, 
    color: 'bg-red-600',
    appLink: 'https://pinterest.com',
    steps: [
      { text: 'פתח את המתכון ולחץ על', highlight: 'Share' },
      { text: 'החלק ימינה ולחץ על', highlight: 'More apps' },
      { text: 'החלק שוב ולחץ על', highlight: 'More' },
      { text: 'גלול למטה ובחר את', highlight: 'BudgetBites' },
    ]
  },
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
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);

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
          servings: recipe.servings || 4,
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

  const handlePlatformClick = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
  };

  const handleGoToPlatform = (platform: SocialPlatform) => {
    if (platform.appLink) {
      window.open(platform.appLink, '_blank');
    }
  };

  return (
    <ScrollablePageLayout hasBottomNav={false}>
      <div className="flex flex-col min-h-full bg-background pb-20" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border/50">
          <button
            onClick={() => source ? setSource(null) : navigate(-1)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">שמור מתכון</h1>
            <p className="text-sm text-muted-foreground">מכל מקום באינטרנט</p>
          </div>
        </div>

        <div className="flex-1 p-4">
          {status === 'idle' && !source && (
            <div className="space-y-4 animate-fade-in">
              {/* From Socials Section */}
              <div className="bg-card rounded-2xl p-4 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-xl">
                    📱
                  </div>
                  <div>
                    <p className="font-semibold">מרשתות חברתיות</p>
                    <p className="text-sm text-muted-foreground">מכל האפליקציות האהובות עליך</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformClick(platform)}
                      className="flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors"
                    >
                      <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-lg text-white`}>
                        {platform.icon}
                      </div>
                      <span className="font-medium text-sm">{platform.name}</span>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto" />
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
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-medium">מאתר אינטרנט</p>
                  <p className="text-sm text-muted-foreground">הדבק קישור למתכון</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
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
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Scan - Coming Soon */}
              <button
                disabled
                className="w-full p-4 bg-card rounded-2xl border border-border/50 flex items-center gap-4 opacity-50"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-medium">סרוק עמוד מתכון</p>
                  <p className="text-sm text-muted-foreground">בקרוב...</p>
                </div>
              </button>

              {/* Paste Recipe */}
              <button
                disabled
                className="w-full p-4 bg-card rounded-2xl border border-border/50 flex items-center gap-4 opacity-50"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Clipboard className="w-6 h-6" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-medium">הדבק מתכון</p>
                  <p className="text-sm text-muted-foreground">בקרוב...</p>
                </div>
              </button>
            </div>
          )}

          {source === 'link' && status === 'idle' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Link className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">ייבוא מקישור</p>
                    <p className="text-sm text-muted-foreground">הדבק כתובת URL של מתכון</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="text-left h-12"
                    dir="ltr"
                  />
                  <Button type="submit" className="w-full h-12" disabled={!url.trim()}>
                    <ExternalLink className="w-4 h-4" />
                    ייבא מתכון
                  </Button>
                </form>
              </div>
              
              <button
                onClick={() => setSource(null)}
                className="w-full text-center text-sm text-muted-foreground py-2"
              >
                ← חזרה
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              </div>
              <p className="text-lg font-semibold">מייבא מתכון...</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                קורא את התוכן ומחלץ את המתכון עבורך
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
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
              <Button onClick={handleGoToRecipe} className="w-full max-w-sm mt-4 h-12">
                לצפייה במתכון
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
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
                  className="flex-1 h-12"
                >
                  נסה שוב
                </Button>
                <Button 
                  onClick={() => navigate('/recipes')}
                  className="flex-1 h-12"
                >
                  הוסף ידנית
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform Tutorial Modal */}
      <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
        <DialogContent className="max-w-sm mx-4 max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-center text-lg">
              ייבוא מ-{selectedPlatform?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlatform && (
            <div className="space-y-4 pt-2">
              {selectedPlatform.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm">
                      {step.text}{' '}
                      {step.highlight && (
                        <span className="font-semibold bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                          {step.highlight}
                        </span>
                      )}
                    </p>
                    {/* Placeholder for step illustration */}
                    <div className="mt-2 bg-muted rounded-xl h-24 flex items-center justify-center text-muted-foreground text-xs">
                      📱 צילום מסך לדוגמה
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full h-12" 
                  onClick={() => handleGoToPlatform(selectedPlatform)}
                >
                  פתח את {selectedPlatform.name}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  או{' '}
                  <button 
                    onClick={() => { setSelectedPlatform(null); setSource('link'); }}
                    className="text-primary underline"
                  >
                    הדבק קישור ידנית
                  </button>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ScrollablePageLayout>
  );
};

export default ImportRecipe;