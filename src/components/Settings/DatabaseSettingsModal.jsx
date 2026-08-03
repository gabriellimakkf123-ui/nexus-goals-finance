import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { isDatabaseConnected, saveDatabaseCredentials, disconnectDatabase, SUPABASE_SQL_SCHEMA } from '../../services/supabase';
import { Database, CheckCircle2, AlertCircle, Copy, Check, Server, Key } from 'lucide-react';

export const DatabaseSettingsModal = ({ isOpen, onClose }) => {
  const [dbUrl, setDbUrl] = useState(() => localStorage.getItem('vertex_db_url') || '');
  const [dbKey, setDbKey] = useState(() => localStorage.getItem('vertex_db_key') || '');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const isConnected = isDatabaseConnected();

  const handleSave = (e) => {
    e.preventDefault();
    if (!dbUrl.trim() || !dbKey.trim()) {
      setStatusMsg('Por favor, informe a URL e a Chave Anon do Supabase.');
      return;
    }

    saveDatabaseCredentials(dbUrl, dbKey);
    setStatusMsg('Conexão configurada com sucesso! O banco de dados Cloud está ativo.');
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 1000);
  };

  const handleDisconnect = () => {
    if (confirm('Deseja desconectar o banco de dados Cloud e voltar para o banco local?')) {
      disconnectDatabase();
      setDbUrl('');
      setDbKey('');
      window.location.reload();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Banco de Dados Cloud & Integração">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Status Atual do Banco de Dados */}
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {isConnected ? (
            <CheckCircle2 size={24} color="var(--accent-emerald)" />
          ) : (
            <AlertCircle size={24} color="var(--accent-amber)" />
          )}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
              Status: {isConnected ? 'Conectado ao Supabase (PostgreSQL Cloud)' : 'Banco de Dados Local Ativo'}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isConnected
                ? 'Seus dados estão sincronizados em tempo real com seu banco de dados na nuvem.'
                : 'Os dados estão salvos no seu navegador. Conecte um projeto Supabase abaixo para salvar na nuvem.'}
            </p>
          </div>
        </div>

        {/* Formulário de Configuração Supabase */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={14} color="var(--accent-cyan)" /> Supabase Project URL
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="https://xyzxyz.supabase.co"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} color="var(--accent-amber)" /> Supabase Anon / Public Key
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={dbKey}
              onChange={(e) => setDbKey(e.target.value)}
            />
          </div>

          {statusMsg && (
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
              {statusMsg}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            {isConnected ? (
              <button type="button" onClick={handleDisconnect} className="btn btn-secondary" style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>
                Desconectar Cloud
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Fechar
              </button>
              <button type="submit" className="btn btn-emerald">
                Conectar Banco Cloud
              </button>
            </div>
          </div>
        </form>

        {/* Script SQL para criação de Tabelas */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--bg-glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={15} color="var(--accent-purple)" /> Script de Criação das Tabelas SQL
            </h5>
            <button onClick={handleCopySql} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />} {copied ? 'Copiado!' : 'Copiar SQL'}
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Ao criar um projeto gratuito no <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>Supabase.com</a>, cole este código no <strong>SQL Editor</strong> para estruturar as tabelas automaticamente.
          </p>
          <pre style={{
            background: 'rgba(15, 20, 32, 0.9)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: '#a7f3d0',
            maxHeight: '140px',
            overflowY: 'auto',
            border: '1px solid var(--bg-glass-border)'
          }}>
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>

      </div>
    </Modal>
  );
};
