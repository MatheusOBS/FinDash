import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatCard from '../StatCard';
import TransactionTable from '../TransactionTable';
import { Transaction, Budget, Goal } from '../../types';

interface DashboardViewProps {
  stats: { balance: number; income: number; expenses: number; taxEstimate: number };
  currency: 'USD' | 'BRL';
  isSecureMode: boolean;
  financialInsight: string | null;
  isInsightLoading: boolean;
  handleInsightGenerations: () => void;
  chartData: { name: string; value: number }[];
  COLORS: string[];
  budgets: Budget[];
  transactions: Transaction[];
  goals: Goal[];
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  handleExportCSV: () => void;
  setIsModalOpen: (open: boolean) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  stats, currency, isSecureMode, financialInsight, isInsightLoading, handleInsightGenerations,
  chartData, COLORS, budgets, transactions, goals, setSearchQuery,
  searchQuery, handleExportCSV, setIsModalOpen, setTransactions
}) => {
  return (
    <>
      {/* Banner de Análise Inteligente - Melhoria 1 */}
      <div className="bg-gradient-to-r from-primary/10 via-background-dark to-transparent border border-primary/20 rounded-2xl p-4 flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Análise de Dados MatheusOBS</p>
            <p className="text-sm text-text-muted font-medium">{financialInsight || "Obtenha uma análise personalizada de seus hábitos de consumo."}</p>
          </div>
        </div>
        <button 
          onClick={handleInsightGenerations}
          disabled={isInsightLoading}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black transition-all disabled:opacity-50"
        >
          {isInsightLoading ? 'Analisando...' : 'GERAR INSIGHT'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard 
            title="Patrimônio Total" 
            value={isSecureMode ? '****' : `${currency === 'USD' ? '$' : 'R$'}${stats.balance.toLocaleString()}`}
            trend="+3.4%" trendType="positive" icon="account_balance" iconColor="text-primary" 
          />
         <StatCard 
            title="Renda Mensal" 
            value={isSecureMode ? '****' : `${currency === 'USD' ? '$' : 'R$'}${stats.income.toLocaleString()}`}
            trend="+12%" trendType="positive" icon="add_chart" iconColor="text-blue-400" 
          />
         <StatCard 
            title="Estimativa de Imposto" 
            value={`${currency === 'USD' ? '$' : 'R$'}${stats.taxEstimate.toLocaleString()}`}
            trend="Projetado" trendType="negative" icon="receipt" iconColor="text-yellow-400" 
          />
         <StatCard 
            title="Taxa de Poupança" 
            value={`${((stats.income - stats.expenses) / (stats.income || 1) * 100).toFixed(0)}%`}
            trend="Saudável" trendType="positive" icon="savings" iconColor="text-emerald-400" 
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Distribuição */}
        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">donut_large</span>
            Distribuição de Gastos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" onClick={(e) => setSearchQuery(e.name)}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="cursor-pointer hover:opacity-80 transition-opacity" />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c2e22', border: 'none', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orçamentos */}
        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
               <span className="material-symbols-outlined text-yellow-400">speed</span>
               Orçamentos por Categoria
            </span>
            <button className="text-[10px] text-primary hover:underline">Editar Limites</button>
          </h3>
          <div className="space-y-6">
            {budgets.map(budget => {
              const spent = transactions.filter(t => t.category === budget.category && t.type === 'despesa').reduce((s,t) => s + t.amount, 0);
              const perc = Math.min((spent / budget.limit) * 100, 100);
              return (
                <div key={budget.category} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-text-muted">{budget.category}</span>
                    <span>{perc.toFixed(0)}% <span className="text-text-muted font-normal">/ {budget.limit}</span></span>
                  </div>
                  <div className="h-2 bg-background-dark rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${perc > 90 ? 'bg-red-500' : perc > 70 ? 'bg-yellow-500' : 'bg-primary'}`} 
                      style={{ width: `${perc}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">military_tech</span>
            Objetivos de Poupança
          </h3>
          <div className="space-y-6">
            {goals.map(goal => {
               const perc = (goal.currentAmount / goal.targetAmount) * 100;
               return (
                 <div key={goal.id} className="p-4 bg-background-dark/50 rounded-xl border border-border-green/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs font-black">{goal.name}</p>
                        <p className="text-[10px] text-text-muted">Meta: {currency === 'USD' ? '$' : 'R$'}{goal.targetAmount.toLocaleString()}</p>
                      </div>
                      <span className="text-primary font-black text-xs">{perc.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-border-green/30 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${perc}%` }}></div>
                    </div>
                 </div>
               );
            })}
            <button className="w-full py-3 border-2 border-dashed border-border-green/30 rounded-xl text-xs text-text-muted hover:border-primary/50 hover:text-white transition-all">
              + Criar Novo Objetivo
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
         <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
           Histórico Recente
           {searchQuery && <button onClick={() => setSearchQuery('')} className="text-[10px] bg-primary/10 px-2 py-0.5 rounded text-primary">Limpar Filtro: {searchQuery}</button>}
         </h3>
         <div className="flex gap-2">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-1.5 bg-surface-dark border border-border-green/30 rounded-lg text-xs font-bold hover:bg-border-green/50 transition-all">
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-background-dark rounded-lg text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Adicionar
            </button>
         </div>
      </div>

      <TransactionTable 
        transactions={transactions.slice(0, 5)} 
        onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))} 
      />
    </>
  );
};

export default DashboardView;
