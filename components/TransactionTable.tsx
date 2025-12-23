
import React from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDelete }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Alimentação': return 'restaurant';
      case 'Transporte': return 'directions_car';
      case 'Utilidades': return 'bolt';
      case 'Compras': return 'shopping_bag';
      case 'Renda': return 'payments';
      case 'Entretenimento': return 'theater_comedy';
      case 'Moradia': return 'home';
      case 'Investimento': return 'trending_up';
      default: return 'receipt_long';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-surface-dark border border-border-green rounded-xl overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-border-green flex items-center justify-between">
        <h3 className="text-white font-bold">Histórico de Transações</h3>
        <span className="text-text-muted text-xs">{transactions.length} itens</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-darker text-text-muted text-[10px] uppercase tracking-wider">
              <th className="px-6 py-3 font-bold">Categoria</th>
              <th className="px-6 py-3 font-bold">Descrição</th>
              <th className="px-6 py-3 font-bold">Data</th>
              <th className="px-6 py-3 font-bold text-right">Valor</th>
              <th className="px-6 py-3 font-bold text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-text-muted">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                    <p>Nenhuma transação encontrada com seus filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border-green hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="size-8 rounded-lg bg-background-dark border border-border-green flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base text-primary">
                          {getCategoryIcon(tx.category)}
                        </span>
                      </div>
                      <span className="text-white font-medium text-xs">{tx.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted font-medium italic">{tx.description}</td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className={`px-6 py-4 font-bold text-right ${
                    tx.type === 'receita' ? 'text-primary' : 'text-white'
                  }`}>
                    {tx.type === 'receita' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(tx.id)}
                      className="text-text-muted hover:text-red-400 p-1 rounded-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
