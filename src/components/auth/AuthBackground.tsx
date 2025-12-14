import React from 'react';

export const AuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Multi-stop gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF3E6 45%, #F0FFF6 100%)'
        }}
      />
      
      {/* Decorative blurred circles for depth */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ 
          background: 'linear-gradient(135deg, #FFB088 0%, #FF8866 100%)',
          top: '-5%',
          right: '-10%'
        }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-15"
        style={{ 
          background: 'linear-gradient(135deg, #88CCFF 0%, #6699FF 100%)',
          top: '25%',
          left: '-15%'
        }}
      />
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{ 
          background: 'linear-gradient(135deg, #88FFBB 0%, #66DDAA 100%)',
          bottom: '30%',
          right: '-5%'
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-10"
        style={{ 
          background: 'linear-gradient(135deg, #FFAACC 0%, #FF88AA 100%)',
          bottom: '10%',
          left: '10%'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};