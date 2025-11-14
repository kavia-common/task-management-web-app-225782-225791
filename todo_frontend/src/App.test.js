import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Todo title', () => {
  render(<App />);
  const heading = screen.getByText(/Todo/i);
  expect(heading).toBeInTheDocument();
});

test('delete requires confirmation (integration smoke)', () => {
  render(<App />);

  // Add a task
  const input = screen.getByLabelText(/add new task/i);
  const addBtn = screen.getByRole('button', { name: /add task/i });
  fireEvent.change(input, { target: { value: 'Delete me' } });
  fireEvent.click(addBtn);

  // Find delete button and click
  const deleteBtn = screen.getByRole('button', { name: /delete "delete me"/i });
  fireEvent.click(deleteBtn);

  // Expect dialog
  expect(screen.getByRole('dialog', { name: /delete task\?/i })).toBeInTheDocument();
});
