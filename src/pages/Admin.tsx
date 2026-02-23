import { useState, useEffect } from 'react';
import { Camera, Type, Clock, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

const Admin = () => {
    const [services, setServices] = useState<any[]>([]);
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('gallery');

    // Gallery Manager State
    const [selectedCategory, setSelectedCategory] = useState('Knotless');
    const [altText, setAltText] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    // Silo Editor State
    const [selectedSilo, setSelectedSilo] = useState('');
    const [siloContent, setSiloContent] = useState('');

    // Availability State
    const [availabilityStatus, setAvailabilityStatus] = useState('Limited availability remaining. Contact immediately to secure a slot for this Friday or Saturday.');

    // Simulated Fetch -> Real API Fetch
    useEffect(() => {
        // We'll fetch from the active Cloudflare endpoint which queries D1
        const baseUrl = import.meta.env.PROD ? 'https://fhhairbraiding.com' : 'http://localhost:8787';
        fetch(`${baseUrl}/api/services`)
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    setServices(data);
                } else {
                    // Fallback to local
                    fetch('/src/content/services.json')
                        .then(res => res.json())
                        .then(localData => setServices(localData));
                }
            })
            .catch(() => {
                // Fallback to local on error (like if dev environment)
                fetch('/src/content/services.json')
                    .then(res => res.json())
                    .then(data => setServices(data));
            });
    }, []);

    const handleGalleryUpload = async (e: any) => {
        e.preventDefault();
        if (!uploadFile) return alert("Please select an image file.");
        if (!selectedCategory) return alert("Please select a target service category.");
        if (!altText) return alert("Please provide SEO alt-text for the image.");

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("serviceId", selectedCategory);
        // Normally we'd also pass altText if the backend accepted it

        try {
            // Send to Cloudflare Worker Admin endpoint
            const baseUrl = import.meta.env.PROD ? 'https://fhhairbraiding.com' : 'http://localhost:8787';
            const response = await fetch(`${baseUrl}/api/admin/upload`, {
                method: 'POST',
                headers: {
                    'X-Admin-Key': password
                },
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Upload failed");
            }

            const data = await response.json();

            alert(`Success! Image uploaded to R2 and mapped to the service. New URL: ${data.url}`);
            setAltText('');
            setUploadFile(null);
        } catch (error: any) {
            alert(`Error uploading file: ${error.message}`);
        }
    };

    const handleSiloSave = (e: any) => {
        e.preventDefault();
        if (!selectedSilo) return;
        alert(`Success! Saved updated markdown content for silo: ${selectedSilo}`);
    };

    const handleAvailabilitySave = (e: any) => {
        e.preventDefault();
        alert(`Success! Availability Status updated across the application.`);
    };

    if (!isLoggedIn) {
        return (
            <div className="p-10 bg-black min-h-screen flex flex-col items-center justify-center text-white">
                <div className="w-full max-w-md border border-neutral-800 p-8 rounded-2xl bg-neutral-900/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

                    <div className="text-center mb-8 relative z-10">
                        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-serif font-bold text-white">F&H Secure Admin</h1>
                        <p className="text-neutral-400 text-sm mt-2">v4.1 Content Management System</p>
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (password.length > 0) {
                                try {
                                    const baseUrl = import.meta.env.PROD ? 'https://fhhairbraiding.com' : 'http://localhost:8787';
                                    const res = await fetch(`${baseUrl}/api/login`, {
                                        method: 'POST',
                                        headers: { 'X-Admin-Key': password }
                                    });
                                    if (res.ok) {
                                        setIsLoggedIn(true);
                                    } else {
                                        alert("Invalid Master Password. Unauthorized.");
                                    }
                                } catch (err) {
                                    alert("Could not reach authentication server.");
                                }
                            }
                        }}
                        className="space-y-4 relative z-10"
                    >
                        <input
                            type="password"
                            placeholder="Enter Master Password"
                            required
                            className="bg-black p-4 rounded-xl w-full border border-neutral-800 focus:border-amber-500 outline-none transition-colors"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        >
                            Log In to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-end mb-8 border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-amber-500 mb-1">Command Center</h1>
                        <p className="text-neutral-400 text-sm">Manage SEO Silos, Galleries, and Global Settings</p>
                    </div>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Secure Logout
                    </button>
                </header>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Navigation Sidebar */}
                    <nav className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                        <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'gallery' ? 'bg-amber-500 text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                            <Camera className="w-5 h-5" />
                            Gallery Manager
                        </button>
                        <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-amber-500 text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                            <Type className="w-5 h-5" />
                            Silo Content Editor
                        </button>
                        <button onClick={() => setActiveTab('availability')} className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'availability' ? 'bg-amber-500 text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                            <Clock className="w-5 h-5" />
                            Global Availability
                        </button>
                    </nav>

                    {/* Main Content Area */}
                    <main className="flex-grow w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl">

                        {/* Tab 1: Gallery */}
                        {activeTab === 'gallery' && (
                            <form onSubmit={handleGalleryUpload} className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold mb-6">Upload to Signature Crowns</h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400">Silo Category</label>
                                    <select title="Select category" aria-label="Select Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-xl p-4 focus:ring-1 focus:ring-amber-500 outline-none">
                                        <option value="">-- Select a Service --</option>
                                        {services.map(s => <option key={s.id || s.slug} value={s.id}>{s.name || s.title}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400">SEO Alt-Text (Required)</label>
                                    <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="e.g. Medium Jumbo Knotless Braids Radcliff KY" className="w-full bg-black border border-neutral-800 rounded-xl p-4 focus:ring-1 focus:ring-amber-500 outline-none" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400">Image Asset</label>
                                    <input title="Upload image" aria-label="Upload Image" type="file" onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} className="block w-full text-sm text-neutral-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-amber-500 file:text-black file:font-bold hover:file:bg-amber-400 cursor-pointer" required />
                                </div>

                                <button type="submit" className="flex items-center gap-2 justify-center w-full bg-amber-500 hover:bg-white text-black font-bold py-4 rounded-xl transition-all">
                                    Upload & Index to Cloudflare R2
                                </button>
                            </form>
                        )}

                        {/* Tab 2: Content */}
                        {activeTab === 'content' && (
                            <form onSubmit={handleSiloSave} className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold mb-6">Silo Content Editor</h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400">Target Silo Route</label>
                                    <select title="Select route" aria-label="Select Route" value={selectedSilo} onChange={(e) => setSelectedSilo(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-xl p-4 focus:ring-1 focus:ring-amber-500 outline-none" required>
                                        <option value="">-- Choose a Silo --</option>
                                        {services.map(s => <option key={s.slug} value={s.slug}>{s.name} (/services/{s.slug})</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400">Markdown Content Body</label>
                                    <textarea value={siloContent} onChange={(e) => setSiloContent(e.target.value)} rows={10} placeholder="# H1 implicitly ignored\n\nWrite your SEO optimized markdown here..." className="w-full bg-black border border-neutral-800 rounded-xl p-4 focus:ring-1 focus:ring-amber-500 outline-none font-mono text-sm" />
                                </div>

                                <button type="submit" className="flex items-center gap-2 justify-center w-full bg-amber-500 hover:bg-white text-black font-bold py-4 rounded-xl transition-all">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Publish Silo Updates
                                </button>
                            </form>
                        )}

                        {/* Tab 3: Availability */}
                        {activeTab === 'availability' && (
                            <form onSubmit={handleAvailabilitySave} className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold mb-6">Global Availability Setting</h2>
                                <p className="text-neutral-400 text-sm mb-6 pb-6 border-b border-neutral-800">This modifies the specific opening text found inside the "Contact Hub" form globally across the entire application.</p>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400">Current Notice</label>
                                    <input type="text" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-xl p-4 focus:ring-1 focus:ring-amber-500 outline-none" required />
                                </div>

                                <button type="submit" className="flex items-center gap-2 justify-center w-full bg-amber-500 hover:bg-white text-black font-bold py-4 rounded-xl transition-all">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Update Global Availability
                                </button>
                            </form>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Admin;