import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GOALS, INITIAL_TRANSACTIONS, INITIAL_CLIENTS, INITIAL_EVENTS } from '../utils/initialData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Estado de Autenticação / Login Personalizado Vertex Digital
  const [userSession, setUserSession] = useState(() => {
    const saved = localStorage.getItem('vertex_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isAuthenticated === 'boolean') {
          return parsed;
        }
      } catch (e) {
        console.error('Erro ao ler sessão do usuário:', e);
      }
    }
    return { isAuthenticated: false, user: null };
  });

  const login = (email, password, rememberMe = true) => {
    const session = {
      isAuthenticated: true,
      user: {
        name: 'Gabriel Lima',
        role: 'Consultor Náutico',
        email: email || 'gabriel.lima@vertexdigital.com'
      }
    };

    setUserSession(session);
    if (rememberMe) {
      localStorage.setItem('vertex_user_session', JSON.stringify(session));
    }
    triggerCelebration();
  };

  const logout = () => {
    localStorage.removeItem('vertex_user_session');
    localStorage.setItem('vertex_user_session', JSON.stringify({ isAuthenticated: false, user: null }));
    setUserSession({ isAuthenticated: false, user: null });
    window.location.reload();
  };

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

  // Estado de Notificações em Tempo Real
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('vertex_notifications');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'n1', title: '📅 Compromisso Próximo', description: 'Reunião com fornecedor agendada na Agenda', time: 'Hoje', unread: true, linkTab: 'agenda' },
          { id: 'n2', title: '💰 Comissão Venda Barco', description: 'Venda Ventura de Barco cadastrada com 1,25% de comissão', time: 'Hoje', unread: true, linkTab: 'clientes' },
          { id: 'n3', title: '🎯 Meta Atualizada', description: 'Você está no caminho para atingir a meta mensal', time: 'Ontem', unread: true, linkTab: 'metas' }
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
    localStorage.setItem('vertex_notifications', JSON.stringify(notifications));
  }, [notifications]);

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

  // Adicionar Notificação Dinâmica
  const addNotification = (title, description, linkTab = 'dashboard') => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      description,
      time: 'Agora',
      unread: true,
      linkTab
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // --- Ações de Metas ---
  const addGoal = (newGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
    addNotification('🎯 Nova Meta Adicionada', `Meta "${newGoal.title}" cadastrada com sucesso.`, 'metas');
  };

  const updateGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === updatedGoal.id) {
          if (updatedGoal.status === 'concluida' && g.status !== 'concluida') {
            triggerCelebration();
            addNotification('🎉 Meta Concluída!', `Parabéns! Você concluiu a meta "${g.title}".`, 'metas');
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
    addNotification('💰 Novo Lançamento Financeiro', `${newTx.description} (${newTx.account.toUpperCase()}) registrado.`, 'financas');

    if (newTx.type === 'receita') {
      const targetCategory = newTx.account === 'pessoal' ? 'pessoal' : 'empresarial';
      setGoals((prevGoals) =>
        prevGoals.map((g) => {
          if (g.category === targetCategory && g.status === 'em_andamento' && g.targetAmount > 0) {
            const newAmount = g.currentAmount + parseFloat(newTx.amount);
            const isFinished = newAmount >= g.targetAmount;
            if (isFinished) {
              triggerCelebration();
              addNotification('🎉 Meta Atingida!', `Seu lançamento financiou e concluiu a meta "${g.title}"!`, 'metas');
            }
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
    addNotification('🔄 Pró-Labore Efetuado', `Retirada de R$ ${numVal.toFixed(2)} transferida da Empresa para Conta Pessoal.`, 'financas');
  };

  // --- Ações de Clientes CRM com Lógica Ventura ---
  const addClient = (newClient) => {
    const isPF = newClient.category === 'pessoal';
    const rate = newClient.commissionRate || 1.25;
    const numVal = parseFloat(newClient.value) || 0;
    const computedCommission = isPF ? (numVal * rate) / 100 : numVal;

    const fullClient = {
      ...newClient,
      commissionRate: rate,
      commissionValue: computedCommission
    };

    setClients((prev) => [fullClient, ...prev]);
    addNotification(
      isPF ? '🚤 Nova Venda Barco Ventura' : '🏢 Novo Cliente PJ',
      isPF ? `Cliente ${newClient.name} cadastrado. Comissão (1,25%): R$ ${computedCommission.toFixed(2)}` : `Cliente PJ ${newClient.name} registrado.`,
      'clientes'
    );
  };

  const updateClient = (updatedClient) => {
    const isPF = updatedClient.category === 'pessoal';
    const rate = updatedClient.commissionRate || 1.25;
    const numVal = parseFloat(updatedClient.value) || 0;
    const computedCommission = isPF ? (numVal * rate) / 100 : numVal;

    const fullClient = {
      ...updatedClient,
      commissionRate: rate,
      commissionValue: computedCommission
    };

    setClients((prev) =>
      prev.map((c) => (c.id === fullClient.id ? fullClient : c))
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
            addNotification('🤝 Contrato Fechado!', `Cliente ${c.name} avançou para Contrato Fechado!`, 'clientes');
          }
          return { ...c, status: newStageId };
        }
        return c;
      })
    );
  };

  const generateClientPayment = (client) => {
    const isPessoal = client.category === 'pessoal';
    const rate = client.commissionRate || 1.25;
    const totalSaleVal = parseFloat(client.value) || 0;
    const commissionVal = client.commissionValue || (totalSaleVal * rate) / 100;

    const txAmount = isPessoal ? commissionVal : totalSaleVal;

    const tx = {
      id: Date.now().toString(),
      description: isPessoal
        ? `Comissão (${rate}%) Venda Ventura - ${client.name}`
        : `Receita Contrato PJ - ${client.name}`,
      amount: txAmount,
      type: 'receita',
      account: isPessoal ? 'pessoal' : 'empresa',
      category: isPessoal ? 'Comissão Venda Barco (Ventura)' : (client.contractType === 'mensalidade' ? 'Contrato Recorrente' : 'Projeto Pontual'),
      date: new Date().toISOString().split('T')[0],
      recurring: !isPessoal && client.contractType === 'mensalidade',
      clientId: client.id
    };

    addTransaction(tx);
    triggerCelebration();
  };

  // --- Ações de Agenda & Compromissos ---
  const addEvent = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    addNotification('📅 Novo Agendamento', `Compromisso "${newEvent.title}" marcado para ${newEvent.date} às ${newEvent.time}`, 'agenda');
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
    addNotification('📝 Nova Tarefa Criada', `Tarefa "${taskText}" (${priority}) criada para ${date}.`, 'dashboard');
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
    const data = { goals, transactions, clients, events, tasks, notifications, system: 'Vertex Digital', version: '2.5' };
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
        userSession,
        login,
        logout,
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
        notifications,
        addNotification,
        markNotificationsRead,
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
