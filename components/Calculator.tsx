
import React, { useState, useCallback, useEffect } from 'react';
import Display from './Display';
import Button from './Button';
import AISolver from './AISolver';
import HistoryPanel from './HistoryPanel';
import { Operator, CalculatorState } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState & { 
    isAIProcessing: boolean; 
    isAIModalOpen: boolean; 
    isHistoryOpen: boolean;
    lastExplanation: string | null 
  }>({
    display: '0',
    previousValue: null,
    operator: null,
    isWaitingForSecondOperand: false,
    history: [],
    isAIProcessing: false,
    isAIModalOpen: false,
    isHistoryOpen: false,
    lastExplanation: null
  });

  const performCalculation = (left: number, right: number, operator: Operator): number => {
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right === 0 ? NaN : left / right;
      default: return right;
    }
  };

  const handleDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.isAIProcessing) return prev;
      const { display, isWaitingForSecondOperand } = prev;
      
      // ✅ Logic: If display is "Error", replace it with input
      if (display === "Error" || isWaitingForSecondOperand) {
        return {
          ...prev,
          display: digit,
          isWaitingForSecondOperand: false,
        };
      }

      return {
        ...prev,
        display: display === '0' ? digit : display + digit,
      };
    });
  }, []);

  const handleOperator = useCallback((nextOperator: Operator) => {
    setState(prev => {
      // ✅ Logic: Prevent operations if display is "Error" or empty
      if (prev.isAIProcessing || prev.display === "Error" || prev.display.trim() === "") return prev;
      
      const { display, previousValue, operator } = prev;
      const inputValue = parseFloat(display);

      if (operator && prev.isWaitingForSecondOperand) {
        return { ...prev, operator: nextOperator };
      }

      if (previousValue === null) {
        return {
          ...prev,
          previousValue: display,
          operator: nextOperator,
          isWaitingForSecondOperand: true,
        };
      }

      if (operator) {
        const result = performCalculation(parseFloat(previousValue), inputValue, operator);
        
        // ✅ Logic: Check for finiteness (as per snippet)
        if (!isFinite(result) || isNaN(result)) {
          return { ...prev, display: "Error", previousValue: null, operator: null };
        }

        const resultStr = String(Number(result.toFixed(10)));
        const expression = `${previousValue} ${operator} ${display}`;
        
        // ✅ Save to history (intermediate chain)
        const newHistory = [`${expression} = ${resultStr}`, ...prev.history].slice(0, 5);

        return {
          ...prev,
          display: resultStr,
          previousValue: resultStr,
          operator: nextOperator,
          isWaitingForSecondOperand: true,
          history: newHistory
        };
      }

      return prev;
    });
  }, []);

  const handleEqual = useCallback(() => {
    setState(prev => {
      // ✅ Logic: Prevent equal if display is "Error" or empty
      if (prev.isAIProcessing || prev.display === "Error" || prev.display.trim() === "") return prev;
      
      const { display, previousValue, operator } = prev;
      if (!operator || previousValue === null) return prev;

      const result = performCalculation(parseFloat(previousValue), parseFloat(display), operator);
      
      // ✅ Logic: Check for finiteness
      if (!isFinite(result) || isNaN(result)) {
        return { ...prev, display: "Error", previousValue: null, operator: null };
      }

      const resultStr = String(Number(result.toFixed(10)));
      const expression = `${previousValue} ${operator} ${display}`;
      
      // ✅ Save to history
      const newHistory = [`${expression} = ${resultStr}`, ...prev.history].slice(0, 5);

      return {
        ...prev,
        display: resultStr,
        previousValue: null,
        operator: null,
        isWaitingForSecondOperand: true,
        history: newHistory
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
      previousValue: null,
      operator: null,
      isWaitingForSecondOperand: false,
      lastExplanation: null
    }));
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      // ✅ Guard decimal on Error
      if (prev.isAIProcessing || prev.display === "Error") return prev;
      if (prev.isWaitingForSecondOperand) {
        return { ...prev, display: '0.', isWaitingForSecondOperand: false };
      }
      if (!prev.display.includes('.')) {
        return { ...prev, display: prev.display + '.' };
      }
      return prev;
    });
  }, []);

  const handleAISolve = async (prompt: string) => {
    setState(prev => ({ ...prev, isAIProcessing: true, isAIModalOpen: false }));
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Solve this math problem: "${prompt}". Return only a JSON object with two fields: "result" (a number or the string "Error") and "explanation" (a brief 1-sentence explanation of the result).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              result: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["result", "explanation"]
          }
        }
      });

      const data = JSON.parse(response.text);
      
      setState(prev => {
        // ✅ Log AI results to history
        const entry = `"${prompt}" → ${data.result}`;
        const newHistory = [entry, ...prev.history].slice(0, 5);
        return {
          ...prev,
          display: data.result,
          lastExplanation: data.explanation,
          isAIProcessing: false,
          isWaitingForSecondOperand: true,
          history: newHistory
        };
      });
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, display: "Error", isAIProcessing: false }));
    }
  };

  const loadFromHistory = (val: string) => {
    const parts = val.includes('=') ? val.split('=') : val.split('→');
    const result = parts[parts.length - 1].trim();
    setState(prev => ({
      ...prev,
      display: result,
      isWaitingForSecondOperand: true,
      isHistoryOpen: false
    }));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (state.isAIModalOpen) return;
      const key = e.key;
      if (/[0-9]/.test(key)) handleDigit(key);
      if (key === '.') handleDecimal();
      if (key === 'Enter' || key === '=') handleEqual();
      if (key === 'Escape') {
        if (state.isAIModalOpen) setState(p => ({...p, isAIModalOpen: false}));
        else if (state.isHistoryOpen) setState(p => ({...p, isHistoryOpen: false}));
        else handleClear();
      }
      if (['+', '-', '*', '/'].includes(key)) handleOperator(key as Operator);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.isAIModalOpen, state.isHistoryOpen, handleDigit, handleOperator, handleEqual, handleClear, handleDecimal]);

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Calculator</h2>
        <button 
          onClick={() => setState(p => ({...p, isHistoryOpen: !p.isHistoryOpen}))}
          className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
          title="History"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
      </div>

      <Display 
        value={state.display} 
        operator={state.operator} 
        previousValue={state.previousValue} 
        isAIProcessing={state.isAIProcessing}
        explanation={state.lastExplanation}
      />
      
      <div className="grid grid-cols-4 gap-3 mt-6">
        <Button onClick={handleClear} variant="danger" className="col-span-2 text-base">Clear</Button>
        <Button 
          onClick={() => setState(p => ({...p, isAIModalOpen: true}))} 
          variant="ai"
          className="col-span-2 text-base"
        >
          ✨ AI Solver
        </Button>
        
        <Button onClick={() => handleDigit('7')}>7</Button>
        <Button onClick={() => handleDigit('8')}>8</Button>
        <Button onClick={() => handleDigit('9')}>9</Button>
        <Button onClick={() => handleOperator('/')} variant="operator">/</Button>
        
        <Button onClick={() => handleDigit('4')}>4</Button>
        <Button onClick={() => handleDigit('5')}>5</Button>
        <Button onClick={() => handleDigit('6')}>6</Button>
        <Button onClick={() => handleOperator('*')} variant="operator">×</Button>
        
        <Button onClick={() => handleDigit('1')}>1</Button>
        <Button onClick={() => handleDigit('2')}>2</Button>
        <Button onClick={() => handleDigit('3')}>3</Button>
        <Button onClick={() => handleOperator('-')} variant="operator">-</Button>
        
        <Button onClick={() => handleDigit('0')}>0</Button>
        <Button onClick={handleDecimal}>.</Button>
        <Button onClick={handleEqual} variant="success">=</Button>
        <Button onClick={() => handleOperator('+')} variant="operator">+</Button>
      </div>

      <AISolver 
        isOpen={state.isAIModalOpen} 
        onClose={() => setState(p => ({...p, isAIModalOpen: false}))}
        onSolve={handleAISolve}
      />

      <HistoryPanel 
        isOpen={state.isHistoryOpen} 
        history={state.history}
        onClose={() => setState(p => ({...p, isHistoryOpen: false}))}
        onSelect={loadFromHistory}
      />
    </div>
  );
};

export default Calculator;
