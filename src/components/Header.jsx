import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { isDatabaseConnected } from '../services/supabase';
import { Plus, ArrowRightLeft, Search, Bell, Calendar as CalendarIcon, Database, LogOut, CheckCheck, X, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { Modal } from './Common/Modal';

export const Header = ({
  onOpenGoalModal,
  onOpenTxModal,
  onOpenClientModal,
  onOpenProlaboreModal,
  onOpenCalendarModal,
  onOpenDbModal
}) => {
  const {
    activeTab,
    setActiveTab,
    userSession,
    logout,
    notifications,
    markNotificationsRead,
    goals,
    transactions,
    clients,
    tasks,
    events
  } = useApp();

  const isDbConnected = isDatabaseConnected();
  const userName = userSession?.user?.name || 'Gabriel Lima';
  const userRole = userSession?.user?.role || 'Consultor Náutico';

  // State para Relógio em Tempo Real (Data e Hora)
  const [liveDateTime, setLiveDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatação de Data e Hora ao Vivo
  const formattedDate = liveDateTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = liveDateTime.toLocaleTimeString('pt-BR');

  // Modais dos Ícones Utilitários
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  // Seções de Atalho Rápido para Busca
  const sectionShortcuts = [
    { label: 'Financeiro (Caixas PF & PJ)', tab: 'financas', keywords: ['financeiro', 'caixa', 'extrato', 'banco', 'pró-labore', 'dinheiro'] },
    { label: 'Metas & Objetivos (Sonhos)', tab: 'metas', keywords: ['metas', 'objetivos', 'sonhos', 'lancha', 'casa'] },
    { label: 'Clientes (CRM Dual / Ventura)', tab: 'clientes', keywords: ['clientes', 'crm', 'barco', 'ventura', 'leads', 'vendas', 'comissão'] },
    { label: 'Agenda & Compromissos', tab: 'agenda', keywords: ['agenda', 'horário', 'reunião', 'compromisso', 'tarefas'] },
    { label: 'Dashboard Visão Geral', tab: 'dashboard', keywords: ['dashboard', 'painel', 'mrr', 'resumo'] },
  ];

  const matchedSections = sectionShortcuts.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.label.toLowerCase().includes(q) || s.keywords.some((k) => k.includes(q));
  });

  const matchedClients = clients.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchedTransactions = transactions.filter((t) => t.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectSearchResult = (tabId) => {
    setActiveTab(tabId);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      marginBottom: '1.75rem',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Top Banner Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative'
      }}>
        
        {/* Left Greeting */}
        <div style={{ position: 'relative', zIndex: 20 }}>
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
          padding: '1rem 2.5rem',
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.45), rgba(12, 15, 25, 0.7) 85%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(220, 38, 38, 0.5)',
          boxShadow: '0 0 45px rgba(220, 38, 38, 0.45)',
          height: '140px',
          maxWidth: '650px',
          flex: '1 1 450px',
          overflow: 'hidden',
          margin: '0 1rem',
          position: 'relative',
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          <img
            src={logoImg}
            alt="Vertex Digital Banner"
            style={{
              height: '100px',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              transform: 'scale(2.8)',
              transformOrigin: 'center center',
              filter: 'drop-shadow(0 0 35px rgba(220, 38, 38, 0.95))',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Right Header Utilities (Busca Inteligente, Notificações em Tempo Real, Relógio em Tempo Real + Logout) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}>
          
          {/* ÍCONE 1: LUPA DE BUSCA INTELIGENTE */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="btn-icon"
            title="Busca Inteligente & Navegação Direta"
            style={{ position: 'relative' }}
          >
            <Search size={16} />
          </button>

          {/* ÍCONE 2: NOTIFICAÇÕES EM TEMPO REAL COM BADGE DINÂMICA */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setIsNotifOpen(true);
                markNotificationsRead();
              }}
              className="btn-icon"
              title="Central de Notificações em Tempo Real"
            >
              <Bell size={16} />
            </button>
            {unreadNotifCount > 0 && (
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
                boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)'
              }}>
                {unreadNotifCount}
              </span>
            )}
          </div>

          {/* ÍCONE 3: CALENDÁRIO E RELÓGIO EM TEMPO REAL */}
          <div
            onClick={() => setActiveTab('agenda')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.55rem 0.95rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: '#FFFFFF',
              fontWeight: 600,
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.15)',
              cursor: 'pointer'
            }}
            title="Clique para abrir a Agenda"
          >
            <CalendarIcon size={14} color="#DC2626" />
            <span>{formattedDate} • <strong style={{ color: '#10B981' }}>{formattedTime}</strong></span>
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
              padding: '0.6rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 10000,
              pointerEvents: 'auto'
            }}
            title="Sair do Sistema (Logout)"
          >
            <LogOut size={16} /> SAIR
          </button>

        </div>
      </div>

      {/* Row of Action Pill Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', position: 'relative', zIndex: 20 }}>
        
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

        <button onClick={onOpenProlaboreModal} className="btn btn-pill-dark" style={{ fontSize: '0.82rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}>
          <ArrowRightLeft size={15} /> Retirar Pró-Labore
        </button>

        <button onClick={onOpenCalendarModal} className="btn btn-pill-dark" style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Agendar
        </button>

        <button onClick={onOpenGoalModal} className="btn btn-red-pill">
          <Plus size={15} /> Meta
        </button>

        <button onClick={onOpenTxModal} className="btn btn-red-pill">
          <Plus size={15} /> Lançamento
        </button>

        <button onClick={onOpenClientModal} className="btn btn-red-pill">
          <Plus size={15} /> CRM
        </button>

      </div>

      {/* MODAL DE BUSCA INTELIGENTE */}
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Busca Inteligente & Navegação Direta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group">
            <label className="form-label">Digite o que procura (ex: "financeiro", "barco", "metas"):</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite para buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Atalhos para Seções */}
          <div>
            <h5 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Navegação Direta
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matchedSections.map((sec) => (
                <div
                  key={sec.tab}
                  onClick={() => handleSelectSearchResult(sec.tab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--bg-glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>{sec.label}</span>
                  <ArrowRight size={16} color="#DC2626" />
                </div>
              ))}
            </div>
          </div>

          {/* Resultados em Clientes */}
          {matchedClients.length > 0 && (
            <div>
              <h5 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Clientes Encontrados ({matchedClients.length})
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {matchedClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectSearchResult('clientes')}
                    style={{ padding: '0.5rem 0.75rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{c.name}</span>
                    <span style={{ color: '#10B981' }}>R$ {parseFloat(c.value).toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </Modal>

      {/* MODAL DE NOTIFICAÇÕES EM TEMPO REAL */}
      <Modal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} title="Central de Notificações em Tempo Real">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {notifications.length} notificações registradas
            </span>
            <button onClick={markNotificationsRead} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <CheckCheck size={14} color="#10B981" /> Marcar como lidas
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.linkTab) setActiveTab(n.linkTab);
                  setIsNotifOpen(false);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  padding: '0.75rem 0.85rem',
                  background: n.unread ? 'rgba(220, 38, 38, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${n.unread ? 'rgba(220, 38, 38, 0.4)' : 'var(--bg-glass-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#FFFFFF' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{n.description}</p>
              </div>
            ))}
          </div>

        </div>
      </Modal>

    </header>
  );
};
