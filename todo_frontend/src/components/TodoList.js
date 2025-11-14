import React from 'react';
import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';

/**
 * Renders list of todos with loading/empty states.
 */
export default function TodoList() {
  const { todos, loading } = useTodos();

  if (loading) {
    return <div className="state subtle">Loading...</div>;
  }

  if (!todos.length) {
    return <div className="state subtle">No tasks yet. Add your first task above.</div>;
    }

  return (
    <ul className="todo-list" role="list" aria-label="Todo list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
