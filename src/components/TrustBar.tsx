import { Award, ShieldCheck, Star } from 'lucide-react';

const TrustBar = () => {
    return (
        <div className="w-full bg-neutral-950 border-y border-neutral-900 overflow-hidden py-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <p className="text-sm tracking-[0.2em] text-neutral-500 uppercase font-medium mb-8 text-center">
                    Recognized & Trusted in Central Kentucky
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-75">
                    <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-amber-600" />
                        <span className="text-xl font-serif text-neutral-300">Certified Stylists</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-amber-600" />
                        <span className="text-xl font-serif text-neutral-300">Top Rated in Radcliff</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-amber-600" />
                        <span className="text-xl font-serif text-neutral-300">Tension-Free Technique</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustBar;
