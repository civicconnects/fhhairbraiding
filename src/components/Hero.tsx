import { useState, useEffect } from 'react';
import { Sparkles, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Hero = () => {
    const [slotsLeft, setSlotsLeft] = useState(3);

    // Scarcity trigger: simulate decreasing slots
    useEffect(() => {
        const timer = setTimeout(() => { if (slotsLeft > 1) setSlotsLeft(2); }, 8000);
        return () => clearTimeout(timer);
    }, [slotsLeft]);

    return (
        <section className="relative w-full h-screen min-h-[700px] flex items-center justify-start overflow-hidden bg-black font-sans">
            {/* High-res background image */}
            <div className="absolute inset-0 z-0">
                <img src="/images/hero-bg.png" alt="High quality box braids" className="w-full h-full object-cover object-center sm:object-right" />
                <div className="absolute inset-0 bg-black/60 sm:bg-transparent sm:bg-gradient-to-r sm:from-black/95 sm:via-black/70 sm:to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start text-left">
                {/* Scarcity / Urgency Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-xs tracking-widest uppercase mb-8 backdrop-blur-md animate-pulse">
                    <Clock className="w-3 h-3" />
                    <span>{slotsLeft} Elite Slots Remaining This Week</span>
                </div>

                <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif text-white mb-6 leading-[1.1]">
                    Radcliff’s #1<br />
                    Braiding Destination:<br />
                    <span className="text-amber-500 italic block mt-2">Get the Crown You Deserve.</span>
                </h1>

                <p className="mt-4 text-lg md:text-xl text-neutral-300 max-w-lg mb-10 font-light leading-relaxed">
                    Expert technique. Protective styles. Lab-verified hair health. Book your transformation today with Fort Knox's top professionals.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pt-4">
                    <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-black transition-all bg-amber-500 hover:bg-white shadow-[0_0_40px_-10px_rgba(217,119,6,0.3)] w-full sm:w-auto">
                        <CalendarIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Check Studio Availability
                        <Sparkles className="absolute right-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:animate-ping text-amber-600" />
                    </button>

                    {/* Social Proof Avatar Group */}
                    <div className="flex items-center gap-4 text-neutral-300 text-sm h-full pt-2 sm:pt-0">
                        <div className="flex -space-x-4">
                            <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" alt="Client 1" />
                            <img className="w-12 h-12 rounded-full border-2 border-black object-cover relative z-10" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="Client 2" />
                            <img className="w-12 h-12 rounded-full border-2 border-black object-cover relative z-20" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" alt="Client 3" />
                        </div>
                        <div className="flex flex-col">
                            <span className="flex items-center gap-1 text-amber-500 text-xs">
                                ★★★★★
                            </span>
                            <span className="font-medium text-white/90">500+ crowns perfected</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
