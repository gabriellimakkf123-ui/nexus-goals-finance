import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GOALS, INITIAL_TRANSACTIONS, INITIAL_CLIENTS } from '../utils/initialData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Inicialização com LocalStorage ou dados iniciais
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('nexus_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nexus_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('nexus_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'metas', 'financas', 'clientes'

  // Efeito para salvar no LocalStorage
  useEffect(() => {
    localStorage.setItem('nexus_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('nexus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nexus_clients', JSON.stringify(clients));
  }, [clients]);

  // Função para lançar confetes de comemoração
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

    // Atualizar metas automaticamente se for uma receita
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

  // Registro de Pró-Labore (Registra saída na Empresa e Entrada no Pessoal)
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

  // Lançar cobrança/receita vinda de um Cliente (direcionada para a conta PF ou PJ correspondente)
  const generateClientPayment = (client) => {
    const isPessoal = client.category === 'pessoal';
    const tx = {
      id: Date.now().toString(),
      description: `Pagamento ${client.contractType === 'mensalidade' ? 'Mensal' : 'Projeto'} - ${client.name}`,
      amount: client.value,
      type: 'receita',
      account: isPessoal ? 'pessoal' : 'empresa', // Direciona para PF ou PJ!
      category: client.contractType === 'mensalidade' ? 'Contrato Recorrente' : 'Projeto Pontual',
      date: new Date().toISOString().split('T')[0],
      recurring: client.contractType === 'mensalidade',
      clientId: client.id
    };
    addTransaction(tx);
    triggerCelebration();
  };

  // Backup & Restauração
  const exportData = () => {
    const data = { goals, transactions, clients, version: '1.0' };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.clients) setClients(parsed.clients);
      alert('Dados importados com sucesso!');
    } catch (e) {
      alert('Erro ao importar dados. Verifique o formato do arquivo.');
    }
  };

  const resetToSampleData = () => {
    if (confirm('Deseja restaurar os dados de demonstração originais com os CRMs PF e PJ?')) {
      setGoals(INITIAL_GOALS);
      setTransactions(INITIAL_TRANSACTIONS);
      setClients(INITIAL_CLIENTS);
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
