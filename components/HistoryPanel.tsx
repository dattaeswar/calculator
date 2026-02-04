
import React from 'react';

interface HistoryPanelProps {
  isOpen: boolean;
  history: string[];
  onClose: () => void;
  onSelect: (val: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, history, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col animate-fade-in rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">History</h3>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm">
            <svg className="mb-2 opacity-20" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
            No history yet
          </div>
        ) : (
          history.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item)}
              className="w-full text-right group p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-200"
            >
              <div className="text-slate-500 text-xs mb-1 font-mono">
                {item.includes('→') ? 'AI Query' : 'Calculation'}
              </div>
              <div className="text-slate-100 font-medium text-lg truncate group-hover:text-indigo-300">
                {item}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest">
          Showing last 5 entries
        </p>
      </div>
    </div>
  );
};

export default HistoryPanel;
