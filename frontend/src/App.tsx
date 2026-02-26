import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/sharedComponents/Header';
import { Home } from './pages/Home';
import { CreateTrip } from './pages/CreateTrip';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTrip />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
