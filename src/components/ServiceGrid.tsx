import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Service = {
    id: string;
    slug: string;
    name?: string;
    title?: string;
    description?: string;
    image_url?: string | null;  // R2 URL from D1 only — no local fallbacks
};

export default function ServiceGrid() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/services', { cache: 'no-store' })
            .then(res => res.json())
            .then((data: Service[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    setServices(data);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Only services with a real R2 image
    const visibleServices = services.filter(
        s => s.image_url && s.image_url.startsWith('https://images.fhhairbraiding.com/')
    );

    if (loading) {
        return (
            <section className="w-full max-w-7xl mx-auto px-6 py-24 font-sans border-t border-neutral-900">
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500" />
                </div>
            </section>
        );
    }

    if (visibleServices.length === 0) {
        return (
            <section className="w-full max-w-7xl mx-auto px-6 py-24 font-sans border-t border-neutral-900">
                <div className="text-center py-20 text-neutral-600">
                    <p className="text-lg">No service images uploaded yet. Add images via the Admin panel.</p>
                </div>
            </section>
        );
    }

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
                {visibleServices.map((service) => {
                    const displayName = service.name || service.title || '';
                    return (
                        <Link
                            to={`/services/${service.slug}`}
                            key={service.id}
                            className="group bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:bg-neutral-800/80 transition-all duration-300 shadow-lg block"
                        >
                            <div className="aspect-[4/5] overflow-hidden bg-[#1a1a1a] relative">
                                <img
                                    src={service.image_url!}
                                    alt={displayName}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    onError={(e: any) => { e.target.closest('a').style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                    <h3 className="text-2xl font-serif font-bold text-white text-shadow-sm">{displayName}</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-6">{service.description}</p>
                                <div className="w-full py-4 text-center border-t border-neutral-800 text-amber-500 font-bold tracking-widest text-xs uppercase group-hover:text-amber-400 transition-colors">
                                    View Details &rarr;
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
