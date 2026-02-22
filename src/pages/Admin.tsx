import { useState, useEffect } from 'react';

const Admin = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    useEffect(() => {
        fetch('https://fhhairbraiding.dwhite4388.workers.dev/api/services')
            .then(res => res.json())
            .then(data => setServices(data));
    }, []);

    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file || !selectedService) {
            alert("Please select a service and a file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('serviceId', selectedService);

        const response = await fetch('https://fhhairbraiding.dwhite4388.workers.dev/api/admin/upload', {
            method: 'POST',
            headers: { 'X-Admin-Key': password },
            body: formData
        });

        if (response.ok) {
            alert("Success! Image linked.");
        } else {
            alert("Upload failed: Check your password or connection.");
        }
    };

    // --- 1. THE LOGIN SCREEN (The Gatekeeper) ---
    if (!isLoggedIn) {
        return (
            <div className="p-10 bg-black min-h-screen flex flex-col items-center justify-center text-white">
                <div className="w-full max-w-md border border-neutral-800 p-8 rounded-xl bg-neutral-900/50">
                    <h1 className="text-3xl font-bold mb-8 text-amber-500 text-center">F&H Secure Admin</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // This simply unlocks the UI. The Worker handles the actual security check during upload.
                            if (password.length > 0) setIsLoggedIn(true);
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            className="bg-neutral-800 p-4 rounded w-full border border-neutral-700 focus:border-amber-500 outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded transition-colors"
                        >
                            Login to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- 2. THE ACTUAL DASHBOARD (Only shows after login) ---
    return (
        <div className="p-10 bg-black min-h-screen text-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-500">Service Management</h1>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="text-sm text-gray-500 hover:text-white underline"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-2xl">
                    <label className="block text-sm font-medium text-gray-400 mb-2">1. Select Style to Update</label>
                    <select
                        title="Select Service"
                        aria-label="Select Service"
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="bg-neutral-800 p-4 rounded mb-6 w-full border border-neutral-700 text-white focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">Choose a style (Box Braids, Cornrows, etc.)</option>
                        {services.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-400 mb-2">2. Upload New Image</label>
                    <input
                        title="Upload image for service"
                        aria-label="Upload image for service"
                        type="file"
                        onChange={handleUpload}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-amber-500 file:text-black file:font-bold hover:file:bg-amber-600 cursor-pointer"
                    />

                    <p className="mt-6 text-xs text-gray-500 italic">
                        Note: Images will be linked to the selected service instantly via Cloudflare D1.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Admin;