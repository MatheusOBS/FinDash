
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import TransactionTable from './components/TransactionTable';
import AddTransactionModal from './components/AddTransactionModal';
import { Transaction, Category, AccountType, Budget, Goal, Frequency } from './types';

import DashboardView from './components/views/DashboardView';
import TransactionsView from './components/views/TransactionsView';
import ReportsView from './components/views/ReportsView';
import SettingsView from './components/views/SettingsView';

const COLORS = ['#13ec5b', '#0f7d34', '#34d399', '#10b981', '#059669', '#064e3b'];

const App: React.FC = () => {
  // --- State & Persistence ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('findash_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('findash_budgets');
    return saved ? JSON.parse(saved) : [
      { category: 'Alimentação', limit: 500 },
      { category: 'Transporte', limit: 300 },
      { category: 'Compras', limit: 400 }
    ];
  });
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('findash_goals');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'Carro Novo', targetAmount: 20000, currentAmount: 5000 }];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccount, setActiveAccount] = useState<AccountType | 'All'>('All');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [financialInsight, setFinancialInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSecureMode, setIsSecureMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('findash_transactions', JSON.stringify(transactions));
    localStorage.setItem('findash_budgets', JSON.stringify(budgets));
    localStorage.setItem('findash_goals', JSON.stringify(goals));
  }, [transactions, budgets, goals]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setIsModalOpen(true); }
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); document.getElementById('search-input')?.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Calculations ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAccount = activeAccount === 'All' || t.accountId === (activeAccount as any);
      return matchesSearch && matchesAccount;
    });
  }, [transactions, searchQuery, activeAccount]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0);
    const taxEstimate = expenses * 0.08; // 8% simple estimate
    return { balance: income - expenses, income, expenses, taxEstimate };
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    filteredTransactions.filter(t => t.type === 'despesa').forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // --- Analytical Logic (Financial Insight Engine) ---
  const handleInsightGenerations = async () => {
    setIsInsightLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Analise objetivamente estas despesas: ${JSON.stringify(transactions.slice(0, 15))}. Forneça uma estratégia prática de economia de 10% para o próximo ciclo. Responda em tom profissional e direto, máximo 20 palavras. Idioma: Português do Brasil.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setFinancialInsight(response.text);
    } catch (e) {
      setFinancialInsight("Analise seus gastos fixos para encontrar redundâncias e otimizar o fluxo de caixa.");
    } finally { setIsInsightLoading(false); }
  };

  const handleOCRScan = async (base64Image: string) => {
    setIsInsightLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: "Extrair do comprovante: valor (apenas número), descrição, categoria (Alimentação, Compras, Transporte, Utilidades, Moradia, Entretenimento, Outros). Retornar estritamente em JSON." }
        ]
      });
      const data = JSON.parse(response.text || '{}');
      if (data.amount) {
        handleAddTransaction({
          amount: data.amount,
          description: data.description || "Entrada Digitalizada",
          category: data.category || "Outros",
          type: 'despesa',
          date: new Date().toISOString().split('T')[0],
          accountId: 'Cartão de Débito'
        });
      }
    } catch (e) { console.error("Processamento falhou", e); }
    finally { setIsInsightLoading(false); }
  };

  // --- Handlers ---
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = { ...newTx, id: crypto.randomUUID() };
    setTransactions([tx, ...transactions]);
  };

  const handleExportCSV = () => {
    const headers = "Data,Descrição,Categoria,Valor,Tipo,Conta\n";
    const rows = transactions.map(t => `${t.date},${t.description},${t.category},${t.amount},${t.type},${t.accountId}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_matheusobs_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const toggleSecureMode = () => setIsSecureMode(!isSecureMode);

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 ${isDarkMode ? 'bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border-green/30 shrink-0 backdrop-blur-md z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-xs w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
              <input 
                id="search-input"
                type="text" 
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-input-bg border border-border-green/30 rounded-full py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
              />
            </div>
            <select 
              value={activeAccount} 
              onChange={(e) => setActiveAccount(e.target.value as any)}
              className="bg-surface-dark border border-border-green/30 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer hover:bg-white/5 transition-all outline-none"
            >
              <option value="All">Todas as Contas</option>
              {['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'Poupança'].map(acc => (
                <option key={acc} value={acc}>{acc}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrency(currency === 'USD' ? 'BRL' : 'USD')} className="text-[10px] font-black px-2 py-1 border border-border-green/30 rounded-md hover:bg-primary/10 hover:text-primary transition-all">
              {currency}
            </button>
            <button onClick={toggleSecureMode} className={`material-symbols-outlined text-lg transition-all ${isSecureMode ? 'text-primary' : 'text-text-muted hover:text-white'}`}>
              {isSecureMode ? 'visibility_off' : 'visibility'}
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="material-symbols-outlined text-lg text-text-muted hover:text-white transition-all">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </button>
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-background-dark font-black text-[10px] shadow-lg shadow-primary/20">MO</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              stats={stats}
              currency={currency}
              isSecureMode={isSecureMode}
              financialInsight={financialInsight}
              isInsightLoading={isInsightLoading}
              handleInsightGenerations={handleInsightGenerations}
              chartData={chartData}
              COLORS={COLORS}
              budgets={budgets}
              transactions={filteredTransactions}
              goals={goals}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              handleExportCSV={handleExportCSV}
              setIsModalOpen={setIsModalOpen}
              setTransactions={setTransactions}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView 
              transactions={filteredTransactions}
              handleExportCSV={handleExportCSV}
              setIsModalOpen={setIsModalOpen}
              setTransactions={setTransactions}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              monthlyExpenses={[
                { month: 'Jan', amount: stats.expenses * 0.8 },
                { month: 'Fev', amount: stats.expenses * 0.9 },
                { month: 'Mar', amount: stats.expenses }
              ]}
              categorySpent={chartData}
              financialInsight={financialInsight}
              isInsightLoading={isInsightLoading}
              handleInsightGenerations={handleInsightGenerations}
              currency={currency}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              currency={currency}
              setCurrency={setCurrency}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              isSecureMode={isSecureMode}
              setIsSecureMode={setIsSecureMode}
              handleExportCSV={handleExportCSV}
              setTransactions={setTransactions}
            />
          )}
          
        </div>

        <nav className="md:hidden flex items-center justify-around h-16 bg-surface-dark border-t border-border-green/30 px-4 z-30">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-text-muted opacity-50'}`}>
            <span className="material-symbols-outlined text-xl material-fill">home</span>
            <span className="text-[10px] font-black uppercase">Início</span>
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'transactions' ? 'text-primary scale-110' : 'text-text-muted opacity-50'}`}>
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            <span className="text-[10px] font-black uppercase">Extrato</span>
          </button>
          <div className="relative -top-6">
             <button onClick={() => setIsModalOpen(true)} className="size-14 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-2xl shadow-primary/40 active:scale-90 transition-all">
                <span className="material-symbols-outlined text-3xl font-black">add</span>
             </button>
          </div>
          <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'reports' ? 'text-primary scale-110' : 'text-text-muted opacity-50'}`}>
            <span className="material-symbols-outlined text-xl">analytics</span>
            <span className="text-[10px] font-black uppercase">Análise</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? 'text-primary scale-110' : 'text-text-muted opacity-50'}`}>
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-[10px] font-black uppercase">Ajustes</span>
          </button>
        </nav>

        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddTransaction}
          onOCR={handleOCRScan}
        />
      </main>
    </div>
  );
};

export default App;
