import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import { TodoProvider } from './context/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import ErrorBoundary from './components/ErrorBoundary';

// PUBLIC_INTERFACE
function App() {
  /** Root app with theme toggle and todo features */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <div className="header-row">
            <h1 className="title">Todo</h1>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <p className="subtitle">Manage tasks efficiently.</p>
        </div>
      </header>
      <main className="container">
        <ErrorBoundary>
          <TodoProvider>
            <section className="card">
              <TodoInput />
              <TodoList />
            </section>
          </TodoProvider>
        </ErrorBoundary>
      </main>
      <footer className="container footer subtle">
        <small>
          {process.env.REACT_APP_BACKEND_URL
            ? `Backend: ${process.env.REACT_APP_BACKEND_URL}`
            : 'Local mode (localStorage)'}
        </small>
      </footer>
    </div>
  );
}

export default App;
