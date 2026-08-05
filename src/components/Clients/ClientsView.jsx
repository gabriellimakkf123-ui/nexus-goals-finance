import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KANBAN_STAGES } from '../../utils/initialData';
import { formatCurrency, generateId } from '../../utils/formatters';
import { Users, Plus, DollarSign, Trash2, CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail, Building, Tag, ShieldCheck, Anchor } from 'lucide-react';
import { Modal } from '../Common/Modal';

export const ClientsView = ({ isModalOpen, setIsModalOpen }) => {
  const { clients, addClient, updateClient, deleteClient, moveClientStage, generateClientPayment } = useApp();
  const [activeCrmCategory, setActiveCrmCategory] = useState('pessoal'); // 'pessoal' (Vendas Ventura PF) ou 'empresa' (Sua Empresa PJ 100%)
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = clients.filter((c) => {
    if (activeCrmCategory === 'pessoal') return c.category === 'pessoal';
    return c.category === 'empresa' || !c.category;
  });

  const calculateStageTotalVal = (stageId) => {
    return filteredClients
      .filter((c) => c.status === stageId)
      .reduce((sum, c) => {
        const isPF = c.category === 'pessoal';
        const rate = c.commissionRate || 1.25;
        const totalVal = parseFloat(c.value) || 0;
        const commissionVal = c.commissionValue || (totalVal * rate) / 100;
        return sum + (isPF ? commissionVal : totalVal);
      }, 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Selector Dual de CRM: PF Ventura vs PJ 100% */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--bg-card)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--bg-glass-border)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Aba CRM PF (Vendas Barcos Ventura com 1.25% Comissão) */}
          <button
            onClick={() => setActiveCrmCategory('pessoal')}
            className="btn"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeCrmCategory === 'pessoal' ? 'linear-gradient(135deg, #DC2626, #B91C1C)' : 'rgba(255, 255, 255, 0.05)',
              border: activeCrmCategory === 'pessoal' ? '1px solid #FF4D4D' : '1px solid var(--bg-glass-border)',
              color: '#FFFFFF',
              fontWeight: 800,
              boxShadow: activeCrmCategory === 'pessoal' ? '0 4px 15px rgba(220, 38, 38, 0.4)' : 'none'
            }}
          >
            🚤 CRM Vendas Ventura (Comissão 1,25% PF)
          </button>

          {/* Aba CRM PJ (Sua Empresa 100% Receita) */}
          <button
            onClick={() => setActiveCrmCategory('empresa')}
            className="btn"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeCrmCategory === 'empresa' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'rgba(255, 255, 255, 0.05)',
              border: activeCrmCategory === 'empresa' ? '1px solid #60A5FA' : '1px solid var(--bg-glass-border)',
              color: '#FFFFFF',
              fontWeight: 800,
              boxShadow: activeCrmCategory === 'empresa' ? '0 4px 15px rgba(37, 99, 235, 0.4)' : 'none'
            }}
          >
            🏢 CRM Sua Empresa (100% Faturamento PJ)
          </button>

        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-red-pill">
          <Plus size={16} /> Novo Card CRM
        </button>
      </div>

      {/* QUADRO KANBAN DUAL */}
      <div className="kanban-board">
        {KANBAN_STAGES.map((stage) => {
          const stageClients = filteredClients.filter((c) => c.status === stage.id);
          const stageCommissionTotal = calculateStageTotalVal(stage.id);

          return (
            <div key={stage.id} className="kanban-column">
              {/* Header da Coluna */}
              <div className="kanban-column-header">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color }} />
                    {stage.title}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {stageClients.length} {stageClients.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>

                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: stage.color }}>
                  {formatCurrency(stageCommissionTotal)}
                </span>
              </div>

              {/* Lista de Cartões Arrasta/Move */}
              <div className="kanban-cards-container">
                {stageClients.map((client) => {
                  const isPF = client.category === 'pessoal';
                  const rate = client.commissionRate || 1.25;
                  const totalSaleVal = parseFloat(client.value) || 0;
                  const commissionVal = client.commissionValue || (totalSaleVal * rate) / 100;

                  return (
                    <div
                      key={client.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--bg-glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        borderLeft: `4px solid ${isPF ? '#DC2626' : '#2563EB'}`
                      }}
                    >
                      {/* Top Card Badge & Action */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className={`badge ${isPF ? 'badge-empresa' : 'badge-pessoal'}`}>
                          {isPF ? 'VENTURA / PF' : 'EMPRESA / PJ'}
                        </span>

                        <button onClick={() => deleteClient(client.id)} className="btn-icon" style={{ padding: '0.2rem', color: '#EF4444' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Nome do Cliente */}
                      <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {client.name}
                      </h5>

                      {/* Exibição dos Valores (Preço Barco vs Comissão 1.25%) */}
                      {isPF ? (
                        <div style={{ background: 'rgba(220, 38, 38, 0.1)', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(220, 38, 38, 0.25)' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Valor Barco: <strong style={{ color: '#FFFFFF' }}>{formatCurrency(totalSaleVal)}</strong>
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#10B981', marginTop: '0.15rem' }}>
                            Comissão ({rate}%): {formatCurrency(commissionVal)}
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFFFFF' }}>
                            Contrato PJ: {formatCurrency(totalSaleVal)}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#60A5FA' }}>100% Faturamento da Empresa</span>
                        </div>
                      )}

                      {/* Mover Estágio Kanban */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                        <select
                          className="form-select"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.4rem', width: 'auto' }}
                          value={client.status}
                          onChange={(e) => moveClientStage(client.id, e.target.value)}
                        >
                          <option value="prospeccao">Prospecção</option>
                          <option value="proposta">Proposta</option>
                          <option value="fechado">Fechado (Ativo)</option>
                          <option value="concluido">Concluído</option>
                        </select>

                        {/* Botão de Lançar Comissão / Receita no Caixa */}
                        <button
                          onClick={() => generateClientPayment(client)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                          title={isPF ? 'Lançar Comissão no Caixa Pessoal' : 'Lançar Faturamento no Caixa Empresa'}
                        >
                          <DollarSign size={13} /> + Caixa
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
