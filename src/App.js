import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import theme from './styles/theme';

// Import your pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TestManagementPage from './pages/TestManagementPage';
import TextbookManagementPage from './pages/TextbookManagementPage';
import NotesManagementPage from './pages/NotesManagementPage';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
        <Routes>
  {/* Public routes */}
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protected routes */}
  <Route element={<PrivateRoute />}>
    <Route element={<MainLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/tests" element={<TestManagementPage />} />
      <Route path="/textbooks" element={<TextbookManagementPage />} />
      <Route path="/notes" element={<NotesManagementPage />} />
    </Route>
  </Route>
  
  {/* Catch-all redirect */}
  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
            
            
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;