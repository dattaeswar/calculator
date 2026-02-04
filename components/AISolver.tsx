
import React, { useState, useEffect, useRef } from 'react';

interface AISolverProps {
  isOpen: boolean;
  onClose: () => void;
  onSolve: (prompt: string) => void;
}

const AISolver: React.FC<AISolverProps> = ({ isOpen, onClose, onSolve }) => {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSolve(prompt);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-center animate-fade-in rounded-3xl">
      <div className="w-full">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 text-center">
          What should I calculate?
        </h3>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Ask things like "15% of 84" or "solve for x: 2x+5=15"
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your math problem..."
            className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-bold shadow-lg shadow-indigo-600/20"
            >
              Solve with AI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISolver;
