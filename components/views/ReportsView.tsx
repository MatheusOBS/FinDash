import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Transaction } from '../../types';

interface ReportsViewProps {
  monthlyExpenses: any[];
  categorySpent: any[];
  financialInsight: string | null;
  isInsightLoading: boolean;
  handleInsightGenerations: () => void;
  currency: string;
}

const ReportsView: React.FC<ReportsViewProps> = ({
  monthlyExpenses, categorySpent, financialInsight, isInsightLoading, handleInsightGenerations, currency
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight">Análise Financeira</h2>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-dark border border-border-green/30 rounded-lg text-xs font-bold">
              Este Mês
              <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6 h-80">
          <h3 className="text-sm font-bold mb-6">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={categorySpent}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#41ff78" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#41ff78" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#ffffff50" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0a1a0f', border: '1px solid #41ff7830', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="#41ff78" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6 h-80">
          <h3 className="text-sm font-bold mb-6">Fluxo de Caixa (Mensal)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#ffffff50" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#ffffff50" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ background: '#0a1a0f', border: 'none', borderRadius: '12px' }} />
              <Bar dataKey="amount" fill="#41ff78" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-surface-dark to-background-dark border border-border-green/30 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-8xl text-primary">psychology</span>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-primary/20 rounded-full">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Consultoria Inteligente</span>
            </div>
          </div>
          <h3 className="text-3xl font-black mb-4">Consultoria MatheusOBS</h3>
          <p className="text-text-muted leading-relaxed mb-8">
            Nossa tecnologia de análise profunda processa seus hábitos financeiros para entregar recomendações 
            personalizadas que ajudam você a economizar mais e investir melhor.
          </p>
          
          <div className="min-h-[100px] p-6 bg-background-dark/50 rounded-2xl border border-border-green/10 mb-8">
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              {financialInsight || "Obtenha uma análise profissional de seus dados financeiros."}
            </p>
          </div>

          <button 
            onClick={handleInsightGenerations}
            disabled={isInsightLoading}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-background-dark rounded-2xl font-black text-sm hover:scale-105 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">analytics</span>
            {isInsightLoading ? 'Analisando...' : 'GERAR NOVA ANÁLISE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
