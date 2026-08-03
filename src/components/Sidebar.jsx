import React from 'react';
import { useApp } from '../context/AppContext';
import { isDatabaseConnected } from '../services/supabase';
import { LayoutDashboard, Target, Wallet, Users, Calendar as CalendarIcon, Download, RefreshCw, Database } from 'lucide-react';

export const Sidebar = ({ onOpenDbModal }) => {
  const { activeTab, setActiveTab, exportData, resetToSampleData } = useApp();
  const isDbConnected = isDatabaseConnected();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard 360°', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda & Calendário', icon: CalendarIcon },
    { id: 'metas', label: 'Metas (PF & PJ)', icon: Target },
    { id: 'financas', label: 'Finanças (PF & PJ)', icon: Wallet },
    { id: 'clientes', label: 'CRM Dual (PF & PJ)', icon: Users },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--bg-glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      {/* Brand Header com Logo Oficial */}
      <div>
        <div style={{
          padding: '0.5rem 0.5rem 1.5rem 0.5rem',
          borderBottom: '1px solid var(--bg-glass-border)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/logo.png"
            alt="Vertex Digital"
            style={{
              maxHeight: '48px',
              maxWidth: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(220, 38, 38, 0.25))'
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.25), rgba(220, 38, 38, 0.15))' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent'
                }}
              >
                <Icon size={20} color={isActive ? '#2563EB' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & DB Status */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        {/* Status do Banco de Dados */}
        <button
          onClick={onOpenDbModal}
          className="btn btn-secondary"
          style={{
            width: '100%',
            justify: 'flex-start',
            fontSize: '0.8rem',
            borderColor: isDbConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            color: isDbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)'
          }}
        >
          <Database size={16} /> Banco: {isDbConnected ? 'Cloud PostgreSQL' : 'Local'}
        </button>

        <button
          onClick={exportData}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem' }}
        >
          <Download size={16} /> Backup JSON
        </button>

        <button
          onClick={resetToSampleData}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          <RefreshCw size={16} /> Restaurar Demo
        </button>
      </div>
    </aside>
  );
};
