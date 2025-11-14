import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TodoItem from './TodoItem';
import { TodoProvider, useTodos } from '../context/TodoContext';

// Helper provider with initial state injection via mock API-less context behavior
function TestWrapper({ children, initialTodos = [] }) {
  // We use the real provider; to load initial todos in localStorage mode,
  // we can pre-seed localStorage to avoid API usage.
  window.localStorage.setItem('todos', JSON.stringify(initialTodos));
  return <TodoProvider>{children}</TodoProvider>;
}

test('delete button opens confirmation dialog', async () => {
  const todo = { id: '1', title: 'Test task', completed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' };

  render(
    <TestWrapper initialTodos={[todo]}>
      <ul>
        <TodoItem todo={todo} />
      </ul>
    </TestWrapper>
  );

  // Click delete should open dialog
  const deleteBtn = screen.getByRole('button', { name: /delete "test task"/i });
  fireEvent.click(deleteBtn);

  expect(await screen.findByRole('dialog', { name: /delete task\?/i })).toBeInTheDocument();
  expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();

  // Cancel closes dialog
  fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  expect(screen.queryByRole('dialog', { name: /delete task\?/i })).not.toBeInTheDocument();
});
