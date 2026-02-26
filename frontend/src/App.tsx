import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Header } from './components/sharedComponents/Header';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { CreateTrip } from './pages/CreateTrip';
import { TripPage } from './pages/TripPage';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: #3b82f6;
    --color-primary-hover: #2563eb;
    --color-secondary: #64748b;
    --color-secondary-hover: #475569;
    --color-background: #f8fafc;
    --color-surface: #ffffff;
    --color-text: #1e293b;
    --color-text-light: #64748b;
    --color-border: #e2e8f0;
    --color-error: #ef4444;
    --color-accent: #7c3aed;
    --color-accent-end: #6366f1;
    --color-warning: #f59e0b;
    --color-gradient-start: #0f172a;
    --color-gradient-mid: #1e1b4b;
    --color-gradient-end: #312e81;
  }

  [data-theme='dark'] {
    --color-primary: #60a5fa;
    --color-primary-hover: #3b82f6;
    --color-secondary: #94a3b8;
    --color-secondary-hover: #64748b;
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f1f5f9;
    --color-text-light: #94a3b8;
    --color-border: #334155;
    --color-error: #f87171;
    --color-accent: #a78bfa;
    --color-accent-end: #818cf8;
    --color-warning: #fbbf24;
    --color-gradient-start: #020617;
    --color-gradient-mid: #0f172a;
    --color-gradient-end: #1e1b4b;
  }
`;

function App() {
  return (
    <ThemeContextProvider>
      <GlobalStyle />
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateTrip />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trip/:id"
                element={
                  <ProtectedRoute>
                    <TripPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
