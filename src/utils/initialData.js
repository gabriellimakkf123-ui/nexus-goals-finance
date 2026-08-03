export const INITIAL_GOALS = [
  {
    id: 'g1',
    title: 'Meta de Faturamento Mensal (Empresa)',
    description: 'Atingir R$ 25.000,00 de faturamento recorrente com clientes em contratos mensais.',
    category: 'empresarial',
    targetAmount: 25000,
    currentAmount: 18500,
    deadline: '2026-12-31',
    status: 'em_andamento',
    checklists: [
      { id: 'ck1', title: 'Fechar 2 novos clientes de mensalidade (R$ 3.000/mês)', done: true },
      { id: 'ck2', title: 'Renovar contrato do Cliente TechCorp', done: true },
      { id: 'ck3', title: 'Lançar novo pacote de manutenção premium', done: false }
    ]
  },
  {
    id: 'g2',
    title: 'Reserva de Emergência Pessoal',
    description: 'Acumular 6 meses de despesas pessoais de segurança em investimento de liquidez diária.',
    category: 'pessoal',
    targetAmount: 40000,
    currentAmount: 28000,
    deadline: '2026-11-30',
    status: 'em_andamento',
    checklists: [
      { id: 'ck4', title: 'Aporte de R$ 3.000 este mês', done: true },
      { id: 'ck5', title: 'Reorganizar assinaturas desnecessárias', done: true }
    ]
  },
  {
    id: 'g3',
    title: 'Viagem de Fim de Ano (Férias Pessoais)',
    description: 'Meta de economia para pacote completo de férias no nordeste.',
    category: 'pessoal',
    targetAmount: 12000,
    currentAmount: 12000,
    deadline: '2026-12-15',
    status: 'concluida',
    checklists: [
      { id: 'ck6', title: 'Comprar passagens com milhas', done: true },
      { id: 'ck7', title: 'Reservar resort', done: true }
    ]
  },
  {
    id: 'g4',
    title: 'Contratação de Designer UX/UI Freelancer',
    description: 'Ter caixa empresarial reservado para terceirizar demandas de interface.',
    category: 'empresarial',
    targetAmount: 6000,
    currentAmount: 4500,
    deadline: '2026-09-30',
    status: 'em_andamento',
    checklists: [
      { id: 'ck8', title: 'Entrevistas e portfólios', done: true },
      { id: 'ck9', title: 'Definir escopo do projeto teste', done: false }
    ]
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 't1',
    description: 'Mensalidade - Cliente TechCorp Soluções',
    amount: 5500,
    type: 'receita',
    account: 'empresa',
    category: 'Contrato Recorrente',
    date: '2026-08-01',
    recurring: true,
    clientId: 'c1'
  },
  {
    id: 't2',
    description: 'Mensalidade - OdontoClinika',
    amount: 3200,
    type: 'receita',
    account: 'empresa',
    category: 'Contrato Recorrente',
    date: '2026-08-02',
    recurring: true,
    clientId: 'c2'
  },
  {
    id: 't3',
    description: 'Projeto E-commerce - Modas Vanguarda (Entrada 50%)',
    amount: 4800,
    type: 'receita',
    account: 'empresa',
    category: 'Projeto Pontual',
    date: '2026-08-03',
    recurring: false,
    clientId: 'c3'
  },
  {
    id: 't4',
    description: 'Retirada de Pró-Labore do Mês',
    amount: 8000,
    type: 'prolabore',
    account: 'empresa',
    category: 'Transferência Pró-Labore',
    date: '2026-08-03',
    recurring: true
  },
  {
    id: 't5',
    description: 'Recebimento de Pró-Labore (PF)',
    amount: 8000,
    type: 'receita',
    account: 'pessoal',
    category: 'Salário / Pró-Labore',
    date: '2026-08-03',
    recurring: true
  },
  {
    id: 't6',
    description: 'Servidores Vercel & AWS',
    amount: 450,
    type: 'despesa',
    account: 'empresa',
    category: 'Ferramentas & Infra',
    date: '2026-08-01',
    recurring: true
  },
  {
    id: 't7',
    description: 'Aluguel do Apê & Condomínio',
    amount: 2800,
    type: 'despesa',
    account: 'pessoal',
    category: 'Moradia',
    date: '2026-08-02',
    recurring: true
  },
  {
    id: 't8',
    description: 'Aporte de Reserva de Emergência',
    amount: 2000,
    type: 'despesa',
    account: 'pessoal',
    category: 'Investimentos',
    date: '2026-08-03',
    recurring: false
  }
];

export const INITIAL_CLIENTS = [
  // --- CLIENTES EMPRESARIAIS (PJ) ---
  {
    id: 'c1',
    name: 'TechCorp Soluções',
    contactPerson: 'Carlos Eduardo',
    email: 'carlos@techcorp.com.br',
    phone: '(11) 98765-4321',
    category: 'empresa', // PJ
    status: 'fechado',
    contractType: 'mensalidade',
    value: 5500,
    notes: 'Cliente PJ. Manutenção de sistema web + suporte prioritário.',
    tags: ['SaaS', 'VIP']
  },
  {
    id: 'c2',
    name: 'OdontoClinika',
    contactPerson: 'Dra. Vanessa',
    email: 'vanessa@odontoclinika.com',
    phone: '(11) 97123-8899',
    category: 'empresa', // PJ
    status: 'fechado',
    contractType: 'mensalidade',
    value: 3200,
    notes: 'Gestão de tráfego + landing page mensal.',
    tags: ['Saúde', 'Mensal']
  },
  {
    id: 'c3',
    name: 'Modas Vanguarda',
    contactPerson: 'Fernanda Lima',
    email: 'fernanda@vanguarda.com',
    phone: '(21) 99887-1122',
    category: 'empresa', // PJ
    status: 'fechado',
    contractType: 'projeto_pontual',
    value: 9600,
    notes: 'Projeto e-commerce Shopify.',
    tags: ['E-commerce', 'Pontual']
  },
  {
    id: 'c4',
    name: 'Logística Express',
    contactPerson: 'Roberto Mendes',
    email: 'roberto@logexpress.com.br',
    phone: '(31) 98444-5566',
    category: 'empresa', // PJ
    status: 'proposta',
    contractType: 'mensalidade',
    value: 4200,
    notes: 'Proposta enviada para desenvolvimento de app.',
    tags: ['Logística', 'Em Negociação']
  },
  {
    id: 'c5',
    name: 'Padaria & Empório Gourmet',
    contactPerson: 'Juliana Paes',
    email: 'juliana@gourmet.com',
    phone: '(11) 96555-4433',
    category: 'empresa', // PJ
    status: 'prospeccao',
    contractType: 'projeto_pontual',
    value: 6500,
    notes: 'Reunião inicial agendada.',
    tags: ['Alimentação']
  },

  // --- CLIENTES & OPORTUNIDADES PESSOAIS (PF) ---
  {
    id: 'cpf1',
    name: 'Mentoria Individual de Carreira - Lucas Gabriel',
    contactPerson: 'Lucas Gabriel',
    email: 'lucas.gabriel@email.com',
    phone: '(11) 99111-2233',
    category: 'pessoal', // PF
    status: 'fechado',
    contractType: 'mensalidade',
    value: 1200,
    notes: 'Mentoria pessoal de desenvolvimento de software (4 sessões/mês).',
    tags: ['Mentoria', 'PF']
  },
  {
    id: 'cpf2',
    name: 'Venda de Notebook Usado (MacBook Pro)',
    contactPerson: 'Matheus Oliveira',
    email: 'matheus@email.com',
    phone: '(11) 98222-4455',
    category: 'pessoal', // PF
    status: 'fechado',
    contractType: 'projeto_pontual',
    value: 4500,
    notes: 'Venda pessoal parcelada em 2x.',
    tags: ['Desapego', 'Venda PF']
  },
  {
    id: 'cpf3',
    name: 'Freelance Pessoal - Blog para Amigo (Dr. Bruno)',
    contactPerson: 'Bruno Ramos',
    email: 'bruno@email.com',
    phone: '(21) 97333-6677',
    category: 'pessoal', // PF
    status: 'proposta',
    contractType: 'projeto_pontual',
    value: 2500,
    notes: 'Criação de blog pessoal médico.',
    tags: ['Freela PF']
  },
  {
    id: 'cpf4',
    name: 'Consultoria Financeira Pessoal com Amigos',
    contactPerson: 'Camila & Pedro',
    email: 'camila@email.com',
    phone: '(11) 96444-8899',
    category: 'pessoal', // PF
    status: 'prospeccao',
    contractType: 'projeto_pontual',
    value: 800,
    notes: 'Conversa informal para organizar planejamento financeiro de casal.',
    tags: ['Networking']
  }
];

export const KANBAN_STAGES = [
  { id: 'prospeccao', title: '1. Em Prospecção', color: 'var(--accent-cyan)' },
  { id: 'proposta', title: '2. Proposta Enviada', color: 'var(--accent-amber)' },
  { id: 'fechado', title: '3. Contrato / Acordo Fechado', color: 'var(--accent-emerald)' },
  { id: 'concluido', title: '4. Concluído / Entregue', color: 'var(--accent-purple)' },
  { id: 'perdido', title: '5. Perdido / Cancelado', color: 'var(--accent-rose)' }
];
