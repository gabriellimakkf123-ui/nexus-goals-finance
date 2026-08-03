import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calculateProgress } from '../../utils/formatters';
import { DollarSign, Wallet, Target, Users, TrendingUp, ChevronDown, Plus, CheckSquare, Square, FileText, ShoppingCart, UserCheck } from 'lucide-react';

export const DashboardView = ({ onOpenGoalModal, onOpenTxModal, onOpenClientModal }) => {
  const { goals, transactions, clients, toggleChecklistItem, setActiveTab } = useApp();

  const [taskState, setTaskState] = useState([
    { id: 't1', text: 'Ligar para João Silva', priority: 'Alta', date: '02/08/2026', done: false },
    { id: 't2', text: 'Reunião com fornecedor', priority: 'Média', date: '03/08/2026', done: false },
    { id: 't3', text: 'Enviar proposta para Marcos Almeida', priority: 'Alta', date: '04/08/2026', done: false }
  ]);

  const toggleTask = (id) => {
    setTaskState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Cálculos dinâmicos
  const txEmpresa = transactions.filter((t) => t.account === 'empresa');
  const receitaPJ = txEmpresa.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPJ = txEmpresa.filter((t) => t.type === 'despesa' || t.type === 'prolabore').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPJ = receitaPJ - despesaPJ;

  const mrrClients = clients.filter((c) => c.status === 'fechado' && c.contractType === 'mensalidade');
  const totalMRR = mrrClients.reduce((sum, c) => sum + parseFloat(c.value), 0) || 42350;

  const txPessoal = transactions.filter((t) => t.account === 'pessoal');
  const receitaPF = txPessoal.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPF = txPessoal.filter((t) => t.type === 'despesa').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPF = receitaPF - despesaPF || 12500;

  // Dados para o Gráfico de Área dos últimos 12 meses
  const monthlyRevenueData = [
    { month: 'Set', value: 12000 },
    { month: 'Out', value: 18000 },
    { month: 'Nov', value: 24000 },
    { month: 'Dez', value: 31000 },
    { month: 'Jan', value: 26000 },
    { month: 'Fev', value: 35000 },
    { month: 'Mar', value: 33000 },
    { month: 'Abr', value: 41000 },
    { month: 'Mai', value: 45000 },
    { month: 'Jun', value: 52000 },
    { month: 'Jul', value: 58000 },
    { month: 'Ago', value: 54000 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* CARD ROW 1: 4 KPIs Executivos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* KPI 1: Receita Total (MRR) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Receita Total (MRR)
              </span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(220, 38, 38, 0.2)', color: '#DC2626',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
                {formatCurrency(totalMRR)}
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '100px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
                +18,6%
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vs mês anterior</span>
          </div>

          {/* Sparkline vermelha no rodapé */}
          <div style={{ marginTop: '0.75rem', height: '24px' }}>
            <svg viewBox="0 0 100 25" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <path
                d="M0 20 Q15 18, 30 14 T60 10 T80 5 T100 8"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* KPI 2: Caixa Atual */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Caixa Atual
              </span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.2)', color: '#2563EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Wallet size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
              {formatCurrency(saldoPF)}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disponível</span>
          </div>
        </div>

        {/* KPI 3: Meta do Mês */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Meta do Mês
              </span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(124, 58, 237, 0.2)', color: '#7C3AED',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Target size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
              72%
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>R$ 10.800,00 de R$ 15.000,00</span>
          </div>

          <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
            <div className="progress-bar-fill" style={{ width: '72%', background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }} />
          </div>
        </div>

        {/* KPI 4: Leads Ativos */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Leads Ativos
              </span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)', color: '#10B981',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Users size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
              15
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Em negociação</span>
          </div>
        </div>

      </div>

      {/* CARD ROW 2: Gráfico de Receita 12 Meses + Funil de Vendas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Gráfico de Área dos 12 Meses */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Receita dos últimos 12 meses</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
              <span>Últimos 12 meses</span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Gráfico SVG de Área em Curva Fluida */}
          <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '1rem' }}>
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Linhas de Grade de Fundo */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />

              {/* Área Preenchida com Gradiente */}
              <path
                d="M 0 150 Q 40 130, 80 110 T 160 80 T 240 100 T 320 60 T 400 30 T 480 40 L 480 160 L 0 160 Z"
                fill="url(#redGradient)"
              />

              {/* Linha Vermelha Neon */}
              <path
                d="M 0 150 Q 40 130, 80 110 T 160 80 T 240 100 T 320 60 T 400 30 T 480 40"
                fill="none"
                stroke="#DC2626"
                strokeWidth="3"
              />

              {/* Pontos de Destaque Vermelhos */}
              <circle cx="480" cy="40" r="5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="400" cy="30" r="4" fill="#DC2626" />
              <circle cx="320" cy="60" r="4" fill="#DC2626" />
              <circle cx="240" cy="100" r="4" fill="#DC2626" />
              <circle cx="160" cy="80" r="4" fill="#DC2626" />
              <circle cx="80" cy="110" r="4" fill="#DC2626" />
            </svg>

            {/* Meses do Eixo X */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {monthlyRevenueData.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Funil de Vendas Visual (Inverted Funnel Pyramids) */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Funil de Vendas</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
              <span>Este mês</span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Gráfico do Funil de 5 Etapas do Design */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* SVG Inverted Funnel Pyramids */}
            <div style={{ flex: '0 0 160px', height: '180px' }}>
              <svg viewBox="0 0 160 180" style={{ width: '100%', height: '100%' }}>
                {/* Stage 1: Leads (Red) */}
                <polygon points="10,10 150,10 136,42 24,42" fill="#DC2626" />
                {/* Stage 2: Qualificados (Orange) */}
                <polygon points="26,45 134,45 120,77 40,77" fill="#EA580C" />
                {/* Stage 3: Proposta (Yellow) */}
                <polygon points="42,80 118,80 104,112 56,112" fill="#D97706" />
                {/* Stage 4: Negociação (Green) */}
                <polygon points="58,115 102,115 90,147 70,147" fill="#16A34A" />
                {/* Stage 5: Fechados (Blue) */}
                <polygon points="72,150 88,150 82,175 78,175" fill="#2563EB" />
              </svg>
            </div>

            {/* Legenda Lateral com Números */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Leads', count: 128, color: '#DC2626' },
                { label: 'Qualificados', count: 64, color: '#EA580C' },
                { label: 'Proposta', count: 32, color: '#D97706' },
                { label: 'Negociação', count: 18, color: '#16A34A' },
                { label: 'Fechados', count: 9, color: '#2563EB' },
              ].map((stage) => (
                <div key={stage.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: stage.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{stage.label}</span>
                  </div>
                  <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>{stage.count}</strong>
                </div>
              ))}

              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--bg-glass-border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Taxa de conversão: <strong style={{ color: '#10B981' }}>7,03%</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CARD ROW 3: Comissões + Meus Sonhos & Objetivos + Atividades Recentes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Comissões */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} color="#DC2626" /> Comissões
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Este mês</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ganho no Mês</span>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>R$ 7.500,00</h5>
                <span style={{ fontSize: '0.68rem', color: '#10B981' }}>+ 12,5%</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Previsto</span>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>R$ 12.300,00</h5>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta</span>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>R$ 15.000,00</h5>
              </div>
            </div>
          </div>

          <div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '50%', background: '#DC2626' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
              50% da meta atingida
            </span>
          </div>
        </div>

        {/* Meus Sonhos & Objetivos */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⭐ Meus Sonhos & Objetivos
            </h4>
            <button onClick={onOpenGoalModal} className="btn-icon" style={{ padding: '0.2rem' }}>
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Sonho 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '600', color: '#FFFFFF' }}>🏠 Casa própria</span>
                <strong style={{ color: '#FFFFFF' }}>R$ 1.200.000,00</strong>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '62%', background: '#DC2626' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Faltam: R$ 456.000,00</span>
                <span>62%</span>
              </div>
            </div>

            {/* Sonho 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '600', color: '#FFFFFF' }}>🛥️ Lancha 55 pés</span>
                <strong style={{ color: '#FFFFFF' }}>R$ 4.000.000,00</strong>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '25%', background: '#DC2626' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Faltam: R$ 3.000.000,00</span>
                <span>25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#2563EB" /> Atividades Recentes
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: FileText, title: 'Proposta enviada para João Silva', desc: 'V550 Crossover', time: 'Hoje, 15:30', color: '#10B981' },
              { icon: Users, title: 'Novo lead: Marcos Almeida', desc: 'Origem: Instagram', time: 'Hoje, 14:10', color: '#2563EB' },
              { icon: ShoppingCart, title: 'Venda realizada: V195 Comfort', desc: 'Cliente: Ricardo Oliveira', time: 'Ontem, 18:45', color: '#DC2626' },
              { icon: UserCheck, title: 'Contrato assinado: Iron 32', desc: 'Cliente: Paulo Henrique', time: 'Ontem, 16:20', color: '#7C3AED' },
            ].map((act, i) => {
              const IconComp = act.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${act.color}22`, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={15} />
                    </div>
                    <div>
                      <h6 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>{act.title}</h6>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{act.desc}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* CARD ROW 4: Próximas Tarefas + Produtos Mais Vendidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Próximas Tarefas */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
            Próximas Tarefas
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {taskState.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  border: '1px solid var(--bg-glass-border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {task.done ? <CheckSquare size={16} color="#10B981" /> : <Square size={16} color="var(--text-muted)" />}
                  <span style={{ fontSize: '0.85rem', color: task.done ? 'var(--text-muted)' : '#FFFFFF', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.text}
                  </span>
                  <span className={`badge ${task.priority === 'Alta' ? 'badge-alta' : 'badge-media'}`}>
                    {task.priority}
                  </span>
                </div>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{task.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos / Serviços Mais Vendidos */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>Produtos mais vendidos</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Este mês</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { name: 'V550 Crossover', count: '4 vendas', pct: '85%' },
              { name: 'V195 Comfort', count: '3 vendas', pct: '65%' },
              { name: 'Iron 32', count: '2 vendas', pct: '45%' },
              { name: 'Sportman 600', count: '2 vendas', pct: '45%' },
            ].map((prod) => (
              <div key={prod.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{prod.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{prod.count}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: prod.pct, background: '#DC2626' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
