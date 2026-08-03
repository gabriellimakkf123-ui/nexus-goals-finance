import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calculateProgress, formatDate, generateId } from '../../utils/formatters';
import { DollarSign, Wallet, Target, Users, TrendingUp, ChevronDown, Plus, CheckSquare, Square, FileText, ShoppingCart, UserCheck, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export const DashboardView = ({ onOpenGoalModal, onOpenTxModal, onOpenClientModal, onOpenCalendarModal }) => {
  const {
    goals, addGoal, updateGoal, deleteGoal,
    transactions, addTransaction,
    clients, moveClientStage,
    tasks, addTask, toggleTask, deleteTask
  } = useApp();

  // Estado local para comissões personalizadas (%)
  const [commissionRate, setCommissionRate] = useState(() => {
    return parseFloat(localStorage.getItem('vertex_commission_rate')) || 15; // 15% por padrão
  });
  const [commissionTarget, setCommissionTarget] = useState(() => {
    return parseFloat(localStorage.getItem('vertex_commission_target')) || 15000;
  });

  // Estado local para adicionar tarefa rápida
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Alta');

  const handleCommissionRateChange = () => {
    const newRateStr = prompt('Defina a sua taxa de comissão (%):', commissionRate.toString());
    if (newRateStr === null) return;
    const newRate = parseFloat(newRateStr);
    if (!isNaN(newRate) && newRate >= 0) {
      setCommissionRate(newRate);
      localStorage.setItem('vertex_commission_rate', newRate.toString());
    }
  };

  const handleCommissionTargetChange = () => {
    const newTargetStr = prompt('Defina a sua Meta de Comissão no Mês (R$):', commissionTarget.toString());
    if (newTargetStr === null) return;
    const newTarget = parseFloat(newTargetStr);
    if (!isNaN(newTarget) && newTarget > 0) {
      setCommissionTarget(newTarget);
      localStorage.setItem('vertex_commission_target', newTarget.toString());
    }
  };

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim(), newTaskPriority);
    setNewTaskText('');
  };

  // --- CÁLCULOS REAIS DAS FINANÇAS & MRR ---
  const txEmpresa = transactions.filter((t) => t.account === 'empresa');
  const receitaPJ = txEmpresa.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPJ = txEmpresa.filter((t) => t.type === 'despesa' || t.type === 'prolabore').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPJ = receitaPJ - despesaPJ;

  // MRR Real: Clientes PJ fechados em mensalidade
  const mrrClients = clients.filter((c) => c.status === 'fechado' && c.contractType === 'mensalidade');
  const totalMRR = mrrClients.reduce((sum, c) => sum + parseFloat(c.value), 0);

  // Caixa PF Real
  const txPessoal = transactions.filter((t) => t.account === 'pessoal');
  const receitaPF = txPessoal.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPF = txPessoal.filter((t) => t.type === 'despesa').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPF = receitaPF - despesaPF;

  // Comissões Reais: % sobre o Faturamento PJ
  const ganhoComissaoMes = (receitaPJ * commissionRate) / 100;
  const comissaoProgressPct = Math.min(100, Math.round((ganhoComissaoMes / commissionTarget) * 100));

  // --- CÁLCULO REAL DO FUNIL DE VENDAS ---
  const leadsCount = clients.filter((c) => c.status === 'prospeccao').length;
  const qualificadosCount = clients.filter((c) => c.status === 'proposta').length;
  const propostaCount = clients.filter((c) => c.status === 'proposta').length;
  const negociacaoCount = clients.filter((c) => c.status === 'fechado').length;
  const fechadosCount = clients.filter((c) => c.status === 'concluido' || c.status === 'fechado').length;

  const totalFunnelClients = clients.length;
  const conversionRate = totalFunnelClients > 0 ? ((fechadosCount / totalFunnelClients) * 100).toFixed(1) : '0.0';

  // --- CÁLCULO REAL DO GRÁFICO DOS 12 MESES ---
  const monthsNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonthIdx = new Date().getMonth();
  
  // Gerar últimos 12 meses ordenados
  const last12Months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mName = monthsNames[d.getMonth()];
    const yNum = d.getFullYear();
    const mFormatted = (d.getMonth() + 1).toString().padStart(2, '0');
    
    // Somar receita real das transações daquele mês/ano
    const monthTx = transactions.filter((t) => {
      if (t.type !== 'receita') return false;
      const tDate = t.date || '';
      return tDate.startsWith(`${yNum}-${mFormatted}`);
    });

    const valSum = monthTx.reduce((s, t) => s + parseFloat(t.amount), 0);
    last12Months.push({ month: mName, value: valSum });
  }

  // Ajustar pontos do SVG baseados nos valores reais
  const maxVal = Math.max(...last12Months.map((d) => d.value), 10000);
  const svgPoints = last12Months.map((d, idx) => {
    const x = (idx / 11) * 480 + 10;
    const y = 160 - (d.value / maxVal) * 120;
    return { x, y, value: d.value, month: d.month };
  });

  const svgPathD = svgPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const svgAreaD = `${svgPathD} L ${svgPoints[11].x} 165 L ${svgPoints[0].x} 165 Z`;

  // --- PRODUTOS / SERVIÇOS MAIS VENDIDOS REAIS ---
  const categorySalesMap = {};
  transactions.filter((t) => t.type === 'receita').forEach((t) => {
    const cat = t.category || 'Outros Serviços';
    categorySalesMap[cat] = (categorySalesMap[cat] || 0) + 1;
  });

  const topProducts = Object.keys(categorySalesMap).length > 0
    ? Object.entries(categorySalesMap).map(([name, count]) => ({ name, count, salesText: `${count} vendas` })).slice(0, 4)
    : [
        { name: 'Contratos Mensais (MRR)', count: mrrClients.length, salesText: `${mrrClients.length} vendas` },
        { name: 'Projetos Pontuais', count: clients.filter(c => c.contractType === 'projeto_pontual').length, salesText: `${clients.filter(c => c.contractType === 'projeto_pontual').length} vendas` }
      ];

  // Quick add amount to goal
  const handleQuickAddGoalAmount = (goal) => {
    const addStr = prompt(`Adicionar valor acumulado à meta "${goal.title}" (R$):`, '500');
    if (!addStr) return;
    const addVal = parseFloat(addStr);
    if (isNaN(addVal) || addVal <= 0) return;

    const newCurr = goal.currentAmount + addVal;
    const isFinished = goal.targetAmount > 0 && newCurr >= goal.targetAmount;

    updateGoal({
      ...goal,
      currentAmount: newCurr,
      status: isFinished ? 'concluida' : goal.status
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* ROW 1: 4 KPIs Executivos com Dados Reais */}
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
                Receita Recorrente (MRR PJ)
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
                Ativo
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Saldo PJ: <strong style={{ color: saldoPJ >= 0 ? '#10B981' : '#EF4444' }}>{formatCurrency(saldoPJ)}</strong>
            </span>
          </div>

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

        {/* KPI 2: Caixa Atual (PF) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Caixa Atual Pessoal (PF)
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Receita PF este mês: <span style={{ color: '#10B981' }}>+{formatCurrency(receitaPF)}</span>
            </span>
          </div>
        </div>

        {/* KPI 3: Meta do Mês */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Conclusão de Metas
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
              {goals.filter(g => g.status === 'concluida').length} / {goals.length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'concluida').length / goals.length) * 100) : 0}% das metas concluídas
            </span>
          </div>

          <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${goals.length > 0 ? (goals.filter(g => g.status === 'concluida').length / goals.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #DC2626, #7C3AED)'
              }}
            />
          </div>
        </div>

        {/* KPI 4: Leads Ativos no CRM */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Leads & Clientes CRM
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
              {clients.filter(c => c.status === 'prospeccao' || c.status === 'proposta').length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {clients.filter(c => c.status === 'fechado').length} contratos ativos no Kanban
            </span>
          </div>
        </div>

      </div>

      {/* ROW 2: Gráfico Real 12 Meses + Funil de Vendas Real */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Gráfico Real das Transações nos Últimos 12 Meses */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Receita dos últimos 12 meses</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calculado em tempo real das suas receitas</span>
            </div>
            <button onClick={onOpenTxModal} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
              + Lançamento
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '0.5rem' }}>
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="redGradientReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />

              <path d={svgAreaD} fill="url(#redGradientReal)" />
              <path d={svgPathD} fill="none" stroke="#DC2626" strokeWidth="3" />

              {svgPoints.map((pt, idx) => (
                <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
              ))}
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {last12Months.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Funil de Vendas Real Baseado no CRM */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Funil de Vendas (CRM Real)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calculado dos cartões do seu CRM</span>
            </div>
            <button onClick={onOpenClientModal} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
              Ir para CRM
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flex: '0 0 160px', height: '180px' }}>
              <svg viewBox="0 0 160 180" style={{ width: '100%', height: '100%' }}>
                <polygon points="10,10 150,10 136,42 24,42" fill="#DC2626" />
                <polygon points="26,45 134,45 120,77 40,77" fill="#EA580C" />
                <polygon points="42,80 118,80 104,112 56,112" fill="#D97706" />
                <polygon points="58,115 102,115 90,147 70,147" fill="#16A34A" />
                <polygon points="72,150 88,150 82,175 78,175" fill="#2563EB" />
              </svg>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Prospecção (Leads)', count: leadsCount, color: '#DC2626' },
                { label: 'Qualificados', count: qualificadosCount, color: '#EA580C' },
                { label: 'Proposta Enviada', count: propostaCount, color: '#D97706' },
                { label: 'Contrato Fechado', count: negociacaoCount, color: '#16A34A' },
                { label: 'Concluídos', count: fechadosCount, color: '#2563EB' },
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
                Taxa de conversão: <strong style={{ color: '#10B981' }}>{conversionRate}%</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: Comissões Editáveis + Meus Sonhos & Objetivos (Criar & Remover) + Atividades Recentes Reais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Comissões Interativas */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} color="#DC2626" /> Comissões ({commissionRate}%)
              </h4>
              <button onClick={handleCommissionRateChange} className="btn-icon" title="Editar % da Comissão" style={{ padding: '0.2rem' }}>
                <Edit2 size={13} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ganho no Mês</span>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>{formatCurrency(ganhoComissaoMes)}</h5>
                <span style={{ fontSize: '0.68rem', color: '#10B981' }}>{commissionRate}% da receita</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Faturamento PJ</span>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>{formatCurrency(receitaPJ)}</h5>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta de Comissão</span>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', cursor: 'pointer' }} onClick={handleCommissionTargetChange} title="Clique para alterar meta">
                  {formatCurrency(commissionTarget)}
                </h5>
              </div>
            </div>
          </div>

          <div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${comissaoProgressPct}%`, background: '#DC2626' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
              {comissaoProgressPct}% da meta de comissão atingida
            </span>
          </div>
        </div>

        {/* Meus Sonhos & Objetivos (Completamente Editável: Criar + Remover + Aporte) */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⭐ Meus Sonhos & Objetivos
            </h4>
            <button onClick={onOpenGoalModal} className="btn-icon" title="Adicionar Novo Sonho/Meta" style={{ padding: '0.2rem' }}>
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '220px', overflowY: 'auto' }}>
            {goals.slice(0, 4).map((goal) => {
              const pct = calculateProgress(goal.currentAmount, goal.targetAmount);
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

              return (
                <div key={goal.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--bg-glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', color: '#FFFFFF' }}>{goal.title}</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong style={{ color: '#FFFFFF' }}>{formatCurrency(goal.targetAmount)}</strong>
                      <button onClick={() => handleQuickAddGoalAmount(goal)} className="btn-icon" title="+ Aporte" style={{ padding: '0.15rem' }}>
                        <Plus size={12} color="#10B981" />
                      </button>
                      <button onClick={() => deleteGoal(goal.id)} className="btn-icon" title="Excluir" style={{ padding: '0.15rem', color: '#EF4444' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#DC2626' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>Faltam: {formatCurrency(remaining)}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atividades Recentes Reais */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#2563EB" /> Atividades Recentes (Reais)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto' }}>
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: tx.type === 'receita' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: tx.type === 'receita' ? '#10B981' : '#EF4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {tx.type === 'receita' ? <DollarSign size={15} /> : <FileText size={15} />}
                  </div>
                  <div>
                    <h6 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>{tx.description}</h6>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tx.account.toUpperCase()} • {tx.category}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tx.type === 'receita' ? '#10B981' : '#EF4444' }}>
                  {tx.type === 'receita' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROW 4: Próximas Tarefas (Adicionar, Concluir & Excluir) + Produtos Mais Vendidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Próximas Tarefas Interativas */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
              Próximas Tarefas
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tasks.filter(t => !t.done).length} pendentes</span>
          </div>

          {/* Form Inline de Adicionar Tarefa */}
          <form onSubmit={handleCreateTaskSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
              placeholder="Digite uma nova tarefa..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.78rem', padding: '0.45rem 0.5rem' }}
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Plus size={15} />
            </button>
          </form>

          {/* Lista de Tarefas com Conclusão e Exclusão */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  border: '1px solid var(--bg-glass-border)'
                }}
              >
                <div
                  onClick={() => toggleTask(task.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flex: 1 }}
                >
                  {task.done ? <CheckSquare size={16} color="#10B981" /> : <Square size={16} color="var(--text-muted)" />}
                  <span style={{ fontSize: '0.85rem', color: task.done ? 'var(--text-muted)' : '#FFFFFF', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.text}
                  </span>
                  <span className={`badge ${task.priority === 'Alta' ? 'badge-alta' : 'badge-media'}`}>
                    {task.priority}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatDate(task.date)}</span>
                  <button onClick={() => deleteTask(task.id)} className="btn-icon" style={{ padding: '0.2rem', color: '#EF4444' }} title="Excluir Tarefa">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos / Serviços Mais Vendidos Reais */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>Produtos & Serviços</h4>
            <button onClick={onOpenTxModal} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
              + Venda
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto' }}>
            {topProducts.map((prod, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{prod.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{prod.salesText}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, prod.count * 25)}%`, background: '#DC2626' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
