import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import ChatScreen from '../chat/ChatScreen';
import HistoryScreen from '../chat/HistoryScreen';
import LawyerDirectoryScreen from '../lawyers/LawyerDirectoryScreen';
import LawyerRegistrationScreen from '../lawyers/LawyerRegistrationScreen';

type TabType = 'chat' | 'history' | 'lawyers' | 'become-lawyer';

const MainApp: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const handleBecomeLawyer = () => {
    setActiveTab('become-lawyer');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'lawyers':
        return <LawyerDirectoryScreen onBecomeLawyer={handleBecomeLawyer} />;
      case 'become-lawyer':
        return <LawyerRegistrationScreen onBack={() => setActiveTab('lawyers')} />;
      default:
        return <ChatScreen />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Navbar
          user={user}
          onLogout={logout}
          onThemeToggle={toggleTheme}
          theme={theme}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="pt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;