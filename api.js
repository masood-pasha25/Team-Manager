import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (email, username, password, firstName, lastName) =>
    apiClient.post('/auth/signup', { email, username, password, firstName, lastName }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  getProfile: () =>
    apiClient.get('/auth/profile'),
};

// Project endpoints
export const projectAPI = {
  createProject: (name, description) =>
    apiClient.post('/projects', { name, description }),
  getProjects: () =>
    apiClient.get('/projects'),
  getProject: (projectId) =>
    apiClient.get(`/projects/${projectId}`),
  updateProject: (projectId, name, description) =>
    apiClient.put(`/projects/${projectId}`, { name, description }),
  deleteProject: (projectId) =>
    apiClient.delete(`/projects/${projectId}`),
  getTeamMembers: (projectId) =>
    apiClient.get(`/projects/${projectId}/team`),
  addTeamMember: (projectId, userId, role) =>
    apiClient.post(`/projects/${projectId}/team`, { userId, role }),
  removeTeamMember: (projectId, userId) =>
    apiClient.delete(`/projects/${projectId}/team/${userId}`),
};

// Task endpoints
export const taskAPI = {
  createTask: (projectId, title, description, assignedTo, priority, dueDate) =>
    apiClient.post(`/tasks/${projectId}/tasks`, {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
    }),
  getTasksList: (projectId) =>
    apiClient.get(`/tasks/${projectId}/tasks`),
  getTask: (projectId, taskId) =>
    apiClient.get(`/tasks/${projectId}/tasks/${taskId}`),
  updateTask: (projectId, taskId, title, description, assignedTo, status, priority, dueDate) =>
    apiClient.put(`/tasks/${projectId}/tasks/${taskId}`, {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueDate,
    }),
  updateTaskStatus: (projectId, taskId, status) =>
    apiClient.patch(`/tasks/${projectId}/tasks/${taskId}/status`, { status }),
  deleteTask: (projectId, taskId) =>
    apiClient.delete(`/tasks/${projectId}/tasks/${taskId}`),
  getMyTasks: () =>
    apiClient.get('/tasks/user/my-tasks'),
  getDashboard: (projectId) =>
    apiClient.get(`/tasks/${projectId}/dashboard`),
};

export default apiClient;
