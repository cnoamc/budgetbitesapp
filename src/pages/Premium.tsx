import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FixedScreenLayout } from '@/components/layouts';
import appIcon from '@/assets/app-icon.png';

const Premium: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { emoji: '☁️', text: 'גיבוי בענן', description: 'כל המתכונים שלך שמורים' },
    { emoji: '📖', text: 'מתכונים ללא הגבלה', description: 'צור ושמור כמה שתרצה' },
    { emoji: '📊', text: 'אנליטיקס ותובנות', description: 'עקוב אחרי החיסכון שלך' },
    { emoji: '🤖', text: 'עוזר בישול AI', description: 'שף שפי האישי שלך' },
  ];

  return (
    <FixedScreenLayout>
      {/* Beautiful gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, #E8F4FD 0%, #FFF8F0 45%, #F0FFF6 100%)'
        }}
      />
      
      {/* Decorative blurred circles */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ 
          background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
          top: '-10%',
          right: '-15%'
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20"
        style={{ 
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
          bottom: '20%',
          left: '-10%'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto" dir="rtl">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/50"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-full shadow-sm">
            <Crown className="w-4 h-4" />
            <span className="text-xs font-bold">PREMIUM</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center pt-4 pb-6 px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mb-4"
          >
            <div 
              className="w-20 h-20 rounded-[24px] overflow-hidden shadow-xl"
              style={{ boxShadow: '0 12px 32px -8px rgba(59, 130, 246, 0.4)' }}
            >
              <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            ברוכים הבאים! 🎉
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-center text-sm"
          >
            החשבון שלך נוצר בהצלחה
          </motion.p>
        </div>

        {/* Free Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-6 mb-6"
        >
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-lg"
            style={{ boxShadow: '0 8px 24px -8px rgba(16, 185, 129, 0.4)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">חינם עד סוף פברואר! 🎁</p>
                <p className="text-white/90 text-sm">כל הפיצ׳רים פתוחים בשבילך</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="px-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">מה מחכה לך</h2>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                  {feature.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{feature.text}</p>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-6 pb-8 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={() => navigate('/home')}
              className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              style={{ boxShadow: '0 8px 24px -8px rgba(59, 130, 246, 0.5)' }}
            >
              בואו נתחיל לבשל! 🍳
            </Button>
            <p className="text-center text-xs text-gray-400 mt-3">
              לאחר פברואר, המחיר יהיה ₪19.90/חודש
            </p>
          </motion.div>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default Premium;