import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Lighter blue for better contrast on dark
    },
    secondary: {
      main: '#f48fb1', // Softer pink for secondary actions
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',    // Slightly lighter surface
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)', // Primary text
      secondary: 'rgba(255, 255, 255, 0.6)', // Secondary text
      disabled: 'rgba(255, 255, 255, 0.38)', // Disabled text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Optional: if you prefer non-uppercase buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Matching paper background
        },
      },
    },
    // Add more component customizations as needed
  },
  shape: {
    borderRadius: 8, // Global border radius
  },
});

export default theme;