import React from 'react';

interface SettingsViewProps {
  currency: 'USD' | 'BRL';
  setCurrency: (currency: 'USD' | 'BRL') => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  isSecureMode: boolean;
  setIsSecureMode: (isSecure: boolean) => void;
  handleExportCSV: () => void;
  setTransactions: (transactions: any[]) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  currency, setCurrency, isDarkMode, setIsDarkMode, isSecureMode, setIsSecureMode, handleExportCSV, setTransactions
}) => {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black tracking-tight">Preferências do Sistema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">payments</span>
            Moeda Preferencial
          </h3>
          <div className="flex gap-2 p-1 bg-background-dark rounded-xl">
            <button 
              onClick={() => setCurrency('USD')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-primary text-background-dark' : 'text-text-muted'}`}
            >
              USD ($)
            </button>
            <button 
              onClick={() => setCurrency('BRL')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currency === 'BRL' ? 'bg-primary text-background-dark' : 'text-text-muted'}`}
            >
              BRL (R$)
            </button>
          </div>
        </div>

        <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-400">palette</span>
            Personalização de Tema
          </h3>
          <div className="flex items-center justify-between p-3 bg-background-dark rounded-xl border border-border-green/10">
            <span className="text-xs font-bold text-text-muted">Modo Escuro</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 size-4 bg-background-dark rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-dark border border-border-green/30 rounded-2xl p-8">
        <h3 className="text-sm font-bold mb-8">Segurança e Privacidade</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold">Modo Seguro (Privacidade)</p>
              <p className="text-[10px] text-text-muted">Ocultar valores monetários nas telas principais.</p>
            </div>
            <button 
              onClick={() => setIsSecureMode(!isSecureMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isSecureMode ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 size-4 bg-background-dark rounded-full transition-all ${isSecureMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="h-px bg-border-green/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold">Exportar todos os dados (CSV)</p>
              <p className="text-[10px] text-text-muted">Baixe um backup completo de suas transações.</p>
            </div>
            <button onClick={handleExportCSV} className="text-xs font-black text-primary hover:underline">EXPORTAR AGORA</button>
          </div>
          <div className="h-px bg-border-green/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-400">Limpar todos os registros</p>
              <p className="text-[10px] text-text-muted">Remover permanentemente todos os dados locais.</p>
            </div>
            <button 
              onClick={() => {
                if(confirm('Tem certeza? Esta ação não pode ser desfeita.')) {
                  setTransactions([]);
                }
              }}
              className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-black hover:bg-red-500/10 transition-all"
            >
              ZERAR SISTEMA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
