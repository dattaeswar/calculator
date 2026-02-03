
import React from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Precision Calc
          </h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-medium">
            Minimalist Arithmetic Engine
          </p>
        </header>
        
        <main className="relative group">
          {/* Decorative background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <Calculator />
        </main>
        
        <footer className="mt-12 text-center text-slate-500 text-xs">
          Built with React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
};

export default App;
