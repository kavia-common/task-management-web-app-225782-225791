import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';

/**
 * Accessible input for adding todos. Supports Enter to add.
 */
export default function TodoInput() {
  const { addTodo } = useTodos();
  const [value, setValue] = useState('');

  const handleAdd = async () => {
    if (!value.trim()) return;
    await addTodo(value);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="todo-input">
      <label htmlFor="new-todo" className="sr-only">Add new task</label>
      <input
        id="new-todo"
        name="new-todo"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Add a new task..."
        aria-label="Add new task"
      />
      <button type="button" className="btn-primary" onClick={handleAdd} aria-label="Add task">
        Add
      </button>
    </div>
  );
}
