import React from 'react';

interface HeadingProps {
  level?: 1 | 2;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, children, className = '' }) => {
  const baseClass = level === 1 
    ? 'text-4xl md:text-6xl font-semibold tracking-tight text-stone-800'
    : 'text-2xl md:text-4xl font-semibold text-stone-800';
  
  const Tag = level === 1 ? 'h1' : 'h2';
  
  return <Tag className={`${baseClass} ${className}`}>{children}</Tag>;
};

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-xs uppercase tracking-[0.2em] text-orange-600 font-medium ${className}`}>
      {children}
    </div>
  );
};







