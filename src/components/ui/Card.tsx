import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-2 border-orange-200 ${className}`}>
      {children}
    </div>
  );
};







