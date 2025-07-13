import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Import global styles and fonts
import './index.css'
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { CustomThemeProvider } from './theme/ThemeProvider.tsx';
import './firebaseConfig'; // Initialize Firebase
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <App />
        </LocalizationProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
