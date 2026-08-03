// Formatação de Dinheiro em Real BRL
export const formatCurrency = (value) => {
  const numberValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

// Formatação de Data em pt-BR
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Obter mês e ano atual formatado (ex: "Agosto de 2026")
export const getCurrentMonthYear = () => {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date());
};

// Cálculo de Progresso percentual seguro
export const calculateProgress = (current, target) => {
  const curr = parseFloat(current) || 0;
  const targ = parseFloat(target) || 0;
  if (targ <= 0) return 0;
  const pct = Math.round((curr / targ) * 100);
  return pct > 100 ? 100 : pct;
};

// Gerador de IDs únicos
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};
