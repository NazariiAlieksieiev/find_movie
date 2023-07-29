import React from 'react';
import './App.scss';
import { ChatWindow } from './components/chatWindow/chatWindow';
import { Header } from './components/header/header';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <ChatWindow />
    </div>
  );
};

export default App;
