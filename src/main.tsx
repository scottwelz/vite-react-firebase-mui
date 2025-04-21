import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css' // Assuming you have basic CSS or Tailwind setup
import { AuthProvider } from './contexts/AuthContext.tsx'; // Import your AuthProvider
import { CustomThemeProvider } from './theme/ThemeProvider.tsx'; // CORRECTED Import your ThemeProvider
import './firebaseConfig'; // Initialize Firebase
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CustomThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <App />
          </LocalizationProvider>
        </CustomThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
