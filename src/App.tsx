import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import BookingEngine from './components/BookingEngine';
import CrownClub from './components/CrownClub';
import ServiceDetail from './pages/ServiceDetail';
import ServiceGrid from './components/ServiceGrid';
import Admin from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-900 text-white font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Mapping Admin here fixes the TS6133 'value never read' error */}
          <Route path="/admin-portal-secure" element={<Admin />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const Home = () => (
  <main className="flex min-h-screen flex-col items-center bg-neutral-900">
    <Hero />
    {/* ServiceGrid is the 'engine' that displays your 5 D1 services */}
    <ServiceGrid />
    <BookingEngine />
    <section className="w-full max-w-4xl mx-auto px-6 py-12">
      <CrownClub />
    </section>
  </main>
);

export default App;