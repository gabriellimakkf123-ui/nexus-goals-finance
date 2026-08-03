import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calculateProgress, formatDate, generateId } from '../../utils/formatters';
import { Target, CheckSquare, Square, Plus, Trash2, Edit2, CheckCircle2, TrendingUp } from 'lucide-react';
import { Modal } from '../Common/Modal';

export const GoalsView = ({ isModalOpen, setIsModalOpen }) => {
  const { goals, addGoal, updateGoal, deleteGoal, toggleChecklistItem } = useApp();
  const [filterCategory, setFilterCategory] = useState('todas'); // 'todas', 'pessoal', 'empresarial', 'concluida'
  const [editingGoal, setEditingGoal] = useState(null);

  // Formulário State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pessoal',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    checklists: []
  });
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  const openAddModal = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'pessoal',
      targetAmount: '',
      currentAmount: '0',
      deadline: new Date().toISOString().split('T')[0],
      checklists: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      targetAmount: goal.targetAmount || '',
      currentAmount: goal.currentAmount || '0',
      deadline: goal.deadline || '',
      checklists: goal.checklists || []
    });
    setIsModalOpen(true);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistTitle.trim()) return;
    setFormData((prev) => ({
      ...prev,
      checklists: [...prev.checklists, { id: generateId(), title: newChecklistTitle.trim(), done: false }]
    }));
    setNewChecklistTitle('');
  };

  const handleRemoveChecklistItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.filter((c) => c.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const targ = parseFloat(formData.targetAmount) || 0;
    const curr = parseFloat(formData.currentAmount) || 0;
    const isFinished = targ > 0 && curr >= targ;

    if (editingGoal) {
      updateGoal({
        ...editingGoal,
        ...formData,
        targetAmount: targ,
        currentAmount: curr,
        status: isFinished ? 'concluida' : editingGoal.status === 'concluida' && !isFinished ? 'em_andamento' : editingGoal.status
      });
    } else {
      addGoal({
        id: generateId(),
        ...formData,
        targetAmount: targ,
        currentAmount: curr,
        status: isFinished ? 'concluida' : 'em_andamento'
      });
    }
    setIsModalOpen(false);
  };

  const handleQuickAddAmount = (goal) => {
    const addStr = prompt(`Adicionar valor ao progresso de "${goal.title}" (R$):`, '500');
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

  // Filtragem
  const filteredGoals = goals.filter((g) => {
    if (filterCategory === 'todas') return true;
    if (filterCategory === 'concluida') return g.status === 'concluida';
    return g.category === filterCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Filtros e Botão Novo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'todas', label: 'Todas as Metas' },
            { id: 'pessoal', label: 'Pessoais (PF)' },
            { id: 'empresarial', label: 'Empresariais (PJ)' },
            { id: 'concluida', label: 'Concluídas 🎉' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.9rem',
                background: filterCategory === tab.id ? 'rgba(157, 78, 221, 0.2)' : undefined,
                borderColor: filterCategory === tab.id ? 'var(--accent-purple)' : undefined,
                color: filterCategory === tab.id ? 'white' : 'var(--text-secondary)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Nova Meta
        </button>
      </div>

      {/* Grid de Cards de Metas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredGoals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const isDone = goal.status === 'concluida';

          return (
            <div key={goal.id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : undefined
            }}>
              <div>
                {/* Header do Card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className={`badge ${goal.category === 'pessoal' ? 'badge-pessoal' : 'badge-empresa'}`}>
                    {goal.category}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button onClick={() => openEditModal(goal)} className="btn-icon" title="Editar">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteGoal(goal.id)} className="btn-icon" title="Excluir" style={{ color: 'var(--accent-rose)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>
                  {goal.title}
                </h3>
                {goal.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {goal.description}
                  </p>
                )}

                {/* Valor & Progresso */}
                {goal.targetAmount > 0 && (
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '0.4rem' }}>
                      <span>Acumulado: {formatCurrency(goal.currentAmount)}</span>
                      <span>Meta: {formatCurrency(goal.targetAmount)} ({progress}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{
                        width: `${progress}%`,
                        background: isDone
                          ? 'var(--accent-emerald)'
                          : goal.category === 'pessoal'
                          ? 'linear-gradient(90deg, var(--accent-purple), #c77dff)'
                          : 'linear-gradient(90deg, var(--accent-cyan), #38bdf8)'
                      }} />
                    </div>
                  </div>
                )}

                {/* Sub-checklists */}
                {goal.checklists && goal.checklists.length > 0 && (
                  <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Checklist de Tarefas
                    </span>
                    {goal.checklists.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(goal.id, item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.83rem',
                          color: item.done ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: item.done ? 'line-through' : 'none',
                          cursor: 'pointer',
                          padding: '0.3rem 0.5rem',
                          borderRadius: '6px',
                          background: 'rgba(15, 20, 32, 0.4)'
                        }}
                      >
                        {item.done ? (
                          <CheckSquare size={16} color="var(--accent-emerald)" />
                        ) : (
                          <Square size={16} color="var(--text-muted)" />
                        )}
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer do Card */}
              <div style={{
                marginTop: '1rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--bg-glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Prazo: {formatDate(goal.deadline)}
                </span>

                {goal.targetAmount > 0 && !isDone && (
                  <button
                    onClick={() => handleQuickAddAmount(goal)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: 'var(--accent-cyan)' }}
                  >
                    <TrendingUp size={14} /> + Aporte
                  </button>
                )}

                {isDone && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={16} /> Concluída!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Editar Meta' : 'Nova Meta'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título da Meta</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Comprar Equipamento de Trabalho / Reserva"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="pessoal">Pessoal (PF)</option>
                <option value="empresarial">Empresarial (PJ)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Data Limite (Prazo)</label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Valor Alvo (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="10000.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor Atual Já Acumulado (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição / Observações</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Detalhes adicionais sobre o objetivo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Sub-checklist Manager */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Adicionar Sub-tarefas / Passos</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="ex: Cotar preços, fazer aporte inicial..."
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
              />
              <button type="button" onClick={handleAddChecklistItem} className="btn btn-secondary">
                Adicionar
              </button>
            </div>

            {formData.checklists.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {formData.checklists.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: 'rgba(15, 20, 32, 0.5)', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <span>{c.title}</span>
                    <button type="button" onClick={() => handleRemoveChecklistItem(c.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingGoal ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
