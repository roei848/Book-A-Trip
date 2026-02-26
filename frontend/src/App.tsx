import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { Home } from './pages/Home';
import { CreateTrip } from './pages/CreateTrip';

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
    --color-gradient-start: #020617;
    --color-gradient-mid: #0f172a;
    --color-gradient-end: #1e1b4b;
  }
`;

function App() {
  return (
    <ThemeContextProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTrip />} />
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
