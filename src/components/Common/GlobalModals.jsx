import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { generateId, formatCurrency } from '../../utils/formatters';

export const GlobalModals = ({
  isGoalModalOpen, setIsGoalModalOpen,
  isTxModalOpen, setIsTxModalOpen,
  isClientModalOpen, setIsClientModalOpen,
  isProlaboreModalOpen, setIsProlaboreModalOpen,
  isCalendarModalOpen, setIsCalendarModalOpen
}) => {
  const {
    addGoal,
    addTransaction,
    addClient,
    addProlaboreTransfer,
    addEvent
  } = useApp();

  // 1. Form de Nova Meta
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'pessoal',
    targetAmount: '',
    currentAmount: '0',
    deadline: new Date().toISOString().split('T')[0]
  });

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;
    const targ = parseFloat(goalForm.targetAmount) || 0;
    const curr = parseFloat(goalForm.currentAmount) || 0;

    addGoal({
      id: generateId(),
      ...goalForm,
      targetAmount: targ,
      currentAmount: curr,
      status: targ > 0 && curr >= targ ? 'concluida' : 'em_andamento',
      checklists: []
    });

    setGoalForm({ title: '', description: '', category: 'pessoal', targetAmount: '', currentAmount: '0', deadline: new Date().toISOString().split('T')[0] });
    setIsGoalModalOpen(false);
  };

  // 2. Form de Novo Lançamento
  const [txForm, setTxForm] = useState({
    description: '',
    amount: '',
    type: 'receita',
    account: 'empresa',
    category: 'Vendas / Serviços',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!txForm.description.trim() || !txForm.amount) return;

    addTransaction({
      id: generateId(),
      ...txForm,
      amount: parseFloat(txForm.amount)
    });

    setTxForm({ description: '', amount: '', type: 'receita', account: 'empresa', category: 'Vendas / Serviços', date: new Date().toISOString().split('T')[0], recurring: false });
    setIsTxModalOpen(false);
  };

  // 3. Form de Novo Cliente (CRM Dual PF Ventura vs PJ 100%)
  const [clientForm, setClientForm] = useState({
    name: '',
    company: 'Ventura',
    email: '',
    phone: '',
    category: 'pessoal', // 'pessoal' (Venda de Barco PF) ou 'empresa' (Sua Empresa PJ 100%)
    contractType: 'Contrato Cliente Ventura',
    value: '',
    commissionRate: 1.25,
    notes: '',
    status: 'prospeccao'
  });

  const isPF = clientForm.category === 'pessoal';
  const totalValNum = parseFloat(clientForm.value) || 0;
  const rateNum = parseFloat(clientForm.commissionRate) || 1.25;
  const calculatedCommission = isPF ? (totalValNum * rateNum) / 100 : totalValNum;

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!clientForm.name.trim()) return;

    addClient({
      id: generateId(),
      ...clientForm,
      value: totalValNum,
      commissionRate: rateNum,
      commissionValue: calculatedCommission
    });

    setClientForm({
      name: '',
      company: 'Ventura',
      email: '',
      phone: '',
      category: 'pessoal',
      contractType: 'Contrato Cliente Ventura',
      value: '',
      commissionRate: 1.25,
      notes: '',
      status: 'prospeccao'
    });
    setIsClientModalOpen(false);
  };

  // 4. Form de Pró-Labore
  const [prolaboreAmount, setProlaboreAmount] = useState('');

  const handleProlaboreSubmit = (e) => {
    e.preventDefault();
    if (!prolaboreAmount || parseFloat(prolaboreAmount) <= 0) return;

    addProlaboreTransfer(prolaboreAmount);
    setProlaboreAmount('');
    setIsProlaboreModalOpen(false);
  };

  // 5. Form de Agendamento
  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'reuniao',
    category: 'empresa',
    notes: ''
  });

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    addEvent({
      id: generateId(),
      ...eventForm
    });

    setEventForm({ title: '', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'reuniao', category: 'empresa', notes: '' });
    setIsCalendarModalOpen(false);
  };

  return (
    <>
      {/* MODAL 1: Nova Meta / Sonho */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Nova Meta / Sonho">
        <form onSubmit={handleGoalSubmit}>
          <div className="form-group">
            <label className="form-label">Título do Sonho ou Meta</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Comprar Casa Própria / Lancha 55 pés"
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={goalForm.category}
                onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
              >
                <option value="pessoal">Pessoal (PF)</option>
                <option value="empresarial">Empresarial (PJ)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prazo Limite</label>
              <input
                type="date"
                className="form-input"
                value={goalForm.deadline}
                onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Valor Alvo (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="100000.00"
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor Já Acumulado (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={goalForm.currentAmount}
                onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição / Observações</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Detalhes adicionais sobre esse objetivo..."
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsGoalModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Criar Meta</button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Novo Lançamento Financeiro */}
      <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title="Novo Lançamento Financeiro">
        <form onSubmit={handleTxSubmit}>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Comissão Venda Barco Ventura / Serviço PJ"
              value={txForm.description}
              onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="12500.00"
                value={txForm.amount}
                onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Movimentação</label>
              <select
                className="form-select"
                value={txForm.type}
                onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}
              >
                <option value="receita">Receita (Entrada (+))</option>
                <option value="despesa">Despesa (Saída (-))</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Conta Destino / Origem</label>
              <select
                className="form-select"
                value={txForm.account}
                onChange={(e) => setTxForm({ ...txForm, account: e.target.value })}
              >
                <option value="pessoal">Caixa Pessoal (PF) - Comissões</option>
                <option value="empresa">Caixa Empresa (PJ) - 100% Empresa</option>
              </select>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsTxModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Lançamento</button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Novo Cliente / Lead (CRM Dual PF Ventura vs PJ 100%) */}
      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Novo Card no CRM (PF Ventura vs PJ 100%)">
        <form onSubmit={handleClientSubmit}>
          <div className="form-group">
            <label className="form-label">Tipo de Cliente / Carteira</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn"
                style={{
                  background: isPF ? 'rgba(220, 38, 38, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isPF ? '2px solid #DC2626' : '1px solid var(--bg-glass-border)',
                  color: isPF ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 700
                }}
                onClick={() => setClientForm({ ...clientForm, category: 'pessoal', contractType: 'Contrato Cliente Ventura', company: 'Ventura' })}
              >
                🚤 Pessoa Física (PF Ventura)
              </button>

              <button
                type="button"
                className="btn"
                style={{
                  background: !isPF ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: !isPF ? '2px solid #2563EB' : '1px solid var(--bg-glass-border)',
                  color: !isPF ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 700
                }}
                onClick={() => setClientForm({ ...clientForm, category: 'empresa', contractType: 'Mensalidade Recorrente', company: 'Sua Empresa PJ' })}
              >
                🏢 Pessoa Jurídica (PJ 100%)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome do Cliente</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Carlos Eduardo / João Silva"
              value={clientForm.name}
              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
              required
            />
          </div>

          {isPF ? (
            /* Campos Específicos de Pessoa Física (Venda de Barco Ventura) */
            <div style={{ background: 'rgba(220, 38, 38, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.3)', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Valor Total da Venda / Barco (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="ex: 1000000.00 (1 Milhão)"
                  value={clientForm.value}
                  onChange={(e) => setClientForm({ ...clientForm, value: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Taxa de Comissão (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={clientForm.commissionRate}
                    onChange={(e) => setClientForm({ ...clientForm, commissionRate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sua Comissão Estimada</label>
                  <div style={{
                    padding: '0.6rem 0.85rem',
                    background: '#090B12',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius-sm)',
                    color: '#10B981',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    {formatCurrency(calculatedCommission)}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Contrato / Origem</label>
                <select
                  className="form-select"
                  value={clientForm.contractType}
                  onChange={(e) => setClientForm({ ...clientForm, contractType: e.target.value })}
                >
                  <option value="Contrato Cliente Ventura">Contrato Cliente Ventura</option>
                  <option value="Vendas Ventura">Vendas Ventura</option>
                  <option value="Venda de Embarcação">Venda de Embarcação</option>
                  <option value="Projeto Pontual">Projeto Pontual</option>
                </select>
              </div>
            </div>
          ) : (
            /* Campos Específicos de Pessoa Jurídica (Sua Empresa 100%) */
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.3)', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Valor do Contrato PJ (100% Sua Empresa) (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="ex: 5000.00"
                  value={clientForm.value}
                  onChange={(e) => setClientForm({ ...clientForm, value: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Modelo de Receita PJ</label>
                <select
                  className="form-select"
                  value={clientForm.contractType}
                  onChange={(e) => setClientForm({ ...clientForm, contractType: e.target.value })}
                >
                  <option value="mensalidade">Mensalidade Recorrente (MRR)</option>
                  <option value="projeto_pontual">Projeto Pontual</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Etapa no Funil Kanban</label>
            <select
              className="form-select"
              value={clientForm.status}
              onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
            >
              <option value="prospeccao">Prospecção (Leads)</option>
              <option value="proposta">Proposta Enviada</option>
              <option value="fechado">Contrato Fechado (Ativo)</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsClientModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Cadastrar no CRM</button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: Transferência de Pró-Labore */}
      <Modal isOpen={isProlaboreModalOpen} onClose={() => setIsProlaboreModalOpen(false)} title="Retirar Pró-Labore (Empresa PJ ➔ Pessoal PF)">
        <form onSubmit={handleProlaboreSubmit}>
          <div className="form-group">
            <label className="form-label">Valor a Retirar (R$)</label>
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

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Esta operação irá deduzir o valor do caixa da <strong>Empresa (PJ)</strong> e adicionar automaticamente na sua conta <strong>Pessoal (PF)</strong>.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setIsProlaboreModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#F59E0B', borderColor: '#F59E0B' }}>Efetuar Transferência</button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: Novo Agendamento */}
      <Modal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} title="Novo Agendamento na Agenda">
        <form onSubmit={handleEventSubmit}>
          <div className="form-group">
            <label className="form-label">Título do Compromisso</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Reunião de Fechamento / Visita Técnica Ventura"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-input"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horário</label>
              <input
                type="time"
                className="form-input"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsCalendarModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Agendar Horário</button>
          </div>
        </form>
      </Modal>
    </>
  );
};
