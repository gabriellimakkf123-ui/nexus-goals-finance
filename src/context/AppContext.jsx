import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GOALS, INITIAL_TRANSACTIONS, INITIAL_CLIENTS, INITIAL_EVENTS } from '../utils/initialData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Estado de Metas
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('vertex_goals') || localStorage.getItem('nexus_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  // Estado de Transações Financeiras
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('vertex_transactions') || localStorage.getItem('nexus_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Estado de Clientes / Leads (CRM)
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('vertex_clients') || localStorage.getItem('nexus_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  // Estado de Agenda & Compromissos
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('vertex_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Estado de Tarefas do Dashboard
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('vertex_tasks');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 't1', text: 'Ligar para João Silva', priority: 'Alta', date: '2026-08-02', done: false },
          { id: 't2', text: 'Reunião com fornecedor', priority: 'Média', date: '2026-08-03', done: false },
          { id: 't3', text: 'Enviar proposta para Marcos Almeida', priority: 'Alta', date: '2026-08-04', done: false }
        ];
  });

  // Modo Escuro / Claro
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vertex_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // Salvando no LocalStorage
  useEffect(() => {
    localStorage.setItem('vertex_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('vertex_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('vertex_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('vertex_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('vertex_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('vertex_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect trigger', e);
    }
  };

  // --- Ações de Metas ---
  const addGoal = (newGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === updatedGoal.id) {
          if (updatedGoal.status === 'concluida' && g.status !== 'concluida') {
            triggerCelebration();
          }
          return updatedGoal;
        }
        return g;
      })
    );
  };

  const deleteGoal = (goalId) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const toggleChecklistItem = (goalId, itemId) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedChecklists = g.checklists.map((c) =>
            c.id === itemId ? { ...c, done: !c.done } : c
          );
          return { ...g, checklists: updatedChecklists };
        }
        return g;
      })
    );
  };

  // --- Ações Financeiras ---
  const addTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.type === 'receita') {
      const targetCategory = newTx.account === 'pessoal' ? 'pessoal' : 'empresarial';
      setGoals((prevGoals) =>
        prevGoals.map((g) => {
          if (g.category === targetCategory && g.status === 'em_andamento' && g.targetAmount > 0) {
            const newAmount = g.currentAmount + parseFloat(newTx.amount);
            const isFinished = newAmount >= g.targetAmount;
            if (isFinished) triggerCelebration();
            return {
              ...g,
              currentAmount: newAmount,
              status: isFinished ? 'concluida' : g.status
            };
          }
          return g;
        })
      );
    }
  };

  const deleteTransaction = (txId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
  };

  const addProlaboreTransfer = (amount, date) => {
    const numVal = parseFloat(amount);
    const txPJ = {
      id: Date.now().toString() + '-pj',
      description: 'Transferência de Pró-Labore (PJ)',
      amount: numVal,
      type: 'prolabore',
      account: 'empresa',
      category: 'Pró-Labore',
      date: date || new Date().toISOString().split('T')[0],
      recurring: true
    };

    const txPF = {
      id: Date.now().toString() + '-pf',
      description: 'Recebimento de Pró-Labore (PF)',
      amount: numVal,
      type: 'receita',
      account: 'pessoal',
      category: 'Salário / Pró-Labore',
      date: date || new Date().toISOString().split('T')[0],
      recurring: true
    };

    setTransactions((prev) => [txPJ, txPF, ...prev]);
  };

  // --- Ações de Clientes CRM ---
  const addClient = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const updateClient = (updatedClient) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  };

  const deleteClient = (clientId) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  const moveClientStage = (clientId, newStageId) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          if (newStageId === 'fechado' && c.status !== 'fechado') {
            triggerCelebration();
          }
          return { ...c, status: newStageId };
        }
        return c;
      })
    );
  };

  const generateClientPayment = (client) => {
    const isPessoal = client.category === 'pessoal';
    const tx = {
      id: Date.now().toString(),
      description: `Pagamento ${client.contractType === 'mensalidade' ? 'Mensal' : 'Projeto'} - ${client.name}`,
      amount: client.value,
      type: 'receita',
      account: isPessoal ? 'pessoal' : 'empresa',
      category: client.contractType === 'mensalidade' ? 'Contrato Recorrente' : 'Projeto Pontual',
      date: new Date().toISOString().split('T')[0],
      recurring: client.contractType === 'mensalidade',
      clientId: client.id
    };
    addTransaction(tx);
    triggerCelebration();
  };

  // --- Ações de Agenda & Compromissos ---
  const addEvent = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // --- Ações de Tarefas ---
  const addTask = (taskText, priority = 'Média', date = new Date().toISOString().split('T')[0]) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      priority,
      date,
      done: false
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Backup & Restauração
  const exportData = () => {
    const data = { goals, transactions, clients, events, tasks, system: 'Vertex Digital', version: '2.5' };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vertex_digital_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.clients) setClients(parsed.clients);
      if (parsed.events) setEvents(parsed.events);
      if (parsed.tasks) setTasks(parsed.tasks);
      alert('Dados importados no Vertex Digital com sucesso!');
    } catch (e) {
      alert('Erro ao importar dados.');
    }
  };

  const resetToSampleData = () => {
    if (confirm('Deseja restaurar os dados de demonstração do Vertex Digital?')) {
      setGoals(INITIAL_GOALS);
      setTransactions(INITIAL_TRANSACTIONS);
      setClients(INITIAL_CLIENTS);
      setEvents(INITIAL_EVENTS);
    }
  };

  return (
    <AppContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleChecklistItem,
        transactions,
        addTransaction,
        deleteTransaction,
        addProlaboreTransfer,
        clients,
        addClient,
        updateClient,
        deleteClient,
        moveClientStage,
        generateClientPayment,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        darkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        exportData,
        importData,
        resetToSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
