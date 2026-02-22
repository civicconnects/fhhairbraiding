import { useEffect, useState } from 'react';

export default function ServiceGrid() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('https://fhhairbraiding.dwhite4388.workers.dev/api/services')
            .then(res => res.json())
            .then(data => setServices(data))
            .catch(err => console.error("F&H Fetch Error:", err));
    }, []);

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-amber-500">Our Signature Styles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {services.map((service: any) => (
                    <div key={service.id} className="group bg-neutral-800/50 border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500">
                        <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
                            <img
                                src={service.image_url || `https://images.unsplash.com/photo-1646244243103-625299863459?auto=format&fit=crop&q=80&w=800`}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold">{service.name}</h3>
                                <span className="text-amber-500 font-mono text-xl">${service.base_price}</span>
                            </div>
                            <p className="text-neutral-400 mb-6">{service.duration_minutes / 60} Hour Session</p>
                            <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-colors">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
