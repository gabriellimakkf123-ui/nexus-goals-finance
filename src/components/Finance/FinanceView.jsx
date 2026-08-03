import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, generateId } from '../../utils/formatters';
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, ArrowRightLeft, Search, Trash2, Building2, User } from 'lucide-react';
import { Modal } from '../Common/Modal';

export const FinanceView = ({ isModalOpen, setIsModalOpen, isProlaboreOpen, setIsProlaboreOpen }) => {
  const { transactions, addTransaction, deleteTransaction, addProlaboreTransfer, clients } = useApp();
  const [selectedAccount, setSelectedAccount] = useState('todas'); // 'todas', 'empresa', 'pessoal'
  const [searchTerm, setSearchTerm] = useState('');

  // Form Lançamento Normal
  const [txForm, setTxForm] = useState({
    description: '',
    amount: '',
    type: 'receita', // 'receita', 'despesa'
    account: 'empresa', // 'empresa', 'pessoal'
    category: 'Vendas / Serviços',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  // Form Pró-Labore
  const [prolaboreAmount, setProlaboreAmount] = useState('');
  const [prolaboreDate, setProlaboreDate] = useState(new Date().toISOString().split('T')[0]);

  // Submit Lançamento
  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!txForm.description || !txForm.amount) return;

    addTransaction({
      id: generateId(),
      description: txForm.description,
      amount: parseFloat(txForm.amount),
      type: txForm.type,
      account: txForm.account,
      category: txForm.category,
      date: txForm.date,
      recurring: txForm.recurring
    });

    setIsModalOpen(false);
    setTxForm({
      description: '',
      amount: '',
      type: 'receita',
      account: 'empresa',
      category: 'Vendas / Serviços',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    });
  };

  // Submit Pró-Labore
  const handleProlaboreSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(prolaboreAmount);
    if (isNaN(val) || val <= 0) return;

    addProlaboreTransfer(val, prolaboreDate);
    setIsProlaboreOpen(false);
    setProlaboreAmount('');
  };

  // Filtragem de Transações
  const filteredTxs = transactions.filter((t) => {
    const matchAccount = selectedAccount === 'todas' || t.account === selectedAccount;
    const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAccount && matchSearch;
  });

  // Cálculos da conta selecionada
  const currentViewTxs = transactions.filter((t) => selectedAccount === 'todas' || t.account === selectedAccount);
  const totalReceitas = currentViewTxs.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalDespesas = currentViewTxs.filter((t) => t.type === 'despesa' || t.type === 'prolabore').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoFinal = totalReceitas - totalDespesas;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Seletor de Conta (PJ vs PF vs Consolidado) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 20, 32, 0.6)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)' }}>
          <button
            onClick={() => setSelectedAccount('todas')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: selectedAccount === 'todas' ? 'rgba(255, 255, 255, 0.12)' : 'transparent', color: selectedAccount === 'todas' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <Wallet size={16} /> Visão Consolidada
          </button>

          <button
            onClick={() => setSelectedAccount('empresa')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: selectedAccount === 'empresa' ? 'rgba(6, 182, 212, 0.2)' : 'transparent', color: selectedAccount === 'empresa' ? 'var(--accent-cyan)' : 'var(--text-secondary)'
            }}
          >
            <Building2 size={16} /> Conta Empresa (PJ)
          </button>

          <button
            onClick={() => setSelectedAccount('pessoal')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: selectedAccount === 'pessoal' ? 'rgba(157, 78, 221, 0.2)' : 'transparent', color: selectedAccount === 'pessoal' ? 'var(--color-pessoal)' : 'var(--text-secondary)'
            }}
          >
            <User size={16} /> Conta Pessoal (PF)
          </button>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setIsProlaboreOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <ArrowRightLeft size={16} color="var(--accent-amber)" /> Retirar Pró-Labore
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-cyan">
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* Cards de Resumo da Conta Selecionada */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Total Entradas / Receitas
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
            +{formatCurrency(totalReceitas)}
          </h3>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Total Saídas / Despesas
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.2rem' }}>
            -{formatCurrency(totalDespesas)}
          </h3>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(22, 28, 42, 0.9), rgba(157, 78, 221, 0.15))' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Saldo Final da Conta
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: saldoFinal >= 0 ? 'white' : 'var(--accent-rose)', marginTop: '0.2rem' }}>
            {formatCurrency(saldoFinal)}
          </h3>
        </div>
      </div>

      {/* Busca e Tabela de Extrato */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Extrato de Lançamentos</h3>
          
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.3rem', fontSize: '0.85rem' }}
              placeholder="Buscar por descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela de Transações */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bg-glass-border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Data</th>
                <th style={{ padding: '0.75rem 1rem' }}>Descrição</th>
                <th style={{ padding: '0.75rem 1rem' }}>Conta</th>
                <th style={{ padding: '0.75rem 1rem' }}>Categoria</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Valor (R$)</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.map((tx) => {
                const isIncome = tx.type === 'receita';
                const isProlabore = tx.type === 'prolabore';
                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'white' }}>{tx.description}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${tx.account === 'pessoal' ? 'badge-pessoal' : 'badge-empresa'}`}>
                        {tx.account}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{tx.category}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: isIncome ? 'var(--accent-emerald)' : isProlabore ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button onClick={() => deleteTransaction(tx.id)} className="btn-icon" title="Excluir" style={{ color: 'var(--accent-rose)' }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamento Normal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lançamento Financeiro">
        <form onSubmit={handleTxSubmit}>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Pagamento de Fornecedor / Venda de Serviço"
              value={txForm.description}
              onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}>
                <option value="receita">Receita (Entrada +)</option>
                <option value="despesa">Despesa (Saída -)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Conta Destino</label>
              <select className="form-select" value={txForm.account} onChange={(e) => setTxForm({ ...txForm, account: e.target.value })}>
                <option value="empresa">Empresa (PJ)</option>
                <option value="pessoal">Pessoal (PF)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={txForm.amount}
                onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-input"
                value={txForm.date}
                onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categoria</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Contrato Recorrente, Ferramentas, Moradia, Lazer"
              value={txForm.category}
              onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-cyan">Salvar Lançamento</button>
          </div>
        </form>
      </Modal>

      {/* Modal Retirada de Pró-Labore */}
      <Modal isOpen={isProlaboreOpen} onClose={() => setIsProlaboreOpen(false)} title="Retirada de Pró-Labore (Transferência PJ ➔ PF)">
        <form onSubmit={handleProlaboreSubmit}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Esta ação registrará automaticamente uma <strong>Saída por Pró-Labore</strong> no caixa da Empresa (PJ) e uma <strong>Entrada de Salário</strong> no seu caixa Pessoal (PF).
          </p>

          <div className="form-group">
            <label className="form-label">Valor da Retirada (R$)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="ex: 5000.00"
              value={prolaboreAmount}
              onChange={(e) => setProlaboreAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data da Transferência</label>
            <input
              type="date"
              className="form-input"
              value={prolaboreDate}
              onChange={(e) => setProlaboreDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsProlaboreOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Confirmar Pró-Labore</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
