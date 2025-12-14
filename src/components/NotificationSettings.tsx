import React from 'react';
import { Bell, BellOff, Moon, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { useNotifications } from '@/contexts/NotificationContext';
import { categoryLabels, frequencyLabels, NotificationCategory, NotificationSettings as SettingsType } from '@/lib/notifications';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useNotifications();

  const categories: NotificationCategory[] = [
    'delivery_vs_cooking',
    'savings_progress',
    'smart_reminder',
    'weekly_summary',
    'motivational',
  ];

  const frequencies: SettingsType['frequency'][] = ['daily', 'smart', 'minimal'];

  return (
    <div className="space-y-6">
      {/* Category Toggles */}
      <PremiumCard className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">סוגי התראות</h3>
            <p className="text-sm text-muted-foreground">בחר אילו התראות לקבל</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{categoryLabels[category]}</span>
              <Switch
                checked={settings[category]}
                onCheckedChange={(checked) => updateSettings({ [category]: checked })}
              />
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Frequency */}
      <PremiumCard className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">תדירות</h3>
            <p className="text-sm text-muted-foreground">כמה התראות לקבל</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {frequencies.map((freq) => (
            <button
              key={freq}
              onClick={() => updateSettings({ frequency: freq })}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                settings.frequency === freq
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {frequencyLabels[freq]}
            </button>
          ))}
        </div>
      </PremiumCard>

      {/* Quiet Hours */}
      <PremiumCard className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
            <Moon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">שעות שקטות</h3>
            <p className="text-sm text-muted-foreground">ללא התראות בשעות אלו</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <BellOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {settings.quietHoursStart}:00 - {settings.quietHoursEnd}:00
            </span>
          </div>
          <div className="flex gap-2">
            <select
              value={settings.quietHoursStart}
              onChange={(e) => updateSettings({ quietHoursStart: parseInt(e.target.value) })}
              className="bg-background border border-border rounded-lg px-2 py-1 text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
            <span className="text-muted-foreground">-</span>
            <select
              value={settings.quietHoursEnd}
              onChange={(e) => updateSettings({ quietHoursEnd: parseInt(e.target.value) })}
              className="bg-background border border-border rounded-lg px-2 py-1 text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};
