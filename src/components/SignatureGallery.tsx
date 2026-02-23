import { useState } from 'react';
import { Camera } from 'lucide-react';

const categories = ["All", "Knotless", "Bohemian", "Box Braids", "Cornrows", "Twists"];

const dummyImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1629881850125-97fc388ce429?auto=format&fit=crop&q=80&w=800', category: 'Knotless', alt: 'Medium Knotless Braids Radcliff KY' },
    { id: 2, url: 'https://images.unsplash.com/photo-1616788556602-d9228d4aeaba?auto=format&fit=crop&q=80&w=800', category: 'Bohemian', alt: 'Waist length Bohemian Braids Radcliff KY' },
    { id: 3, url: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800', category: 'Cornrows', alt: 'Precision stitched Cornrows Radcliff' },
    { id: 4, url: 'https://images.unsplash.com/photo-1646244243103-625299863459?auto=format&fit=crop&q=80&w=800', category: 'Box Braids', alt: 'Classic Box Braids protective style' },
    { id: 5, url: 'https://images.unsplash.com/photo-1542157585-ef20bfcce579?auto=format&fit=crop&q=80&w=800', category: 'Twists', alt: 'Senegalese Twists Radcliff' },
    { id: 6, url: 'https://images.unsplash.com/photo-1630132338105-081075672b15?auto=format&fit=crop&q=80&w=800', category: 'Knotless', alt: 'Jumbo Knotless Braids style' },
];

export default function SignatureGallery() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredImages = activeFilter === "All"
        ? dummyImages
        : dummyImages.filter(img => img.category === activeFilter);

    return (
        <section className="w-full bg-black py-24 border-t border-neutral-900 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <Camera className="w-3 h-3" />
                            Live Portfolio
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                            Our Signature <span className="text-amber-500 italic">Crowns</span>
                        </h2>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === category
                                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry-style Grid Simulator */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredImages.map((img) => (
                        <div key={img.id} className="relative group overflow-hidden rounded-2xl break-inside-avoid bg-neutral-900">
                            <img
                                src={img.url}
                                alt={img.alt}
                                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md rounded border border-neutral-700 text-xs font-bold text-amber-500 tracking-widest uppercase mb-2">
                                    {img.category}
                                </span>
                                <p className="text-white text-sm font-medium leading-snug">{img.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredImages.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-neutral-800 rounded-2xl">
                        <p className="text-neutral-500">No images found for this category yet.</p>
                    </div>
                )}

                {/* Social Integration */}
                <div className="mt-32 pt-16 border-t border-neutral-900 grid md:grid-cols-2 gap-12 items-center">
                    <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                        <h3 className="text-2xl font-serif font-bold text-white mb-4 relative z-10">Follow the Journey</h3>
                        <p className="text-neutral-400 mb-8 relative z-10 max-w-sm">Join our Instagram community for daily transformations, style inspiration, and behind-the-scenes magic.</p>
                        <a href="https://instagram.com/fhhairbraiding" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            @fhhairbraiding
                        </a>
                    </div>

                    <div className="bg-black border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
                        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">Trending on TikTok</p>
                        <h3 className="text-2xl font-serif font-bold text-white mb-6">Watch the Process</h3>
                        {/* Placeholder for TikTok Embed script - standard integration */}
                        <div className="w-full flex justify-center opacity-80 hover:opacity-100 transition-opacity">
                            <a href="https://tiktok.com/@fhhairbraiding" target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-4 text-white hover:text-amber-500 transition-colors">
                                <span className="p-4 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05 6.33 6.33 0 0 0-5 10.33 6.37 6.37 0 0 0 10.15-2.07l.06-.11V8.65a8.44 8.44 0 0 0 5 1.55z" />
                                    </svg>
                                </span>
                                Follow @fhhairbraiding on TikTok
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
