
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: 'dashboard' },
    { id: 'transactions', label: 'Transações', icon: 'receipt_long' },
    { id: 'reports', label: 'Relatórios', icon: 'analytics' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border-green bg-background-dark h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-[#0f7d34] flex items-center justify-center text-background-dark">
          <span className="material-symbols-outlined text-2xl font-bold material-fill">account_balance_wallet</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-lg font-bold leading-tight">FinDash</h1>
          <p className="text-text-muted text-xs font-normal">Expense Control</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
              activeTab === item.id 
                ? 'bg-primary/20 text-primary' 
                : 'text-text-muted hover:bg-border-green hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === item.id ? 'material-fill' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-sm ${activeTab === item.id ? 'font-semibold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border-green">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-border-green cursor-pointer transition-colors">
          <div 
            className="size-10 rounded-full bg-cover bg-center" 
            style={{ backgroundImage: `url('https://picsum.photos/id/64/100/100')` }}
          />
          <div className="flex flex-col overflow-hidden">
            <p className="text-white text-sm font-bold truncate">Matheus</p>
            <p className="text-text-muted text-xs truncate">Ver Perfil</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
