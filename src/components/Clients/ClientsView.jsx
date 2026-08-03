import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KANBAN_STAGES } from '../../utils/initialData';
import { formatCurrency, generateId } from '../../utils/formatters';
import { Users, Plus, DollarSign, Edit2, Trash2, Building2, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { Modal } from '../Common/Modal';

export const ClientsView = ({ isModalOpen, setIsModalOpen }) => {
  const { clients, addClient, updateClient, deleteClient, moveClientStage, generateClientPayment } = useApp();
  const [editingClient, setEditingClient] = useState(null);
  
  // Filtro de Quadro CRM: 'empresa', 'pessoal', 'todos'
  const [crmCategory, setCrmCategory] = useState('empresa');
  
  // Filtro por tipo de contrato: 'todos', 'mensalidade', 'projeto_pontual'
  const [filterContractType, setFilterContractType] = useState('todos');

  // Form State
  const [clientForm, setClientForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    category: 'empresa', // 'empresa' (PJ) ou 'pessoal' (PF)
    status: 'prospeccao',
    contractType: 'mensalidade',
    value: '',
    notes: '',
    tagsStr: ''
  });

  const openAddModal = (presetCategory = crmCategory === 'todos' ? 'empresa' : crmCategory) => {
    setEditingClient(null);
    setClientForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      category: presetCategory,
      status: 'prospeccao',
      contractType: 'mensalidade',
      value: '',
      notes: '',
      tagsStr: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      contactPerson: client.contactPerson || '',
      email: client.email || '',
      phone: client.phone || '',
      category: client.category || 'empresa',
      status: client.status,
      contractType: client.contractType,
      value: client.value || '',
      notes: client.notes || '',
      tagsStr: (client.tags || []).join(', ')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientForm.name.trim()) return;

    const tagsArr = clientForm.tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    const clientData = {
      name: clientForm.name,
      contactPerson: clientForm.contactPerson,
      email: clientForm.email,
      phone: clientForm.phone,
      category: clientForm.category,
      status: clientForm.status,
      contractType: clientForm.contractType,
      value: parseFloat(clientForm.value) || 0,
      notes: clientForm.notes,
      tags: tagsArr
    };

    if (editingClient) {
      updateClient({ ...editingClient, ...clientData });
    } else {
      addClient({ id: generateId(), ...clientData });
    }
    setIsModalOpen(false);
  };

  // Suporte a Arrastar e Soltar (HTML5 Drag and Drop)
  const handleDragStart = (e, clientId) => {
    e.dataTransfer.setData('text/plain', clientId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    const clientId = e.dataTransfer.getData('text/plain');
    if (clientId) {
      moveClientStage(clientId, stageId);
    }
  };

  // Filtragem de clientes por Categoria CRM (PJ vs PF) e Tipo de Contrato
  const filteredClients = clients.filter((c) => {
    const matchCategory = crmCategory === 'todos' || c.category === crmCategory;
    const matchType = filterContractType === 'todos' || c.contractType === filterContractType;
    return matchCategory && matchType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Seletor do Quadro CRM (Empresarial PJ vs Pessoal PF) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Abas Principais PJ vs PF */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 20, 32, 0.6)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)' }}>
          <button
            onClick={() => setCrmCategory('empresa')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: crmCategory === 'empresa' ? 'rgba(6, 182, 212, 0.2)' : 'transparent', color: crmCategory === 'empresa' ? 'var(--accent-cyan)' : 'var(--text-secondary)'
            }}
          >
            <Building2 size={16} /> CRM Empresarial (PJ)
          </button>

          <button
            onClick={() => setCrmCategory('pessoal')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: crmCategory === 'pessoal' ? 'rgba(157, 78, 221, 0.2)' : 'transparent', color: crmCategory === 'pessoal' ? 'var(--color-pessoal)' : 'var(--text-secondary)'
            }}
          >
            <User size={16} /> CRM Pessoal (PF)
          </button>

          <button
            onClick={() => setCrmCategory('todos')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: crmCategory === 'todos' ? 'rgba(255, 255, 255, 0.12)' : 'transparent', color: crmCategory === 'todos' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <Users size={16} /> Todos os Quadros
          </button>
        </div>

        {/* Filtro por Contrato & Botão Adicionar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', width: 'auto' }}
            value={filterContractType}
            onChange={(e) => setFilterContractType(e.target.value)}
          >
            <option value="todos">Todos os Tipos de Contrato</option>
            <option value="mensalidade">Apenas Mensalidades (MRR)</option>
            <option value="projeto_pontual">Apenas Projetos Pontuais</option>
          </select>

          <button onClick={() => openAddModal()} className={crmCategory === 'pessoal' ? 'btn btn-primary' : 'btn btn-emerald'}>
            <Plus size={18} /> {crmCategory === 'pessoal' ? 'Novo Card PF' : 'Novo Cliente PJ'}
          </button>
        </div>
      </div>

      {/* Banner Explicativo do Quadro Selecionado */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-sm)',
        background: crmCategory === 'pessoal' ? 'rgba(157, 78, 221, 0.1)' : crmCategory === 'empresa' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${crmCategory === 'pessoal' ? 'rgba(157, 78, 221, 0.25)' : crmCategory === 'empresa' ? 'rgba(6, 182, 212, 0.25)' : 'var(--bg-glass-border)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {crmCategory === 'pessoal' ? <User size={20} color="var(--color-pessoal)" /> : <Building2 size={20} color="var(--accent-cyan)" />}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
              {crmCategory === 'pessoal' ? 'Quadro CRM Pessoal (PF)' : crmCategory === 'empresa' ? 'Quadro CRM Empresarial (PJ)' : 'Visão Geral Integrada (PF + PJ)'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {crmCategory === 'pessoal'
                ? 'Gerencie freelas pessoais, vendas de bens, tutorias e contatos informais. Os pagamentos entram direto no Caixa Pessoal (PF).'
                : crmCategory === 'empresa'
                ? 'Gerencie clientes corporativos, propostas B2B e contratos da empresa. Os pagamentos entram direto no Caixa PJ.'
                : 'Exibindo todos os cartões cadastrados nos dois módulos.'}
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board das Etapas */}
      <div className="kanban-board">
        {KANBAN_STAGES.map((stage) => {
          const stageClients = filteredClients.filter((c) => c.status === stage.id);
          const stageTotalVal = stageClients.reduce((sum, c) => sum + parseFloat(c.value), 0);

          return (
            <div
              key={stage.id}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Header da Coluna */}
              <div className="kanban-column-header">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color }} />
                    {stage.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {stageClients.length} {stageClients.length === 1 ? 'item' : 'itens'} • {formatCurrency(stageTotalVal)}
                  </span>
                </div>
              </div>

              {/* Lista de Cartões Arrastáveis */}
              <div className="kanban-cards-container">
                {stageClients.map((client) => {
                  const isRecorrente = client.contractType === 'mensalidade';
                  const isPessoal = client.category === 'pessoal';

                  return (
                    <div
                      key={client.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, client.id)}
                      className="glass-card"
                      style={{
                        cursor: 'grab',
                        padding: '1rem',
                        borderLeft: `4px solid ${isPessoal ? 'var(--color-pessoal)' : 'var(--accent-cyan)'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${isPessoal ? 'badge-pessoal' : 'badge-empresa'}`}>
                            {isPessoal ? 'PF' : 'PJ'}
                          </span>
                          <span className={`badge ${isRecorrente ? 'badge-recorrente' : 'badge-pontual'}`}>
                            {isRecorrente ? 'Mensal' : 'Pontual'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          <button onClick={() => openEditModal(client)} className="btn-icon" style={{ padding: '0.3rem' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => deleteClient(client.id)} className="btn-icon" style={{ padding: '0.3rem', color: 'var(--accent-rose)' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>
                        {client.name}
                      </h5>
                      {client.contactPerson && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Contato: {client.contactPerson}
                        </p>
                      )}

                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isRecorrente ? 'var(--accent-emerald)' : 'var(--accent-amber)', margin: '0.4rem 0' }}>
                        {formatCurrency(client.value)}
                        {isRecorrente && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/mês</span>}
                      </div>

                      {client.notes && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(15, 20, 32, 0.5)', padding: '0.4rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                          {client.notes}
                        </p>
                      )}

                      {/* Botão de Lançar Cobrança Financeira se o contrato estiver fechado */}
                      {client.status === 'fechado' && (
                        <button
                          onClick={() => generateClientPayment(client)}
                          className="btn btn-secondary"
                          style={{
                            width: '100%', fontSize: '0.75rem', padding: '0.35rem',
                            color: isPessoal ? 'var(--color-pessoal)' : 'var(--accent-emerald)',
                            borderColor: isPessoal ? 'rgba(157, 78, 221, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                            marginTop: '0.4rem'
                          }}
                        >
                          <DollarSign size={14} /> Registrar no Caixa {isPessoal ? 'Pessoal (PF)' : 'Empresa (PJ)'}
                        </button>
                      )}

                      {/* Botões rápidos de mudança de etapa */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--bg-glass-border)' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Arraste para mover</span>
                        
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {stage.id !== 'prospeccao' && (
                            <button
                              onClick={() => {
                                const currentIndex = KANBAN_STAGES.findIndex(s => s.id === stage.id);
                                if (currentIndex > 0) moveClientStage(client.id, KANBAN_STAGES[currentIndex - 1].id);
                              }}
                              className="btn-icon"
                              style={{ padding: '0.25rem' }}
                              title="Etapa Anterior"
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}

                          {stage.id !== 'perdido' && (
                            <button
                              onClick={() => {
                                const currentIndex = KANBAN_STAGES.findIndex(s => s.id === stage.id);
                                if (currentIndex < KANBAN_STAGES.length - 1) moveClientStage(client.id, KANBAN_STAGES[currentIndex + 1].id);
                              }}
                              className="btn-icon"
                              style={{ padding: '0.25rem' }}
                              title="Próxima Etapa"
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação e Edição de Cliente/Contato */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Editar Oportunidade' : 'Nova Oportunidade / Cliente'}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Quadro / Módulo CRM</label>
              <select
                className="form-select"
                value={clientForm.category}
                onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })}
              >
                <option value="empresa">Empresarial (PJ)</option>
                <option value="pessoal">Pessoal (PF)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Contrato / Acordo</label>
              <select
                className="form-select"
                value={clientForm.contractType}
                onChange={(e) => setClientForm({ ...clientForm, contractType: e.target.value })}
              >
                <option value="mensalidade">Mensalidade Recorrente (MRR)</option>
                <option value="projeto_pontual">Projeto Pontual / Único</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome da Empresa / Cliente / Projeto</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: TechCorp ou Mentoria Individual"
              value={clientForm.name}
              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="ex: 3500.00"
                value={clientForm.value}
                onChange={(e) => setClientForm({ ...clientForm, value: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pessoa de Contato</label>
              <input
                type="text"
                className="form-input"
                placeholder="ex: João Silva"
                value={clientForm.contactPerson}
                onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Etapa Inicial do Funil</label>
              <select
                className="form-select"
                value={clientForm.status}
                onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
              >
                {KANBAN_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Telefone / WhatsApp</label>
              <input
                type="text"
                className="form-input"
                placeholder="(11) 99999-8888"
                value={clientForm.phone}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              placeholder="contato@cliente.com"
              value={clientForm.email}
              onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notas e Detalhes</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Escopo resumido, preferências..."
              value={clientForm.notes}
              onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (separadas por vírgula)</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Freela, Mentoria, SaaS, VIP"
              value={clientForm.tagsStr}
              onChange={(e) => setClientForm({ ...clientForm, tagsStr: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className={clientForm.category === 'pessoal' ? 'btn btn-primary' : 'btn btn-emerald'}>
              {editingClient ? 'Salvar Alterações' : 'Cadastrar no CRM'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
