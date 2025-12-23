import React from 'react';
import TransactionTable from '../TransactionTable';
import { Transaction } from '../../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  handleExportCSV: () => void;
  setIsModalOpen: (open: boolean) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions, handleExportCSV, setIsModalOpen, setTransactions
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black tracking-tight">Extrato Completo</h2>
         <div className="flex gap-2">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-green/30 rounded-xl text-xs font-bold hover:bg-border-green/50 transition-all">
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar CSV
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark rounded-xl text-xs font-black shadow-lg shadow-primary/20 transition-all">
              <span className="material-symbols-outlined text-sm">add</span>
              Nova Transação
            </button>
         </div>
      </div>
      <div className="bg-surface-dark border border-border-green/30 rounded-2xl overflow-hidden shadow-xl">
        <TransactionTable 
          transactions={transactions} 
          onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))} 
        />
      </div>
    </div>
  );
};

export default TransactionsView;
