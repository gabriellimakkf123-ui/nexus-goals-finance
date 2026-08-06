import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { CalendarView } from './components/Calendar/CalendarView';
import { GoalsView } from './components/Goals/GoalsView';
import { FinanceView } from './components/Finance/FinanceView';
import { ClientsView } from './components/Clients/ClientsView';
import { DatabaseSettingsModal } from './components/Settings/DatabaseSettingsModal';
import { GlobalModals } from './components/Common/GlobalModals';
import { LoginView } from './components/Auth/LoginView';

const MainLayout = () => {
  const { activeTab, userSession } = useApp();

  // Se o usuário não estiver autenticado, exibe a Tela de Login Personalizada Vertex Digital
  if (!userSession?.isAuthenticated) {
    return <LoginView />;
  }

  // Modais globais (renderizados SEMPRE no topo da aplicação)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProlaboreModalOpen, setIsProlaboreModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenTxModal={() => setIsTxModalOpen(true)}
        onOpenClientModal={() => setIsClientModalOpen(true)}
      />

      <main className="main-content">
        <Header
          onOpenGoalModal={() => setIsGoalModalOpen(true)}
          onOpenTxModal={() => setIsTxModalOpen(true)}
          onOpenClientModal={() => setIsClientModalOpen(true)}
          onOpenProlaboreModal={() => setIsProlaboreModalOpen(true)}
          onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
          onOpenDbModal={() => setIsDbModalOpen(true)}
        />

        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onOpenTxModal={() => setIsTxModalOpen(true)}
            onOpenClientModal={() => setIsClientModalOpen(true)}
            onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
          />
        )}

        {activeTab === 'agenda' && (
          <CalendarView
            isModalOpen={isCalendarModalOpen}
            setIsModalOpen={setIsCalendarModalOpen}
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

        {/* Global Modals sempre ativos e visíveis em qualquer tela da aplicação */}
        <GlobalModals
          isGoalModalOpen={isGoalModalOpen} setIsGoalModalOpen={setIsGoalModalOpen}
          isTxModalOpen={isTxModalOpen} setIsTxModalOpen={setIsTxModalOpen}
          isClientModalOpen={isClientModalOpen} setIsClientModalOpen={setIsClientModalOpen}
          isProlaboreModalOpen={isProlaboreModalOpen} setIsProlaboreModalOpen={setIsProlaboreModalOpen}
          isCalendarModalOpen={isCalendarModalOpen} setIsCalendarModalOpen={setIsCalendarModalOpen}
        />

        {/* Modal de Configuração do Banco de Dados Cloud */}
        <DatabaseSettingsModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
        />
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
