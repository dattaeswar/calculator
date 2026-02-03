
export type Operator = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operator: Operator;
  isWaitingForSecondOperand: boolean;
  history: string[];
}
