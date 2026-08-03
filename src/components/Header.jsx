import React from 'react';
import { useApp } from '../context/AppContext';
import { getCurrentMonthYear } from '../utils/formatters';
import { isDatabaseConnected } from '../services/supabase';
import { Plus, ArrowRightLeft, Calendar, Database } from 'lucide-react';

export const Header = ({ onOpenGoalModal, onOpenTxModal, onOpenClientModal, onOpenProlaboreModal, onOpenCalendarModal, onOpenDbModal }) => {
  const { activeTab } = useApp();
  const isDbConnected = isDatabaseConnected();

  const titles = {
    dashboard: 'Visão Geral & Dashboard 360°',
    agenda: 'Agenda & Calendário Interativo (PF / PJ)',
    metas: 'Metas Pessoais & Empresariais',
    financas: 'Gestão Financeira (PF / PJ)',
    clientes: 'CRM Dual de Clientes (PF / PJ)'
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.75rem',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'white' }}>
          {titles[activeTab] || 'Vertex Digital'}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Calendar size={14} color="var(--accent-cyan)" />
          <span style={{ textTransform: 'capitalize' }}>{getCurrentMonthYear()}</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenDbModal}
          className="btn btn-secondary"
          style={{
            fontSize: '0.85rem',
            borderColor: isDbConnected ? 'rgba(16, 185, 129, 0.4)' : undefined,
            color: isDbConnected ? 'var(--accent-emerald)' : 'var(--text-secondary)'
          }}
        >
          <Database size={16} color={isDbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)'} /> {isDbConnected ? 'Cloud Ativo' : 'Banco Cloud'}
        </button>

        <button onClick={onOpenProlaboreModal} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
          <ArrowRightLeft size={16} color="var(--accent-amber)" /> Retirar Pró-Labore
        </button>

        {activeTab === 'agenda' && (
          <button onClick={onOpenCalendarModal} className="btn btn-cyan">
            <Plus size={18} /> Novo Agendamento
          </button>
        )}

        {activeTab === 'metas' && (
          <button onClick={onOpenGoalModal} className="btn btn-primary">
            <Plus size={18} /> Nova Meta
          </button>
        )}

        {activeTab === 'financas' && (
          <button onClick={onOpenTxModal} className="btn btn-cyan">
            <Plus size={18} /> Novo Lançamento
          </button>
        )}

        {activeTab === 'clientes' && (
          <button onClick={onOpenClientModal} className="btn btn-emerald">
            <Plus size={18} /> Novo Cliente / Contato
          </button>
        )}

        {activeTab === 'dashboard' && (
          <>
            <button onClick={onOpenCalendarModal} className="btn btn-secondary" style={{ padding: '0.55rem 0.9rem', fontSize: '0.8rem' }}>
              <Plus size={16} /> Agendar
            </button>
            <button onClick={onOpenGoalModal} className="btn btn-primary" style={{ padding: '0.55rem 0.9rem', fontSize: '0.8rem' }}>
              <Plus size={16} /> Meta
            </button>
            <button onClick={onOpenTxModal} className="btn btn-cyan" style={{ padding: '0.55rem 0.9rem', fontSize: '0.8rem' }}>
              <Plus size={16} /> Lançamento
            </button>
            <button onClick={onOpenClientModal} className="btn btn-emerald" style={{ padding: '0.55rem 0.9rem', fontSize: '0.8rem' }}>
              <Plus size={16} /> CRM
            </button>
          </>
        )}
      </div>
    </header>
  );
};
