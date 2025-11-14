import React, { useState, useRef, useEffect } from 'react';
import { useTodos } from '../context/TodoContext';

/**
 * A single todo row with toggle, edit, and delete actions.
 */
export default function TodoItem({ todo }) {
  const { toggleTodo, editTodo, removeTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const onSave = async () => {
    if (title.trim() && title !== todo.title) {
      await editTodo(todo.id, title);
    }
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <li className="todo-item" role="listitem" aria-label={`Task: ${todo.title}`}>
      <div className="todo-left">
        <input
          id={`toggle-${todo.id}`}
          type="checkbox"
          checked={!!todo.completed}
          onChange={() => toggleTodo(todo.id)}
          aria-checked={!!todo.completed}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            className="edit-input"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onSave}
            aria-label="Edit task title"
          />
        ) : (
          <span
            className={`title ${todo.completed ? 'completed' : ''}`}
            tabIndex={0}
            onDoubleClick={() => setIsEditing(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(true);
            }}
            aria-label={`${todo.title}${todo.completed ? ', completed' : ''}`}
          >
            {todo.title}
          </span>
        )}
      </div>
      <div className="todo-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIsEditing(v => !v)}
          aria-label={isEditing ? 'Save changes' : `Edit "${todo.title}"`}
          title={isEditing ? 'Save' : 'Edit'}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={() => removeTodo(todo.id)}
          aria-label={`Delete "${todo.title}"`}
          title="Delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
