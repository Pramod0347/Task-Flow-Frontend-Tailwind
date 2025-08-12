// src/services/taskService.js
import axios from "axios";

// Allow override via CRA env var. Example in .env: REACT_APP_API_BASE_URL=http://localhost:8080
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

// Create a tiny axios instance so we can reuse baseURL, headers, etc.
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000, // 10s safety timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Centralized error shape (so UI can show consistent messages)
function normalizeError(error) {
  if (error.response) {
    // Server responded with a non-2xx
    const status = error.response.status;
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      `Request failed with status ${status}`;
    return new Error(message);
  } else if (error.request) {
    // No response (network error / CORS / server down)
    return new Error("No response from server. Is the backend running?");
  } else {
    // Something else while setting up the request
    return new Error(error.message || "Unexpected error");
  }
}

// ---- CRUD APIs ----

// GET /api/tasks
export async function getTasks(params = {}) {
  try {
    const res = await api.get("/api/tasks", { params });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

// GET /api/tasks/:id
export async function getTaskById(id) {
  try {
    const res = await api.get(`/api/tasks/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

// POST /api/tasks
export async function createTask(payload) {
  try {
    const res = await api.post("/api/tasks", payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

// PUT /api/tasks/:id
export async function updateTask(id, payload) {
  try {
    const res = await api.put(`/api/tasks/${id}`, payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(id) {
  try {
    const res = await api.delete(`/api/tasks/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

// You can export `api` if you need to call other endpoints elsewhere.
export { api };
