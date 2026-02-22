import { useState, useEffect } from 'react';
import { Sparkles, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

const Hero = () => {
    const [slotsLeft, setSlotsLeft] = useState(3);

    // Scarcity trigger: simulate decreasing slots or just grabbing from DB
    useEffect(() => {
        // Just a visual trigger for demo
        const timer = setTimeout(() => { if (slotsLeft > 1) setSlotsLeft(2); }, 8000);
        return () => clearTimeout(timer);
    }, [slotsLeft]);

    return (
        <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-950">
            {/* Background with abstract shapes/gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-neutral-900 to-black pointer-events-none" />
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-amber-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[0%] left-[0%] w-[40%] h-[40%] bg-orange-700/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                {/* Scarcity / Urgency Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm mb-8 animate-pulse">
                    <Clock className="w-4 h-4" />
                    <span>Only {slotsLeft} slots left this week</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                    Radcliff’s #1 Braiding Destination:<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                        Get the Crown You Deserve.
                    </span>
                </h1>

                <p className="mt-4 text-xl md:text-2xl text-neutral-300 max-w-3xl mb-12 font-light">
                    Flawless, tension-free braids crafted by Fort Knox's top professionals. Experience luxury hair care that lasts longer and protects your natural hair.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold text-white transition-all bg-amber-600 rounded-full hover:bg-amber-500 hover:scale-105 shadow-[0_0_40px_-10px_rgba(217,119,6,0.5)]">
                        <CalendarIcon className="w-6 h-6 group-hover:animate-bounce" />
                        Secure My Style ($25 Deposit)
                        <Sparkles className="absolute right-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:animate-ping text-amber-200" />
                    </button>
                </div>

                {/* Social Proof Text */}
                <div className="mt-8 flex items-center gap-2 text-neutral-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Over 500+ crowns perfected in KY this year.</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
