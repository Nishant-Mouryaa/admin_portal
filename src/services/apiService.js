import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const apiService = {
  // Authentication
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  // Tests
  getTests: async () => {
    const response = await api.get('/tests');
    return response.data;
  },
  createTest: async (testData) => {
    try {
      // Ensure questions array is always present
      const dataToSend = {
        ...testData,
        questions: testData.questions || []
      };
      const response = await api.post('/tests', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },
  updateTest: async (testId, updates) => {
    const response = await api.put(`/tests/${testId}`, updates);
    return response.data;
  },
  deleteTest: async (testId) => {
    await api.delete(`/tests/${testId}`);
  },

  // Questions endpoints:
  addQuestion: async (testId, questionData) => {
    const response = await api.post(`/tests/${testId}/questions`, questionData);
    return response.data;
  },
  updateQuestion: async (testId, questionId, questionData) => {
    const response = await api.put(`/tests/${testId}/questions/${questionId}`, questionData);
    return response.data;
  },
  deleteQuestion: async (testId, questionId) => {
    await api.delete(`/tests/${testId}/questions/${questionId}`);
  },

  // Textbooks
 
  getTextbooks: async () => {
    const response = await api.get('/textbooks');
    return response.data;
  },
  createTextbook: async (textbookData) => {
    const response = await api.post('/textbooks', textbookData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  uploadTextbook: async (formData) => {
    const response = await api.post('/textbooks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  // ... updateTextbook, deleteTextbook, etc.
  updateTextbook: async (textbookId, formData) => {
    const response = await api.put(`/textbooks/${textbookId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  deleteTextbook: async (textbookId) => {
    await api.delete(`/textbooks/${textbookId}`);
  },

  // Notes
  getNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  // ... updateNote, deleteNote, etc.
    updateNote: async (noteId, updates) => {
        const response = await api.put(`/notes/${noteId}`, updates);
        return response.data;
    },
    deleteNote: async (noteId) => {
        await api.delete(`/notes/${noteId}`);
    },

    getDashboardMetrics: async () => {
        const response = await api.get('/dashboard/metrics');
        return response.data;
      },

};

export default apiService;
