
import React, { useState, useRef } from 'react';
import { Transaction, TransactionType, Category, AccountType, Frequency } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onOCR?: (base64: string) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave, onOCR }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category | ''>('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState<AccountType>('Debit Card');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    onSave({
      date,
      category: category as Category,
      description: description || category,
      amount: parseFloat(amount),
      type,
      accountId,
      isRecurring,
      frequency: isRecurring ? frequency : 'once'
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onOCR) {
      const reader = new FileReader();
      reader.onloadend = () => onOCR(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[550px] bg-surface-dark rounded-3xl border border-border-green/30 shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Ação Rápida</h2>
            <p className="text-text-muted text-xs font-medium">Adicione manualmente ou escaneie um recibo.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="flex gap-2 p-1 bg-input-bg rounded-2xl">
            <button type="button" onClick={() => setType('despesa')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'despesa' ? 'bg-primary text-background-dark' : 'text-text-muted'}`}>Despesa</button>
            <button type="button" onClick={() => setType('receita')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'receita' ? 'bg-primary text-background-dark' : 'text-text-muted'}`}>Receita</button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:bg-white/5 border border-dashed border-border-green/50 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
              Escanear
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase ml-2 tracking-widest">Valor e Descrição</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xl">$</span>
              <input 
                autoFocus required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full bg-input-bg border border-border-green/30 rounded-2xl py-6 pl-10 pr-4 text-4xl font-black focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
            <input 
              type="text" placeholder="No que você gastou?" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-input-bg border border-border-green/20 rounded-xl py-3 px-4 text-sm font-medium focus:border-primary transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase ml-2">Categoria</label>
              <select required value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-input-bg border border-border-green/20 rounded-xl p-3 text-xs font-bold outline-none cursor-pointer focus:border-primary">
                <option value="" disabled>Escolha...</option>
                {type === 'despesa' 
                  ? ['Alimentação', 'Transporte', 'Utilidades', 'Compras', 'Entretenimento', 'Moradia', 'Investimento', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)
                  : <option value="Renda">Renda Mensal</option>
                }
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase ml-2">Conta</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value as any)} className="w-full bg-input-bg border border-border-green/20 rounded-xl p-3 text-xs font-bold outline-none cursor-pointer focus:border-primary">
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Poupança">Poupança</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-input-bg/50 rounded-2xl border border-border-green/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-text-muted">event_repeat</span>
              <div>
                <p className="text-xs font-bold">Transação Recorrente</p>
                <p className="text-[10px] text-text-muted">Adicionar automaticamente a cada período.</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsRecurring(!isRecurring)} className={`size-10 rounded-full flex items-center justify-center transition-all ${isRecurring ? 'bg-primary text-background-dark' : 'bg-border-green/20 text-text-muted'}`}>
              <span className="material-symbols-outlined">{isRecurring ? 'check' : 'toggle_off'}</span>
            </button>
          </div>

          {isRecurring && (
            <div className="animate-in slide-in-from-top-2">
               <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="w-full bg-input-bg border border-border-green/20 rounded-xl p-3 text-xs font-bold">
                  <option value="semanal">A cada Semana</option>
                  <option value="mensal">A cada Mês</option>
                  <option value="anual">A cada Ano</option>
               </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-bold hover:bg-white/5 rounded-2xl transition-all">Cancelar</button>
             <button type="submit" className="flex-[2] py-4 bg-primary text-background-dark text-xs font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                CONFIRMAR ENTRADA
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
