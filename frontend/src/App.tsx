import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateTrip } from './pages/CreateTrip';
import { TripPage } from './pages/TripPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/trip/:id" element={<TripPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
