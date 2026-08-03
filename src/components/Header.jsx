import React from 'react';
import { useApp } from '../context/AppContext';
import { isDatabaseConnected } from '../services/supabase';
import { Plus, ArrowRightLeft, Search, Bell, Calendar as CalendarIcon, Database, User } from 'lucide-react';

export const Header = ({ onOpenGoalModal, onOpenTxModal, onOpenClientModal, onOpenProlaboreModal, onOpenCalendarModal, onOpenDbModal }) => {
  const { activeTab } = useApp();
  const isDbConnected = isDatabaseConnected();

  const headerInfo = {
    dashboard: { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' },
    agenda: { title: 'Agenda & Tarefas', subtitle: 'Compromissos e horários (PF / PJ)' },
    metas: { title: 'Metas & Objetivos', subtitle: 'Acompanhamento de objetivos pessoais e empresariais' },
    financas: { title: 'Financeiro', subtitle: 'Gestão de caixas e entradas/saídas (PF / PJ)' },
    clientes: { title: 'Clientes (CRM Dual)', subtitle: 'Pipeline Kanban e gestão de relacionamentos' }
  };

  const current = headerInfo[activeTab] || { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' };

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      marginBottom: '1.75rem'
    }}>
      {/* Top Utility Bar (Search, Notifications, Profile, Date Range) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Title & Subtitle */}
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
            {current.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {current.subtitle}
          </p>
        </div>

        {/* User Badge, Bell, Calendar Date Range Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          <button className="btn-icon" title="Buscar">
            <Search size={16} />
          </button>

          {/* Notificação com Badge Vermelha */}
          <div style={{ position: 'relative' }}>
            <button className="btn-icon" title="Notificações">
              <Bell size={16} />
            </button>
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: '#DC2626',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </span>
          </div>

          {/* Data Pill do Design */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.9rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: '#FFFFFF',
            fontWeight: 600
          }}>
            <CalendarIcon size={14} color="var(--text-secondary)" />
            <span>01 - 31 Agosto, 2026</span>
          </div>

          {/* Perfil do Usuário */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: '100px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #DC2626, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              GL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', lineHeight: '1.1' }}>Gabriel Lima</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Consultor Náutico</span>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Action Buttons Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenDbModal}
          className="btn btn-secondary"
          style={{
            fontSize: '0.82rem',
            borderColor: isDbConnected ? 'rgba(16, 185, 129, 0.4)' : undefined,
            color: isDbConnected ? 'var(--accent-emerald)' : 'var(--text-secondary)'
          }}
        >
          <Database size={15} color={isDbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)'} /> {isDbConnected ? 'Cloud Ativo' : 'Banco Cloud'}
        </button>

        <button onClick={onOpenProlaboreModal} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
          <ArrowRightLeft size={15} color="var(--accent-amber)" /> Retirar Pró-Labore
        </button>

        <button onClick={onOpenCalendarModal} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Agendar
        </button>

        <button onClick={onOpenGoalModal} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Meta
        </button>

        <button onClick={onOpenTxModal} className="btn btn-cyan" style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Lançamento
        </button>

        <button onClick={onOpenClientModal} className="btn btn-emerald" style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> CRM
        </button>
      </div>
    </header>
  );
};
