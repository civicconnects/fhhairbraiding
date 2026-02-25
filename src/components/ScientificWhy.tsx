import { CheckCircle, ShieldCheck, HeartPulse } from 'lucide-react';

export default function ScientificWhy() {
    return (
        <section className="w-full bg-neutral-950 py-24 border-t border-neutral-900 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Side */}
                    <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-black shadow-2xl">
                        <img
                            src="/images/gallery-1.png"
                            alt="Precision parting and scalp health"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-6 rounded-2xl max-w-sm">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white font-serif text-lg">Tension-Free Guarantee</h4>
                                    <p className="text-neutral-400 text-sm">Prevents traction alopecia and preserves edge integrity.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text / Scientific Why Side */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            The <span className="text-amber-500 italic">Science</span> of Protective Styling
                        </h2>
                        <p className="text-lg text-neutral-400 font-light mb-10 leading-relaxed">
                            At F&H Hair Braiding, we don't just craft beautiful crowns. We architect protective styles engineered for the long-term biological health of your natural hair and scalp ecosystem.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="mt-1">
                                    <CheckCircle className="w-8 h-8 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Follicle Load Distribution</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">
                                        Our parting geometry is calculated to distribute the weight of the extensions evenly across your scalp, mitigating localized stress points that lead to thinning.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="mt-1">
                                    <HeartPulse className="w-8 h-8 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Moisture Retention Matrix</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">
                                        We utilize a proprietary pre-braid sealing technique that locks in natural sebum and applied hydration, creating a micro-environment that promotes vertical growth underneath the protective shell.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-neutral-900">
                            <a href="https://wa.me/15026442754?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment!" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center md:justify-start gap-3 w-full md:w-auto px-10 py-5 text-lg font-bold text-black transition-all bg-amber-500 hover:bg-white rounded shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]">
                                💬 Book via WhatsApp / Text
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
