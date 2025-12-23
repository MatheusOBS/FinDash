
export type TransactionType = 'receita' | 'despesa';
export type Category = 'Alimentação' | 'Transporte' | 'Utilidades' | 'Compras' | 'Renda' | 'Entretenimento' | 'Moradia' | 'Investimento' | 'Outros';
export type AccountType = 'Dinheiro' | 'Cartão de Débito' | 'Cartão de Crédito' | 'Poupança';
export type Frequency = 'única' | 'semanal' | 'mensal' | 'anual';

export interface Transaction {
  id: string;
  date: string;
  category: Category;
  description: string;
  amount: number;
  type: TransactionType;
  accountId: AccountType;
  isRecurring?: boolean;
  frequency?: Frequency;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  preferredCurrency: 'USD' | 'BRL' | 'EUR';
  isDarkMode: boolean;
}
