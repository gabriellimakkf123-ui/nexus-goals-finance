import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/logo.png';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, User } from 'lucide-react';

export const LoginView = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('gabriel.lima@vertexdigital.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      login(email, password, rememberMe);
      setLoading(false);
    }, 600);
  };

  const handleQuickLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('gabriel.lima@vertexdigital.com', '123456', true);
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#06080E',
      backgroundImage: `
        radial-gradient(ellipse 90% 60% at 50% 30%, rgba(220, 38, 38, 0.28), transparent 75%),
        radial-gradient(ellipse 50% 50% at 80% 90%, rgba(220, 38, 38, 0.15), transparent 75%),
        linear-gradient(135deg, rgba(220, 38, 38, 0.04) 0%, transparent 50%, rgba(220, 38, 38, 0.06) 100%)
      `,
      position: 'relative',
      padding: '1.5rem',
      overflow: 'hidden'
    }}>
      {/* Raios Laser Vermelhos de Fundo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '140%',
        height: '200%',
        background: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 120px,
          rgba(220, 38, 38, 0.04) 120px,
          rgba(220, 38, 38, 0.04) 121px
        )`,
        pointerEvents: 'none'
      }} />

      {/* Card Principal de Login Glassmorphism */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(12, 15, 25, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(220, 38, 38, 0.4)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 0 50px rgba(220, 38, 38, 0.35)',
        position: 'relative',
        zIndex: 2,
        animation: 'modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Logo 3D Vertex Digital Destacada no Topo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            height: '110px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: '0.75rem'
          }}>
            <img
              src={logoImg}
              alt="Vertex Digital"
              style={{
                height: '100%',
                width: 'auto',
                maxWidth: '360px',
                objectFit: 'contain',
                transform: 'scale(2.8)',
                transformOrigin: 'center center',
                filter: 'drop-shadow(0 0 25px rgba(220, 38, 38, 0.85))'
              }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#CBD5E1', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            TECNOLOGIA • ESTRATÉGIA • RESULTADOS
          </span>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div style={{
            padding: '0.65rem 0.85rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: '#F87171',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} color="#DC2626" /> E-mail de Acesso
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="seu.email@vertexdigital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} color="#DC2626" /> Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Lembrar Me Checkbox */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#DC2626', width: '15px', height: '15px' }}
              />
              Lembrar meu acesso
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Em caso de perda de senha, solicite a redefinição ao administrador do Vertex Digital.'); }} style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600 }}>
              Esqueceu a senha?
            </a>
          </div>

          {/* Botão Entrar Principal */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? 'Acessando Vertex Digital...' : <>Entrar no Sistema <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Separador Or */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.75rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--bg-glass-border)' }} />
          <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acesso Rápido</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--bg-glass-border)' }} />
        </div>

        {/* Botão Acesso Rápido Gabriel Lima */}
        <button
          type="button"
          onClick={handleQuickLogin}
          className="btn btn-pill-dark"
          style={{
            width: '100%',
            padding: '0.65rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            borderColor: 'rgba(220, 38, 38, 0.4)',
            color: '#FFFFFF'
          }}
        >
          <User size={16} color="#DC2626" /> Entrar como Gabriel Lima (Consultor)
        </button>

        {/* Footer do Login */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color="#10B981" /> Conexão Criptografada • © 2026 Vertex Digital
        </div>

      </div>
    </div>
  );
};
