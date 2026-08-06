import React from 'react';
import { useApp } from '../context/AppContext';
import { isDatabaseConnected } from '../services/supabase';
import { Plus, ArrowRightLeft, Search, Bell, Calendar as CalendarIcon, Database, LogOut } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Header = ({
  onOpenGoalModal,
  onOpenTxModal,
  onOpenClientModal,
  onOpenProlaboreModal,
  onOpenCalendarModal,
  onOpenDbModal
}) => {
  const { activeTab, userSession, logout } = useApp();
  const isDbConnected = isDatabaseConnected();
  const userName = userSession?.user?.name || 'Gabriel Lima';
  const userRole = userSession?.user?.role || 'Consultor Náutico';

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      marginBottom: '1.75rem',
      position: 'relative'
    }}>
      {/* Top Banner Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        
        {/* Left Greeting */}
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.1rem' }}>
            Bem-vindo de volta,
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
            {userName.toUpperCase()}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Visão geral do seu negócio
          </p>
        </div>

        {/* Banner de Logo Central Vertex Digital */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 3rem',
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.45), rgba(12, 15, 25, 0.7) 85%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(220, 38, 38, 0.5)',
          boxShadow: '0 0 45px rgba(220, 38, 38, 0.45)',
          height: '160px',
          maxWidth: '750px',
          flex: '1 1 500px',
          overflow: 'visible',
          margin: '0 1rem'
        }}>
          <img
            src={logoImg}
            alt="Vertex Digital Banner"
            style={{
              height: '120px',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              transform: 'scale(3.7)',
              transformOrigin: 'center center',
              filter: 'drop-shadow(0 0 35px rgba(220, 38, 38, 0.95))'
            }}
          />
        </div>

        {/* Right Header Utilities (Search, Bell, Date Pill, Profile Badge + Standalone Logout Button) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          <button className="btn-icon" title="Buscar">
            <Search size={16} />
          </button>

          {/* Bell Notification Badge */}
          <div style={{ position: 'relative' }}>
            <button className="btn-icon" title="Notificações">
              <Bell size={16} />
            </button>
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#DC2626',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 900,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #06080E',
              boxShadow: '0 0 8px rgba(220, 38, 38, 0.8)'
            }}>
              3
            </span>
          </div>

          {/* Date Range Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 0.95rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: '#FFFFFF',
            fontWeight: 600,
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.15)'
          }}>
            <CalendarIcon size={14} color="var(--text-secondary)" />
            <span>01 - 31 Agosto, 2026</span>
          </div>

          {/* Profile Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.4rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '100px',
            boxShadow: '0 0 12px rgba(220, 38, 38, 0.2)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #DC2626, #991B1B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.6)'
            }}>
              GL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', lineHeight: '1.1' }}>{userName}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{userRole}</span>
            </div>
          </div>

          {/* Botão Independente de SAIR (Logout) */}
          <button
            type="button"
            onClick={handleLogoutClick}
            className="btn btn-red-pill"
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)'
            }}
            title="Sair do Sistema (Logout)"
          >
            <LogOut size={15} /> Sair
          </button>

        </div>
      </div>

      {/* Row of Action Pill Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        
        {/* Cloud Ativo */}
        <button
          onClick={onOpenDbModal}
          className="btn btn-pill-dark"
          style={{
            fontSize: '0.82rem',
            borderColor: isDbConnected ? 'rgba(220, 38, 38, 0.6)' : 'rgba(245, 158, 11, 0.4)',
            color: isDbConnected ? '#FF4D4D' : '#F59E0B'
          }}
        >
          <Database size={15} /> Cloud Ativo
        </button>

        {/* Retirar Pró-Labore */}
        <button onClick={onOpenProlaboreModal} className="btn btn-pill-dark" style={{ fontSize: '0.82rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}>
          <ArrowRightLeft size={15} /> Retirar Pró-Labore
        </button>

        {/* + Agendar */}
        <button onClick={onOpenCalendarModal} className="btn btn-pill-dark" style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Agendar
        </button>

        {/* + Meta (Red Pill) */}
        <button onClick={onOpenGoalModal} className="btn btn-red-pill">
          <Plus size={15} /> Meta
        </button>

        {/* + Lançamento (Red Pill) */}
        <button onClick={onOpenTxModal} className="btn btn-red-pill">
          <Plus size={15} /> Lançamento
        </button>

        {/* + CRM (Red Pill) */}
        <button onClick={onOpenClientModal} className="btn btn-red-pill">
          <Plus size={15} /> CRM
        </button>

      </div>
    </header>
  );
};
