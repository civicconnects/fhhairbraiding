import { CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function AboutSection() {
    return (
        <section className="w-full bg-neutral-950 py-24 mb-16 border-t border-y border-neutral-900 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row">

                    {/* Narrative Text Side */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase mb-6">
                            <Sparkles className="w-3 h-3" />
                            Elite Expertise
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Radcliff’s <span className="text-amber-500 italic">Luxury</span> Braiding Standard
                        </h2>

                        <p className="text-lg text-neutral-300 font-light mb-8 leading-relaxed">
                            F&H Hair Braiding isn't just a salon; it's an institution dedicated to the science of hair health and the art of flawlessly executed protective styling. Led by Master Stylist Monica, we've elevated braiding from a basic service into a premium experience.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">The Science of Hair Health</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">Monica’s technical edge is rooted in biological understanding. We engineer tension-free zones, specifically protecting the fragile nape and edges (baby hairs) from traction alopecia.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Award className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Decades of Precision</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">With years of rigorous experience mastering complex partings and geometric alignments, our structural integrity means your crown lasts weeks longer than standard installations.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-l-4 border-amber-500 pl-6 py-2">
                            <p className="text-xl font-serif italic text-neutral-300">
                                "Our mission is to help women reclaim their time and confidence through low-maintenance, architecturally perfect protective styling."
                            </p>
                        </div>
                    </div>

                    {/* Visual Authority Side */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl relative z-10">
                            {/* Placeholder for Stylist at work / Precision parting focus */}
                            <img
                                src="/images/after.png"
                                alt="Master stylist executing precision parting for protective styles"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
