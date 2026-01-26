import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Camera, Clipboard, Globe, ChevronLeft } from 'lucide-react';
import { ScrollablePageLayout } from '@/components/layouts';

export const ImportRecipe: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScrollablePageLayout hasBottomNav={false}>
      <div className="flex flex-col min-h-full bg-background pb-20" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border/50">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">שמור מתכון</h1>
            <p className="text-sm text-muted-foreground">בקרוב...</p>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-4 animate-fade-in">
            {/* Coming Soon Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">🚧</p>
              <p className="font-semibold text-lg mb-2">בקרוב!</p>
              <p className="text-sm text-muted-foreground">
                פיצ'ר ייבוא מתכונים יהיה זמין בקרוב
              </p>
            </div>

            {/* Manual - Go to recipes */}
            <button
              onClick={() => navigate('/recipes')}
              className="w-full p-4 bg-card rounded-2xl border border-border/50 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-right flex-1">
                <p className="font-medium">חזור למתכונים</p>
                <p className="text-sm text-muted-foreground">בחר מתכון מהספריה</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </ScrollablePageLayout>
  );
};

export default ImportRecipe;
