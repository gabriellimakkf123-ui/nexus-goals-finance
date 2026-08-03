import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calculateProgress } from '../../utils/formatters';
import { Target, Wallet, Users, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const DashboardView = ({ onOpenGoalModal, onOpenTxModal, onOpenClientModal }) => {
  const { goals, transactions, clients, setActiveTab } = useApp();

  // Cálculos Financeiros Empresariais (PJ)
  const txEmpresa = transactions.filter((t) => t.account === 'empresa');
  const receitaPJ = txEmpresa.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPJ = txEmpresa.filter((t) => t.type === 'despesa' || t.type === 'prolabore').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPJ = receitaPJ - despesaPJ;

  // MRR - Mensalidades Recorrentes de Clientes
  const mrrClients = clients.filter((c) => c.status === 'fechado' && c.contractType === 'mensalidade');
  const totalMRR = mrrClients.reduce((sum, c) => sum + parseFloat(c.value), 0);

  // Cálculos Financeiros Pessoais (PF)
  const txPessoal = transactions.filter((t) => t.account === 'pessoal');
  const receitaPF = txPessoal.filter((t) => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const despesaPF = txPessoal.filter((t) => t.type === 'despesa').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldoPF = receitaPF - despesaPF;

  // Métricas de Metas
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'concluida').length;
  const goalsProgressPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Clientes em Negociação
  const activeClients = clients.filter((c) => c.status === 'fechado').length;
  const inPipelineClients = clients.filter((c) => c.status === 'prospeccao' || c.status === 'proposta').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Grid de Cards Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* Card MRR & PJ */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Receita Recorrente (MRR PJ)
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            {formatCurrency(totalMRR)}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mês</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Saldo PJ Atual: <strong style={{ color: saldoPJ >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{formatCurrency(saldoPJ)}</strong>
          </p>
        </div>

        {/* Card Caixa Pessoal */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Saldo Caixa Pessoal (PF)
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(157, 78, 221, 0.15)', color: 'var(--accent-purple)' }}>
              <Wallet size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            {formatCurrency(saldoPF)}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Entradas PF este mês: <span style={{ color: 'var(--accent-emerald)' }}>+{formatCurrency(receitaPF)}</span>
          </p>
        </div>

        {/* Card Metas */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Conclusão de Metas
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <Target size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            {completedGoals} / {totalGoals} <span style={{ fontSize: '1rem', color: 'var(--accent-emerald)' }}>({goalsProgressPct}%)</span>
          </h3>
          <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
            <div className="progress-bar-fill" style={{ width: `${goalsProgressPct}%`, background: 'var(--accent-emerald)' }} />
          </div>
        </div>

        {/* Card CRM Clientes */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Clientes & Funil
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Users size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            {activeClients} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ativos</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>
            + {inPipelineClients} em negociação no Kanban
          </p>
        </div>

      </div>

      {/* Seção Principal: Metas Ativas + Lançamentos Recentes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Metas Prioritárias */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--accent-purple)" /> Metas em Andamento
            </h3>
            <button onClick={() => setActiveTab('metas')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              Ver Todas
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.filter(g => g.status === 'em_andamento').slice(0, 3).map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              return (
                <div key={goal.id} style={{
                  padding: '1rem',
                  background: 'rgba(15, 20, 32, 0.6)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--bg-glass-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>{goal.title}</h4>
                    <span className={`badge ${goal.category === 'pessoal' ? 'badge-pessoal' : 'badge-empresa'}`}>
                      {goal.category}
                    </span>
                  </div>

                  {goal.targetAmount > 0 && (
                    <div style={{ margin: '0.5rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span>{formatCurrency(goal.targetAmount)} ({progress}%)</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{
                          width: `${progress}%`,
                          background: goal.category === 'pessoal' ? 'linear-gradient(90deg, var(--accent-purple), #c77dff)' : 'linear-gradient(90deg, var(--accent-cyan), #38bdf8)'
                        }} />
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Prazo: {goal.deadline}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extrato de Lançamentos Recentes */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={18} color="var(--accent-cyan)" /> Lançamentos Recentes
            </h3>
            <button onClick={() => setActiveTab('financas')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              Ir para Finanças
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type === 'receita';
              const isProlabore = tx.type === 'prolabore';
              return (
                <div key={tx.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 20, 32, 0.6)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--bg-glass-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.4rem',
                      borderRadius: '50%',
                      background: isIncome ? 'rgba(16, 185, 129, 0.15)' : isProlabore ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isIncome ? 'var(--accent-emerald)' : isProlabore ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}>
                      {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>{tx.description}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {tx.account.toUpperCase()} • {tx.category}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: isIncome ? 'var(--accent-emerald)' : isProlabore ? 'var(--accent-amber)' : 'var(--accent-rose)'
                  }}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
