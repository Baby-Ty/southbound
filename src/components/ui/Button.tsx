import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  href, 
  onClick,
  className = '' 
}) => {
  const baseClass = 'rounded-full px-6 py-3 font-semibold transition-all duration-300 inline-block text-center';
  const variantClass = variant === 'primary'
    ? 'text-white bg-[#E86B32] hover:bg-[#F1783A] shadow-md shadow-[#E86B32]/25 hover:shadow-lg hover:shadow-[#E86B32]/35 hover:-translate-y-0.5 active:translate-y-0'
    : 'bg-[#FFF8F0] border border-[#E8D5C4] text-[#E86B32] hover:bg-sb-blue-100 hover:border-sb-blue-200 hover:text-sb-navy-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0';
  
  const fullClass = `${baseClass} ${variantClass} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={fullClass}>
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={fullClass}>
      {children}
    </button>
  );
};







