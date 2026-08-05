import React from 'react';
import { useApp } from '../context/AppContext';
import { isDatabaseConnected } from '../services/supabase';
import { Plus, ArrowRightLeft, Search, Bell, Calendar as CalendarIcon, Database } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Header = ({
  onOpenGoalModal,
  onOpenTxModal,
  onOpenClientModal,
  onOpenProlaboreModal,
  onOpenCalendarModal,
  onOpenDbModal
}) => {
  const { activeTab } = useApp();
  const isDbConnected = isDatabaseConnected();

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      marginBottom: '1.75rem',
      position: 'relative'
    }}>
      {/* Top Banner Row (Greeting Left, Huge Central Header Banner, Right Profile Utilities) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        
        {/* Left Greeting */}
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.1rem' }}>
            Bem-vindo de volta,
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
            GABRIEL LIMA
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Visão geral do seu negócio
          </p>
        </div>

        {/* Central Logo Header Banner igual ao Print */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.5rem 1.5rem',
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.25), transparent 70%)',
          borderRadius: 'var(--radius-md)'
        }}>
          <img
            src={logoImg}
            alt="Vertex Digital Banner"
            style={{
              height: '70px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(220, 38, 38, 0.6))'
            }}
          />
        </div>

        {/* Right Header Utilities (Search, Bell, Date Pill, Profile Badge) */}
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
              border: '2px solid #07090E'
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
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: '#FFFFFF',
            fontWeight: 600
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
            border: '1px solid var(--bg-glass-border)',
            borderRadius: '100px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
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

      {/* Row of Action Pill Buttons (Idênticos ao Print) */}
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
