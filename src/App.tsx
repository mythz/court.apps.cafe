import React from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { Header } from './components/layout/Header';
import { MainMenu } from './components/menu/MainMenu';
import { CaseView } from './components/game/CaseView';
import { Shop } from './components/shop/Shop';
import { Statistics } from './components/menu/Statistics';
import { Achievements } from './components/menu/Achievements';
import { Settings } from './components/menu/Settings';

const AppContent: React.FC = () => {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'menu':
        return <MainMenu />;
      case 'case':
        return <CaseView />;
      case 'shop':
        return <Shop />;
      case 'statistics':
        return <Statistics />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app min-h-screen bg-gray-900 text-white">
      <Header />
      {renderScreen()}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
