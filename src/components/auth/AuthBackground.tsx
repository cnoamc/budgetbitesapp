import React from 'react';

export const AuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Multi-stop gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(155deg, #F7F8FF 0%, #FFF2E9 35%, #ECFFF4 70%, #F0F8FF 100%)'
        }}
      />
      
      {/* Blurred blobs for depth */}
      <div 
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, hsl(340 60% 85%) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="absolute top-1/3 -left-32 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(200 70% 85%) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-35"
        style={{
          background: 'radial-gradient(circle, hsl(145 60% 85%) 0%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />
      <div 
        className="absolute bottom-1/2 left-1/2 w-64 h-64 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, hsl(30 80% 90%) 0%, transparent 70%)',
          filter: 'blur(50px)',
          transform: 'translate(-50%, 50%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};