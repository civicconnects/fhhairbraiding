import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localServices from '../content/services.json';

type Service = {
    id: string;
    slug: string;
    name?: string;
    title?: string;
    description?: string;
    image_url?: string;   // R2 URL from D1 (live, uploaded via Admin)
    imagePath?: string;   // Local fallback from services.json
};

export default function ServiceGrid() {
    const [services, setServices] = useState<Service[]>(localServices as Service[]);

    useEffect(() => {
        // no-cache ensures freshly uploaded R2 images appear immediately
        fetch('/api/services', { cache: 'no-store' })
            .then(res => res.json())
            .then((data: Service[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    setServices(data);
                }
            })
            .catch(() => {
                // Silently keep local services as fallback
            });
    }, []);

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
                {services.map((service) => {
                    // Priority: R2 image_url from D1 → local imagePath → generic fallback
                    const imgSrc = service.image_url && service.image_url.startsWith('http')
                        ? service.image_url
                        : service.imagePath || '/images/gallery-2.png';
                    const displayName = service.name || service.title || '';

                    return (
                        <Link
                            to={`/services/${service.slug}`}
                            key={service.id}
                            className="group bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:bg-neutral-800/80 transition-all duration-300 shadow-lg block"
                        >
                            <div className="aspect-[4/5] overflow-hidden bg-black relative">
                                <img
                                    src={imgSrc}
                                    alt={displayName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
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
