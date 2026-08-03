import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { GoalsView } from './components/Goals/GoalsView';
import { FinanceView } from './components/Finance/FinanceView';
import { ClientsView } from './components/Clients/ClientsView';

const MainLayout = () => {
  const { activeTab } = useApp();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProlaboreModalOpen, setIsProlaboreModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header
          onOpenGoalModal={() => setIsGoalModalOpen(true)}
          onOpenTxModal={() => setIsTxModalOpen(true)}
          onOpenClientModal={() => setIsClientModalOpen(true)}
          onOpenProlaboreModal={() => setIsProlaboreModalOpen(true)}
        />

        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onOpenTxModal={() => setIsTxModalOpen(true)}
            onOpenClientModal={() => setIsClientModalOpen(true)}
          />
        )}

        {activeTab === 'metas' && (
          <GoalsView
            isModalOpen={isGoalModalOpen}
            setIsModalOpen={setIsGoalModalOpen}
          />
        )}

        {activeTab === 'financas' && (
          <FinanceView
            isModalOpen={isTxModalOpen}
            setIsModalOpen={setIsTxModalOpen}
            isProlaboreOpen={isProlaboreModalOpen}
            setIsProlaboreOpen={setIsProlaboreModalOpen}
          />
        )}

        {activeTab === 'clientes' && (
          <ClientsView
            isModalOpen={isClientModalOpen}
            setIsModalOpen={setIsClientModalOpen}
          />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
