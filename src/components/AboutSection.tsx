import { CheckCircle2, Award, Sparkles, MapPin } from 'lucide-react';

export default function AboutSection() {
    return (
        <section id="about" className="w-full bg-neutral-950 py-24 mb-16 border-t border-y border-neutral-900 font-sans scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row">

                    {/* Narrative Text Side */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase mb-6">
                            <Sparkles className="w-3 h-3" />
                            Meet Your Stylist
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Haddy — <span className="text-amber-500 italic">Master Braider</span>
                        </h2>

                        <p className="text-lg text-neutral-300 font-light mb-8 leading-relaxed">
                            F&H Hair Braiding is built on a foundation of passion, precision, and genuine care for every client's hair health. Haddy brings years of expertise in protective styling, combining traditional African braiding techniques with modern, scalp-safe methods.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Scalp-First Philosophy</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">Every install is tension-free by design. Haddy's technique specifically protects delicate edges and nape areas, preventing traction alopecia while delivering stunning, long-lasting results.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Award className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Years of Precision</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">With deep experience across knotless braids, fulani styles, goddess braids, and more — Haddy's structural installs last weeks longer than standard methods.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <MapPin className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Serving Radcliff, KY & Beyond</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">Located at 543 N Wilson Rd, Suite D, Radcliff, KY — conveniently nestled in the heart of the community and welcoming clients from all surrounding areas.</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio placeholder */}
                        <div className="border border-dashed border-amber-500/30 rounded-2xl p-6 bg-amber-500/5 mb-6">
                            <p className="text-amber-500/60 text-sm font-bold uppercase tracking-widest mb-2">📝 Owner Bio — Coming Soon</p>
                            <p className="text-neutral-500 text-sm italic">Haddy's full personal story and biography will appear here. Update this via the Admin panel's Silo Content Editor.</p>
                        </div>

                        <div className="border-l-4 border-amber-500 pl-6 py-2">
                            <p className="text-xl font-serif italic text-neutral-300">
                                "Your crown deserves to be built with intention — not just style, but science and love."
                            </p>
                            <p className="text-amber-500 text-sm font-bold mt-2">— Haddy, Owner & Master Braider</p>
                        </div>
                    </div>

                    {/* Visual Authority Side */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl relative z-10 flex items-center justify-center">
                            {/* Placeholder until Haddy's photo is uploaded */}
                            <div className="flex flex-col items-center justify-center gap-4 text-center px-8">
                                <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-dashed border-amber-500/30 flex items-center justify-center">
                                    <span className="text-4xl">👑</span>
                                </div>
                                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Photo of Haddy</p>
                                <p className="text-neutral-600 text-xs">Upload via Admin → Gallery Manager</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>

                        <div className="absolute -bottom-8 -left-8 bg-black border border-neutral-800 p-6 rounded-2xl shadow-xl z-20 max-w-[200px] hidden md:block">
                            <div className="text-3xl font-serif text-amber-500 font-bold mb-1">100%</div>
                            <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Edge Protection Guaranteed</div>
                        </div>

                        <div className="absolute -top-8 -right-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
                    </div>

                </div>
            </div>
        </section>
    );
}
