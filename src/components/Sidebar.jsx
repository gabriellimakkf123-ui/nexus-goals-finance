import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Target, Wallet, Users, Zap, Download, RefreshCw } from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, exportData, resetToSampleData } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard 360°', icon: LayoutDashboard },
    { id: 'metas', label: 'Metas (PF & PJ)', icon: Target },
    { id: 'financas', label: 'Finanças (PF & PJ)', icon: Wallet },
    { id: 'clientes', label: 'CRM de Clientes', icon: Users },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--bg-glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      justifyByContent: 'space-between',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 1.75rem 0.5rem', borderBottom: '1px solid var(--bg-glass-border)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 14px var(--accent-purple-glow)'
          }}>
            <Zap size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              GOALS & FINANCE
            </span>
          </div>
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
                  background: isActive ? 'linear-gradient(90deg, rgba(157, 78, 221, 0.2), rgba(6, 182, 212, 0.1))' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--accent-cyan)' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={exportData}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem' }}
        >
          <Download size={16} /> Backup dos Dados (JSON)
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
