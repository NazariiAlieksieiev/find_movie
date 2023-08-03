import React, { useMemo, useState } from 'react';
import './App.scss';
import { ChatWindow } from './components/chatWindow/chatWindow';
import { Header } from './components/header/header';
import { Filters } from './components/filters/filters';
import { FiltersTypes } from './types/filters';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FiltersTypes>({});

  const stringifiedFilters = useMemo(() => {
    const jsonString = JSON.stringify(filters);

    return jsonString;
  }, [filters]);

  return (
    <div className="app">
      <Header />
      <Filters
        setFilters={setFilters}
      />
      <ChatWindow filters={stringifiedFilters} />
    </div>
  );
};

export default App;
