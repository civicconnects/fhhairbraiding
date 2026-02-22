import { useState, useEffect } from 'react';

const Admin = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [password, setPassword] = useState(''); // New password state

    useEffect(() => {
        fetch('https://fhhairbraiding.dwhite4388.workers.dev/api/services')
            .then(res => res.json())
            .then(data => setServices(data));
    }, []);

    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('serviceId', selectedService);

        const response = await fetch('https://fhhairbraiding.dwhite4388.workers.dev/api/admin/upload', {
            method: 'POST',
            headers: { 'X-Admin-Key': password }, // Send password in headers
            body: formData
        });

        if (response.ok) {
            alert("Success! Image linked.");
        } else {
            alert("Unauthorized: Wrong Password.");
        }
    };

    return (
        <div className="p-10 bg-black min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-8 text-amber-500">F&H Secure Admin</h1>

            <input
                type="password"
                title="Admin Password"
                aria-label="Admin Password"
                placeholder="Enter Admin Password"
                className="bg-neutral-800 p-4 rounded mb-6 w-full border border-neutral-700"
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className="border-t border-neutral-800 pt-6">
                <select
                    title="Select Service"
                    aria-label="Select Service"
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="bg-neutral-800 p-4 rounded mb-4 w-full"
                >
                    <option>Select Service (Box Braids, etc.)</option>
                    {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <input
                    title="Upload image for service"
                    aria-label="Upload image for service"
                    type="file"
                    onChange={handleUpload}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-500 file:text-white"
                />
            </div>
        </div>
    );
};

export default Admin;
