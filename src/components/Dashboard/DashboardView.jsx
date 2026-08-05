import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calculateProgress } from '../../utils/formatters';
import { DollarSign, Wallet, Target, Users, Plus, FileText, Trash2, Edit2, ClipboardCheck } from 'lucide-react';
import logoSymbolImg from '../../assets/logo.png';
import { Modal } from '../Common/Modal';

export const DashboardView = ({ onOpenGoalModal, onOpenTxModal, onOpenClientModal, onOpenCalendarModal }) => {
  const {
    goals, deleteGoal, updateGoal,
    transactions,
    clients,
    tasks
  } = useApp();

  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [commissionForm, setCommissionForm] = useState({
    rate: localStorage.getItem('vertex_commission_rate') || '1',
    target: localStorage.getItem('vertex_commission_target') || '15000'
  });

  const commissionRate = parseFloat(commissionForm.rate) || 1;
  const commissionTarget = parseFloat(commissionForm.target) || 15000;

  const handleCommissionSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('vertex_commission_rate', commissionForm.rate);
    localStorage.setItem('vertex_commission_target', commissionForm.target);
    setIsCommissionModalOpen(false);
  };

  // --- CÁLCULOS REAIS ---
  const txEmpresa = transactions.filter((t) => t.account === 'empresa');
  const receitaPJ = txEmpresa.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPJ = txEmpresa.filter((t) => t.type === 'despesa' || t.type === 'prolabore').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPJ = receitaPJ - despesaPJ;

  const mrrClients = clients.filter((c) => c.status === 'fechado' && c.contractType === 'mensalidade');
  const totalMRR = mrrClients.reduce((sum, c) => sum + parseFloat(c.value), 0);

  const txPessoal = transactions.filter((t) => t.account === 'pessoal');
  const receitaPF = txPessoal.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPF = txPessoal.filter((t) => t.type === 'despesa').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPF = receitaPF - despesaPF;

  const ganhoComissaoMes = (receitaPJ * commissionRate) / 100;
  const comissaoProgressPct = Math.min(100, Math.round((ganhoComissaoMes / commissionTarget) * 100));

  // Funil Real
  const leadsCount = clients.filter((c) => c.status === 'prospeccao').length;
  const qualificadosCount = clients.filter((c) => c.status === 'proposta').length;
  const propostaCount = clients.filter((c) => c.status === 'proposta').length;
  const negociacaoCount = clients.filter((c) => c.status === 'fechado').length;
  const fechadosCount = clients.filter((c) => c.status === 'concluido' || c.status === 'fechado').length;
  const totalFunnelClients = clients.length;
  const conversionRate = totalFunnelClients > 0 ? ((fechadosCount / totalFunnelClients) * 100).toFixed(1) : '100.0';

  // 12 Meses Reais
  const monthsNames = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
  const last12Months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mName = monthsNames[d.getMonth() % 12];
    const yNum = d.getFullYear();
    const mFormatted = (d.getMonth() + 1).toString().padStart(2, '0');
    
    const monthTx = transactions.filter((t) => {
      if (t.type !== 'receita') return false;
      const tDate = t.date || '';
      return tDate.startsWith(`${yNum}-${mFormatted}`);
    });

    const valSum = monthTx.reduce((s, t) => s + parseFloat(t.amount), 0);
    last12Months.push({ month: mName, value: valSum });
  }

  const maxVal = Math.max(...last12Months.map((d) => d.value), 4000);
  const svgPoints = last12Months.map((d, idx) => {
    const x = (idx / 11) * 460 + 20;
    const y = 160 - (d.value / maxVal) * 120;
    return { x, y, value: d.value, month: d.month };
  });

  const svgPathD = svgPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');
  const svgAreaD = `${svgPathD} L ${svgPoints[11].x} 165 L ${svgPoints[0].x} 165 Z`;

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
      
      {/* ROW 1: 4 KPIs Executivos Idênticos ao Print */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* KPI 1: Receita Recorrente (MRR PJ) */}
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
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '100px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
                Ativo
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Saldo PJ: <strong style={{ color: '#10B981' }}>{formatCurrency(saldoPJ)}</strong>
            </span>
          </div>

          <div style={{ marginTop: '0.75rem', height: '24px' }}>
            <svg viewBox="0 0 100 25" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <path d="M0 20 Q15 18, 30 14 T60 10 T80 5 T100 8" fill="none" stroke="#DC2626" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Caixa Atual Pessoal (PF) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Caixa Atual Pessoal (PF)
              </span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(220, 38, 38, 0.2)', color: '#DC2626',
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

        {/* KPI 3: Conclusão de Metas */}
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

        {/* KPI 4: Leads & Clientes CRM */}
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

      {/* ROW 2: Gráfico 12 Meses + Funil de Vendas Real Idênticos ao Print */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Gráfico Receita 12 Meses */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Receita dos últimos 12 meses</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calculado em tempo real das suas receitas</span>
            </div>
            <button onClick={onOpenTxModal} className="btn btn-pill-dark" style={{ fontSize: '0.78rem' }}>
              + Lançamento
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '0.5rem' }}>
            
            {/* Marca D'Água V do Fundo */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.08,
              pointerEvents: 'none'
            }}>
              <img src={logoSymbolImg} alt="Watermark" style={{ width: '180px', height: 'auto' }} />
            </div>

            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="redGradientReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />

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

        {/* Funil de Vendas Real */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Funil de Vendas (CRM Real)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calculado dos cartões do seu CRM</span>
            </div>
            <button onClick={onOpenClientModal} className="btn btn-pill-dark" style={{ fontSize: '0.78rem' }}>
              + Novo Cliente
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

      {/* ROW 3: Comissões (1%) + Meus Sonhos & Objetivos (com Frase de Efeito + Botão +) + Atividades Recentes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Comissões */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} color="#DC2626" /> Comissões ({commissionRate}%)
              </h4>
              <button onClick={() => setIsCommissionModalOpen(true)} className="btn-icon" title="Editar Meta e % da Comissão" style={{ padding: '0.35rem' }}>
                <Edit2 size={14} />
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
                <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
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
              {comissaoProgressPct}% da meta atingida
            </span>
          </div>
        </div>

        {/* Meus Sonhos & Objetivos com Frase Inspiradora Fiel ao Print */}
        <div className="glass-panel" style={{ padding: '1.25rem', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⭐ Meus Sonhos & Objetivos
            </h4>
            <button
              type="button"
              onClick={onOpenGoalModal}
              className="btn btn-red-pill"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
              title="Adicionar Novo Sonho / Meta"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>

          {goals.length === 0 ? (
            /* Frase Inspiradora Exata do Print quando não há metas */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              position: 'relative'
            }}>
              <span style={{ fontSize: '2.5rem', color: '#DC2626', lineHeight: '0.8', fontWeight: 900 }}>“</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', fontStyle: 'italic', margin: '0.2rem 0' }}>
                Disciplina hoje, liberdade amanhã.
              </p>
              <span style={{ fontSize: '2.5rem', color: '#DC2626', lineHeight: '0.8', fontWeight: 900 }}>”</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '180px', overflowY: 'auto' }}>
              {goals.slice(0, 3).map((goal) => {
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
          )}
        </div>

        {/* Atividades Recentes Idênticas ao Print */}
        <div className="glass-panel" style={{ padding: '1.25rem', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#DC2626" /> Atividades Recentes
          </h4>

          {transactions.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-muted)',
              gap: '0.5rem'
            }}>
              <ClipboardCheck size={42} strokeWidth={1.2} color="rgba(255, 255, 255, 0.15)" />
              <p style={{ fontSize: '0.85rem' }}>Nenhuma atividade recente.<br />Você está em dia!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
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
          )}
        </div>

      </div>

      {/* MODAL: Configurar Comissões */}
      <Modal isOpen={isCommissionModalOpen} onClose={() => setIsCommissionModalOpen(false)} title="Configurar Comissões & Metas">
        <form onSubmit={handleCommissionSubmit}>
          <div className="form-group">
            <label className="form-label">Taxa de Comissão (% sobre Receita PJ)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={commissionForm.rate}
              onChange={(e) => setCommissionForm({ ...commissionForm, rate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta de Comissão Mensal (R$)</label>
            <input
              type="number"
              step="100"
              className="form-input"
              value={commissionForm.target}
              onChange={(e) => setCommissionForm({ ...commissionForm, target: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsCommissionModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Comissões</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
