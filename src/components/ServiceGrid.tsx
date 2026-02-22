import { useEffect, useState } from 'react';

const ServiceGrid = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('https://fhhairbraiding.dwhite4388.workers.dev/api/services')
            .then(res => res.json())
            .then(data => setServices(data));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
            {services.map((service: any) => (
                <div key={service.id} className="bg-neutral-800 rounded-xl overflow-hidden">
                    <img
                        // This will look for the image in your R2 bucket instead of the empty local folder
                        src={service.image_url || `https://images.unsplash.com/photo-1646244243103-625299863459?auto=format&fit=crop&w=500`}
                        alt={service.name}
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-bold">{service.name}</h3>
                        <p className="text-amber-500">${service.base_price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceGrid;
