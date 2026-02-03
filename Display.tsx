
import React from 'react';
import { Operator } from '../types';

interface DisplayProps {
  value: string;
  operator: Operator;
  previousValue: string | null;
  isAIProcessing?: boolean;
  explanation?: string | null;
}

const Display: React.FC<DisplayProps> = ({ value, operator, previousValue, isAIProcessing, explanation }) => {
  const formattedValue = value.length > 15 ? parseFloat(value).toPrecision(8) : value;

  return (
    <div className="bg-slate-950/50 p-6 rounded-2xl flex flex-col items-end justify-center min-h-[140px] border border-slate-800/50 relative overflow-hidden">
      {isAIProcessing && (
        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse flex items-center justify-center">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest animate-bounce">AI Thinking...</span>
        </div>
      )}
      
      <div className="flex justify-between w-full mb-1">
        <div className="flex gap-2">
          {explanation && (
             <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 animate-fade-in">
               AI Assisted
             </span>
          )}
        </div>
        <div className="h-6 text-slate-500 text-sm font-medium tracking-wider">
          {previousValue !== null && `${previousValue} ${operator || ''}`}
        </div>
      </div>

      <div 
        className={`text-white font-bold transition-all duration-300 break-all text-right w-full
          ${formattedValue.length > 10 ? 'text-3xl' : 'text-5xl'}
          ${isAIProcessing ? 'opacity-20 blur-sm' : 'opacity-100'}
        `}
      >
        {formattedValue}
      </div>

      {explanation && !isAIProcessing && (
        <div className="w-full mt-2 text-right">
          <p className="text-slate-400 text-[11px] italic leading-tight truncate">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default Display;
