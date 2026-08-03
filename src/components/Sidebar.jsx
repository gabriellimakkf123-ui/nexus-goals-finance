import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isDatabaseConnected } from '../services/supabase';
import {
  LayoutDashboard, Target, Wallet, Users, Calendar as CalendarIcon,
  Download, RefreshCw, Database, Moon
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Sidebar = ({ onOpenDbModal }) => {
  const { activeTab, setActiveTab, exportData, resetToSampleData } = useApp();
  const isDbConnected = isDatabaseConnected();
  const [darkMode, setDarkMode] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'metas', label: 'Metas & Objetivos', icon: Target },
    { id: 'financas', label: 'Financeiro (PF & PJ)', icon: Wallet },
    { id: 'clientes', label: 'Clientes (CRM Dual)', icon: Users },
    { id: 'agenda', label: 'Agenda & Tarefas', icon: CalendarIcon },
  ];

  return (
    <aside style={{
      width: '270px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--bg-glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div>
        {/* Logo Vertex Digital em Tamanho Gigante & Destaque Máximo */}
        <div style={{
          padding: '0.25rem 0.25rem 1.25rem 0.25rem',
          borderBottom: '1px solid var(--bg-glass-border)',
          display: 'flex',
          alignItems: 'center',
          height: '90px',
          overflow: 'hidden'
        }}>
          <img
            src={logoImg}
            alt="Vertex Digital"
            style={{
              height: '100%',
              width: 'auto',
              maxWidth: '260px',
              objectFit: 'contain',
              transform: 'scale(2.2)',
              transformOrigin: 'left center',
              filter: 'drop-shadow(0 6px 16px rgba(220, 38, 38, 0.45))'
            }}
          />
        </div>

        {/* Links de Navegação Principal */}
        <nav style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid #DC2626' : '3px solid transparent'
                }}
              >
                <Icon size={18} color={isActive ? '#DC2626' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & Toggle Modo Escuro */}
      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        
        {/* Status Banco Cloud */}
        <button
          onClick={onOpenDbModal}
          className="btn btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            fontSize: '0.78rem',
            borderColor: isDbConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            color: isDbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)'
          }}
        >
          <Database size={15} /> Banco: {isDbConnected ? 'Cloud PostgreSQL' : 'Local'}
        </button>

        <button
          onClick={exportData}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem' }}
        >
          <Download size={15} /> Backup JSON
        </button>

        {/* Toggle Modo Escuro */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Moon size={15} color="var(--text-muted)" /> Modo Escuro
          </span>
          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: '38px',
              height: '20px',
              borderRadius: '100px',
              background: darkMode ? '#DC2626' : 'rgba(255, 255, 255, 0.2)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: darkMode ? '20px' : '2px',
              transition: 'left 0.2s ease'
            }} />
          </div>
        </div>
      </div>
    </aside>
  );
};
