import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/authContext'; // Envolva o App no AuthProvider
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Criação de um tema básico para MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#336636',
    },
    secondary: {
      main: '#A1BA30',
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);