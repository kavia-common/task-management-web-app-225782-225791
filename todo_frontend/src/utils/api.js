const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * Simple API client with localStorage fallback for todos.
 * If REACT_APP_API_BASE is set, uses HTTP fetch to that base for CRUD.
 * Otherwise, persists todos in localStorage under 'todos'.
 */
const STORAGE_KEY = 'todos';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function lsGet() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

function lsSet(todos) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

async function http(method, path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function listTodos() {
  /** Returns array of todos. If API is configured, fetches from /todos */
  if (API_BASE) {
    return http('GET', '/todos');
  }
  return lsGet();
}

// PUBLIC_INTERFACE
export async function createTodo(todo) {
  /** Creates a new todo, returns created todo. */
  if (API_BASE) {
    return http('POST', '/todos', todo);
  }
  const todos = lsGet();
  const now = new Date().toISOString();
  const newTodo = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: todo.title?.trim() ?? '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  todos.push(newTodo);
  lsSet(todos);
  return newTodo;
}

// PUBLIC_INTERFACE
export async function updateTodo(id, updates) {
  /** Updates a todo by id, returns updated todo. */
  if (API_BASE) {
    return http('PUT', `/todos/${encodeURIComponent(id)}`, updates);
  }
  const todos = lsGet();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Todo not found');
  const updated = { ...todos[idx], ...updates, updatedAt: new Date().toISOString() };
  todos[idx] = updated;
  lsSet(todos);
  return updated;
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Deletes a todo by id. Returns true on success. */
  if (API_BASE) {
    await http('DELETE', `/todos/${encodeURIComponent(id)}`);
    return true;
  }
  const todos = lsGet().filter(t => t.id !== id);
  lsSet(todos);
  return true;
}
