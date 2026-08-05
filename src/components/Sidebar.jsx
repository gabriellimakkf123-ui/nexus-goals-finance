import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Target, Wallet, Users, Calendar as CalendarIcon,
  Settings, Moon, Sun
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Sidebar = ({
  onOpenDbModal,
  onOpenTxModal,
  onOpenClientModal
}) => {
  const { activeTab, setActiveTab, darkMode, toggleDarkMode } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'metas', label: 'Metas & Objetivos', icon: Target },
    { id: 'financas', label: 'Financeiro (PF & PJ)', icon: Wallet },
    { id: 'clientes', label: 'Clientes (CRM Dual)', icon: Users },
    { id: 'agenda', label: 'Agenda & Tarefas', icon: CalendarIcon },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, action: onOpenDbModal },
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside style={{
      width: '280px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--bg-glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div>
        {/* Logo Superior Esquerda Centralizada */}
        <div style={{
          padding: '0.5rem 0.25rem 1.5rem 0.25rem',
          borderBottom: '1px solid var(--bg-glass-border)',
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          height: '130px',
          overflow: 'hidden',
          width: '100%'
        }}>
          <img
            src={logoImg}
            alt="Vertex Digital"
            style={{
              height: '100%',
              width: 'auto',
              maxWidth: '280px',
              objectFit: 'contain',
              transform: 'scale(3.2)',
              transformOrigin: 'center center',
              filter: 'drop-shadow(0 6px 20px rgba(220, 38, 38, 0.6))'
            }}
          />
        </div>

        {/* Links de Navegação Principal */}
        <nav style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id + item.label}
                onClick={() => handleNavClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid #DC2626' : '1px solid transparent',
                  background: isActive ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 15px rgba(220, 38, 38, 0.3)' : 'none'
                }}
              >
                <Icon size={18} color={isActive ? '#DC2626' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner com Marca Vertex Digital */}
      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(9, 11, 18, 0.8))',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ color: '#DC2626', fontWeight: 900, fontSize: '0.9rem' }}>V</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em' }}>VERTEX DIGITAL</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            SOLUÇÕES QUE GERAM RESULTADOS REAIS.
          </p>
        </div>

        {/* Toggle Modo Escuro / Claro */}
        <div
          onClick={toggleDarkMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            border: '1px solid var(--bg-glass-border)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {darkMode ? <Moon size={15} color="#DC2626" /> : <Sun size={15} color="#F59E0B" />}
            {darkMode ? 'Modo Escuro' : 'Modo Claro'}
          </span>
          <div
            style={{
              width: '38px',
              height: '20px',
              borderRadius: '100px',
              background: darkMode ? '#DC2626' : 'rgba(0, 0, 0, 0.15)',
              position: 'relative',
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
