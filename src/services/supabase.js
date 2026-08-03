import { createClient } from '@supabase/supabase-js';

// Chaves padrão ou configuradas pelo usuário
const getStoredCredentials = () => {
  const url = localStorage.getItem('vertex_db_url') || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem('vertex_db_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getStoredCredentials();
  if (url && key) {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient(url, key);
      } catch (e) {
        console.error('Erro ao inicializar Supabase:', e);
      }
    }
    return supabaseInstance;
  }
  return null;
};

export const isDatabaseConnected = () => {
  const { url, key } = getStoredCredentials();
  return Boolean(url && key);
};

export const saveDatabaseCredentials = (url, key) => {
  localStorage.setItem('vertex_db_url', url.trim());
  localStorage.setItem('vertex_db_key', key.trim());
  supabaseInstance = null; // Reinicializa o cliente com as novas credenciais
};

export const disconnectDatabase = () => {
  localStorage.removeItem('vertex_db_url');
  localStorage.removeItem('vertex_db_key');
  supabaseInstance = null;
};

// Script SQL para criar as tabelas no Supabase caso o usuário crie um novo projeto
export const SUPABASE_SQL_SCHEMA = `
-- Script de Criação de Tabelas para Vertex Digital (PostgreSQL / Supabase)

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  target_amount NUMERIC DEFAULT 0,
  current_amount NUMERIC DEFAULT 0,
  deadline DATE,
  status TEXT DEFAULT 'em_andamento',
  checklists JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  account TEXT NOT NULL,
  category TEXT,
  date DATE,
  recurring BOOLEAN DEFAULT false,
  client_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  category TEXT DEFAULT 'empresa',
  status TEXT DEFAULT 'prospeccao',
  contract_type TEXT DEFAULT 'mensalidade',
  value NUMERIC DEFAULT 0,
  notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'empresa',
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  notes TEXT,
  related_client TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
`;
