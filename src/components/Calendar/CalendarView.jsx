import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, generateId } from '../../utils/formatters';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight, User, Building2, Trash2, Edit2 } from 'lucide-react';
import { Modal } from '../Common/Modal';

export const CalendarView = ({ isModalOpen, setIsModalOpen }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();

  // Data atual e controle do calendário
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateStr, setSelectedDateStr] = useState(today.toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState('todas'); // 'todas', 'empresa', 'pessoal'

  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'empresa',
    date: selectedDateStr,
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
    relatedClient: ''
  });

  // Navegação do mês
  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  // Cálculos da grade do mês
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Primeiro dia do mês (0 = Domingo, 6 = Sábado)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // Total de dias no mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Gerar células do calendário
  const calendarCells = [];
  // Espaços em branco antes do dia 1
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    calendarCells.push({ day, dateStr });
  }

  // Modais de Adicionar/Editar Eventos
  const openAddModalForDate = (dateStr = selectedDateStr) => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      category: filterCategory === 'pessoal' ? 'pessoal' : 'empresa',
      date: dateStr,
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      notes: '',
      relatedClient: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setEventForm({
      title: ev.title,
      category: ev.category || 'empresa',
      date: ev.date,
      startTime: ev.startTime || '09:00',
      endTime: ev.endTime || '10:00',
      location: ev.location || '',
      notes: ev.notes || '',
      relatedClient: ev.relatedClient || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) return;

    if (editingEvent) {
      updateEvent({ ...editingEvent, ...eventForm });
    } else {
      addEvent({ id: generateId(), ...eventForm });
    }
    setIsModalOpen(false);
  };

  // Filtrar eventos por categoria
  const filteredEvents = events.filter((e) => {
    if (filterCategory === 'todas') return true;
    return e.category === filterCategory;
  });

  // Eventos do dia selecionado
  const selectedDayEvents = filteredEvents.filter((e) => e.date === selectedDateStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

      {/* Header com Filtros & Botão de Agendamento */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 20, 32, 0.6)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-glass-border)' }}>
          <button
            onClick={() => setFilterCategory('todas')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: filterCategory === 'todas' ? 'rgba(255, 255, 255, 0.12)' : 'transparent', color: filterCategory === 'todas' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <CalendarIcon size={16} /> Toda a Agenda (PF + PJ)
          </button>

          <button
            onClick={() => setFilterCategory('empresa')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: filterCategory === 'empresa' ? 'rgba(6, 182, 212, 0.2)' : 'transparent', color: filterCategory === 'empresa' ? 'var(--accent-cyan)' : 'var(--text-secondary)'
            }}
          >
            <Building2 size={16} /> Empresa (PJ)
          </button>

          <button
            onClick={() => setFilterCategory('pessoal')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: filterCategory === 'pessoal' ? 'rgba(157, 78, 221, 0.2)' : 'transparent', color: filterCategory === 'pessoal' ? 'var(--color-pessoal)' : 'var(--text-secondary)'
            }}
          >
            <User size={16} /> Pessoal (PF)
          </button>
        </div>

        <button onClick={() => openAddModalForDate()} className="btn btn-cyan">
          <Plus size={18} /> Agendar Compromisso
        </button>
      </div>

      {/* Grid Flexível de Layout: Calendário à Esquerda + Painel Lateral da Agenda à Direita */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%', alignItems: 'stretch' }}>
        
        {/* Painel do Calendário (Flex 1, Responsivo) */}
        <div className="glass-panel" style={{ flex: '1 1 550px', minWidth: '0', padding: '1.5rem', overflow: 'hidden' }}>
          
          {/* Navegação do Mês */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', textTransform: 'capitalize' }}>
                {monthName}
              </h3>
              <button onClick={goToToday} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                Hoje
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={prevMonth} className="btn-icon" title="Mês Anterior">
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextMonth} className="btn-icon" title="Próximo Mês">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Cabeçalho dos Dias da Semana */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.35rem',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}>
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          {/* Grade Perfeita dos Dias do Mês */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.35rem',
            width: '100%'
          }}>
            {calendarCells.map((cell, index) => {
              if (!cell) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={{
                      minHeight: '80px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid transparent'
                    }}
                  />
                );
              }

              const isToday = cell.dateStr === today.toISOString().split('T')[0];
              const isSelected = cell.dateStr === selectedDateStr;
              const dayEvents = filteredEvents.filter((e) => e.date === cell.dateStr);

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  style={{
                    minHeight: '80px',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    background: isSelected
                      ? 'rgba(6, 182, 212, 0.18)'
                      : isToday
                      ? 'rgba(157, 78, 221, 0.18)'
                      : 'rgba(15, 20, 32, 0.7)',
                    border: `1px solid ${
                      isSelected
                        ? 'var(--accent-cyan)'
                        : isToday
                        ? 'var(--accent-purple)'
                        : 'var(--bg-glass-border)'
                    }`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: isToday || isSelected ? 800 : 600,
                      color: isToday ? 'var(--accent-purple)' : isSelected ? 'var(--accent-cyan)' : 'white'
                    }}>
                      {cell.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.05rem 0.3rem', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Lista de Eventos no Célula do Dia */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem', overflow: 'hidden' }}>
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.3rem',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          background: ev.category === 'pessoal' ? 'rgba(157, 78, 221, 0.35)' : 'rgba(6, 182, 212, 0.35)',
                          color: ev.category === 'pessoal' ? '#e9d5ff' : '#bae6fd',
                          borderLeft: `2px solid ${ev.category === 'pessoal' ? 'var(--color-pessoal)' : 'var(--accent-cyan)'}`
                        }}
                      >
                        {ev.startTime ? `${ev.startTime} ` : ''}{ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        +{dayEvents.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Painel Lateral da Agenda do Dia Selecionado */}
        <div className="glass-panel" style={{ flex: '0 0 340px', minWidth: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--accent-cyan)" /> Agenda do Dia
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {formatDate(selectedDateStr)}
              </span>
            </div>

            <button onClick={() => openAddModalForDate(selectedDateStr)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}>
              <Plus size={14} /> Novo
            </button>
          </div>

          {/* Lista de Eventos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto', maxHeight: '520px' }}>
            {selectedDayEvents.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(15, 20, 32, 0.4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--bg-glass-border)' }}>
                Nenhum compromisso agendado para esta data.<br /><br />
                Clique no botão <strong>+ Novo</strong> para incluir um horário na sua agenda.
              </div>
            ) : (
              selectedDayEvents.map((ev) => {
                const isPessoal = ev.category === 'pessoal';

                return (
                  <div
                    key={ev.id}
                    className="glass-card"
                    style={{
                      padding: '0.9rem 1rem',
                      borderLeft: `4px solid ${isPessoal ? 'var(--color-pessoal)' : 'var(--accent-cyan)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span className={`badge ${isPessoal ? 'badge-pessoal' : 'badge-empresa'}`}>
                        {isPessoal ? 'Pessoal (PF)' : 'Empresa (PJ)'}
                      </span>

                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button onClick={() => openEditModal(ev)} className="btn-icon" style={{ padding: '0.25rem' }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteEvent(ev.id)} className="btn-icon" style={{ padding: '0.25rem', color: 'var(--accent-rose)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '0.3rem' }}>
                      {ev.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                        <Clock size={13} /> {ev.startTime || '09:00'} - {ev.endTime || '10:00'}
                      </span>

                      {ev.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={13} color="var(--accent-cyan)" /> {ev.location}
                        </span>
                      )}
                    </div>

                    {ev.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(15, 20, 32, 0.5)', padding: '0.4rem', borderRadius: '4px' }}>
                        {ev.notes}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Modal de Adicionar / Editar Evento */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? 'Editar Compromisso' : 'Agendar Novo Compromisso'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título do Compromisso</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Reunião de Alinhamento ou Consulta Médica"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Categoria / Módulo</label>
              <select
                className="form-select"
                value={eventForm.category}
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
              >
                <option value="empresa">Empresarial (PJ)</option>
                <option value="pessoal">Pessoal (PF)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-input"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Horário de Início</label>
              <input
                type="time"
                className="form-input"
                value={eventForm.startTime}
                onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horário de Término</label>
              <input
                type="time"
                className="form-input"
                value={eventForm.endTime}
                onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Localização ou Link da Reunião</label>
            <input
              type="text"
              className="form-input"
              placeholder="ex: Google Meet, Zoom ou Endereço do Consultório"
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Observações e Pauta</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Notas importantes sobre o agendamento..."
              value={eventForm.notes}
              onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className={eventForm.category === 'pessoal' ? 'btn btn-primary' : 'btn btn-cyan'}>
              {editingEvent ? 'Salvar Compromisso' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
