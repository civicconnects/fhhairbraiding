import { MapPin, Phone, MessageSquare } from 'lucide-react';
import CalendarPicker from './CalendarPicker';

export default function ContactHub() {
    return (
        <section id="contact" className="w-full bg-black py-24 border-t border-neutral-900 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        Exclusive <span className="text-amber-500 italic">Consultations</span>
                    </h2>
                    <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto">
                        We don't just book appointments; we engineer your crown. Contact us directly to discuss your hair goals, scalp health, and receive a custom estimate.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-stretch">

                    {/* Direct Action Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />

                        <div className="relative z-10">
                            <h3 className="text-3xl font-serif font-bold text-white mb-4">Text for a Custom Quote</h3>
                            <p className="text-neutral-400 mb-8 leading-relaxed">
                                For the fastest response, text us a photo of your natural hair and an inspiration picture of the style you desire. Monica will personally review and define your optimal path forward.
                            </p>

                            <div className="space-y-6 mb-10">
                                <a href="sms:+15026442754" className="flex items-center gap-4 text-white hover:text-amber-500 transition-colors group/link p-4 bg-black/50 rounded-xl border border-neutral-800">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 group-hover/link:bg-amber-500 group-hover/link:scale-110 transition-all">
                                        <MessageSquare className="w-5 h-5 text-amber-500 group-hover/link:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-1">Text Us Now</p>
                                        <p className="text-xl font-mono">+1 (502) 644-2754</p>
                                    </div>
                                </a>

                                <a href="tel:+15026442754" className="flex items-center gap-4 text-white hover:text-amber-500 transition-colors group/link p-4 bg-black/50 rounded-xl border border-neutral-800">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 group-hover/link:bg-amber-500 group-hover/link:scale-110 transition-all">
                                        <Phone className="w-5 h-5 text-amber-500 group-hover/link:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-1">Call the Studio</p>
                                        <p className="text-xl font-mono">+1 (502) 644-2754</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <CalendarPicker />
                    </div>

                    {/* Location / Map Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-2 relative overflow-hidden shadow-2xl flex flex-col">
                        <div className="w-full h-64 md:h-full bg-neutral-800 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100">
                            {/* Embedded Google Map iframe - Replace src with actual map embed link for 543 N Wilson Rd Radcliff, KY */}
                            <iframe
                                title="F&H Hair Braiding Location"
                                src="https://maps.google.com/maps?q=543+N+Wilson+Rd+Suite+D+Radcliff+KY+40160&output=embed&z=16"
                                className="absolute inset-0 w-full h-full border-0"
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md border border-neutral-800 p-6 rounded-2xl flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white font-serif text-lg mb-1">Our Studio Location</h4>
                                <p className="text-neutral-400 text-sm leading-relaxed">
                                    543 N Wilson Rd, Suite D<br />
                                    Radcliff, KY 40160<br />
                                    <span className="text-amber-500/80 mt-1 block tracking-wider uppercase text-xs">By Appointment Only</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
