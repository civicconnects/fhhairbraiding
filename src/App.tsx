import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import BookingEngine from './components/BookingEngine';
import CrownClub from './components/CrownClub';
import ServiceDetail from './pages/ServiceDetail';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-amber-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const Home = () => (
  <main className="flex min-h-screen flex-col items-center">
    <Hero />
    <BookingEngine />
    <section className="w-full max-w-4xl mx-auto px-6 py-12">
      <CrownClub />
    </section>
  </main>
);

export default App;
