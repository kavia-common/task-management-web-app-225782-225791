import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { listTodos, createTodo, updateTodo, deleteTodo } from '../utils/api';

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, todos: action.payload };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE':
      return {
        ...state,
        todos: state.todos.map(t => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function TodoProvider({ children }) {
  /** Provides todo state and actions to children via context. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await listTodos();
      dispatch({ type: 'LOAD_SUCCESS', payload: Array.isArray(data) ? data.sort((a, b) => (b?.updatedAt || '').localeCompare(a?.updatedAt || '')) : [] });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e?.message || 'Failed to load todos' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Actions
  const addTodo = async (title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const created = await createTodo({ title: trimmed });
    dispatch({ type: 'ADD', payload: created });
  };

  const toggleTodo = async (id) => {
    const current = state.todos.find(t => t.id === id);
    if (!current) return;
    const updated = await updateTodo(id, { completed: !current.completed });
    dispatch({ type: 'UPDATE', payload: updated });
  };

  const editTodo = async (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const updated = await updateTodo(id, { title: trimmed });
    dispatch({ type: 'UPDATE', payload: updated });
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
    dispatch({ type: 'DELETE', id });
  };

  const value = {
    ...state,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    reload: load,
  };

  return (
    <TodoStateContext.Provider value={value}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTodos() {
  /** Access todo state and actions. */
  const ctx = useContext(TodoStateContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
