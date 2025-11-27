import React from 'react';

interface TornPaperDividerProps {
  className?: string;
  direction?: 'up' | 'down';
  fill?: string;
}

export const TornPaperDivider: React.FC<TornPaperDividerProps> = ({ 
  className = '', 
  direction = 'down',
  fill = '#ffffff'
}) => {
  return (
    <div className={`w-full overflow-hidden leading-[0] transform ${direction === 'up' ? 'rotate-180' : ''} ${className}`}>
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]"
        style={{ fill }}
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>
    </div>
  );
};

export const WashiTapeDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-4 md:h-6 bg-white/40 backdrop-blur-[2px] relative ${className}`} style={{
       maskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z\' fill=\'black\'/%3E%3C/svg%3E")',
       WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z\' fill=\'black\'/%3E%3C/svg%3E")',
       maskSize: 'contain',
       WebkitMaskSize: 'contain'
    }}>
    </div>
  );
}

