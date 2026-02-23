import { Link } from 'react-router-dom';
import localServices from '../content/services.json';

export default function ServiceGrid() {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-24 font-sans border-t border-neutral-900">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Our Signature <span className="text-amber-500 italic">Crowns</span>
                </h2>
                <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto">
                    Explore our premium braiding portfolio. Every style is crafted with protective, tension-free techniques to ensure scalp longevity and stunning results.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {localServices.map((service) => (
                    <Link to={`/services/${service.slug}`} key={service.id} className="group bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:bg-neutral-800/80 transition-all duration-300 shadow-lg block">
                        <div className="aspect-[4/5] overflow-hidden bg-black relative">
                            {/* Fallback Unsplash image if custom imagePath is not yet optimized */}
                            <img
                                src={`https://images.unsplash.com/photo-1646244243103-625299863459?auto=format&fit=crop&q=80&w=800`}
                                alt={service.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                <h3 className="text-2xl font-serif font-bold text-white text-shadow-sm">{service.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-6">{service.description}</p>
                            <div className="w-full py-4 text-center border-t border-neutral-800 text-amber-500 font-bold tracking-widest text-xs uppercase group-hover:text-amber-400 transition-colors">
                                View Details &rarr;
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
