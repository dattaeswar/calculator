
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'operator' | 'success' | 'danger' | 'ai';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const baseStyles = "active:scale-95 transition-all duration-100 font-semibold text-xl rounded-xl py-4 flex items-center justify-center shadow-lg cursor-pointer select-none";
  
  const variants = {
    default: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    operator: "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30",
    success: "bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/30",
    danger: "bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 border border-rose-800/50",
    ai: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border border-indigo-400/50 shadow-indigo-500/20"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
