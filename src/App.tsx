import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Calendar as CalendarIcon, UserCog } from 'lucide-react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import AboutSection from './components/AboutSection';
import ServiceGrid from './components/ServiceGrid';
import SignatureGallery from './components/SignatureGallery';
import TransformationSlider from './components/TransformationSlider';
import ScientificWhy from './components/ScientificWhy';
import ContactHub from './components/ContactHub';
import CrownClub from './components/CrownClub';
import ServiceDetail from './pages/ServiceDetail';
import Admin from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white font-sans flex flex-col pt-0 pb-20 md:pb-0">
        <NavBar />
        <main className="flex-grow pt-24 md:pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-portal-secure" element={<Admin />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
          </Routes>
        </main>

        {/* Sticky Mobile Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-800 p-4 md:hidden pb-safe">
          <a href="https://wa.me/15026442754?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20at%20F%26H%20Hair%20Braiding!" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-amber-500 hover:bg-white text-black font-bold py-4 px-6 rounded-xl shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] transition-colors gap-2">
            <CalendarIcon className="w-5 h-5" />
            💬 Book via WhatsApp
          </a>
        </div>
      </div>
    </BrowserRouter>
  );
};

const Home = () => (
  <div className="flex flex-col w-full bg-neutral-950 overflow-hidden">
    <Hero />
    <TrustBar />
    <AboutSection />

    <div id="services" className="scroll-mt-20">
      <ServiceGrid />
    </div>

    <SignatureGallery />
    <TransformationSlider />
    <ScientificWhy />
    <div id="booking-form" className="scroll-mt-20">
      <ContactHub />
    </div>

    <section className="w-full max-w-4xl mx-auto px-6 py-24 mb-10 md:mb-0 bg-black">
      <CrownClub />
    </section>

    {/* Global Site Footer */}
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 py-12 pb-32 md:pb-12 text-center text-neutral-400 font-sans">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm">
          <p className="font-bold text-white mb-1">F & H Hair Braiding</p>
          <p>Monday–Sunday, 9 AM–8 PM</p>
          <p className="mt-2 text-xs">543 N Wilson Rd, Suite D, Radcliff, KY 40160</p>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/admin" className="text-neutral-600 hover:text-amber-500 transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-1.5" title="Staff Login">
            <UserCog className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </a>
          <span className="text-neutral-800">|</span>
          <a href="https://facebook.com/FHHAIRBraiding" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors uppercase tracking-widest text-xs font-bold font-mono">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default App;