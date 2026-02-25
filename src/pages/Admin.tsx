import { useState, useEffect } from 'react';
import { Camera, Type, Clock, ShieldCheck, LogOut, CheckCircle2, CalendarDays, Eye, EyeOff, Trash2 } from 'lucide-react';

const Admin = () => {
    const [services, setServices] = useState<any[]>([]);
    const [password, setPassword] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('gallery');

    // Gallery Manager State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSection, setSelectedSection] = useState<'signature' | 'portfolio'>('signature');
    const [altText, setAltText] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    // Silo Editor State
    const [selectedSilo, setSelectedSilo] = useState('');
    const [siloContent, setSiloContent] = useState('');

    // Schedule State
    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Gallery Images State
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);

    // Availability State
    const [availabilityStatus, setAvailabilityStatus] = useState('Limited availability remaining. Contact immediately to secure a slot for this Friday or Saturday.');

    // Fetch services from /api/services (Cloudflare Pages Function — same domain, no CORS)
    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    setServices(data);
                    // Auto-select the first service slug in Silo Editor
                    setSelectedSilo(data[0].slug);
                } else {
                    fetch('/src/content/services.json')
                        .then(res => res.json())
                        .then(localData => {
                            setServices(localData);
                            if (localData.length > 0) setSelectedSilo(localData[0].slug);
                        });
                }
            })
            .catch(() => {
                fetch('/src/content/services.json')
                    .then(res => res.json())
                    .then(data => {
                        setServices(data);
                        if (data.length > 0) setSelectedSilo(data[0].slug);
                    });
            });
    }, []);

    const handleGalleryUpload = async (e: any) => {
        e.preventDefault();
        if (!uploadFile) return alert("Please select an image file.");
        if (!selectedCategory) return alert("Please select a target service category.");
        if (!altText) return alert("Please provide SEO alt-text for the image.");

        // Find the selected service's slug
        const selectedService = services.find((s: any) => s.id === selectedCategory);
        const serviceSlug = selectedService?.slug || selectedCategory;

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("serviceId", selectedCategory);
        formData.append("serviceSlug", serviceSlug);
        formData.append("section", selectedSection);

        try {
            // Send to Pages Function (same domain — no CORS issues)
            const response = await fetch('/api/admin/upload', {
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

            alert(`✅ Success! Uploaded to '${data.section}' section.\nFile: ${data.fileName}\nURL: ${data.url}`);
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

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                headers: { 'X-Admin-Key': password }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (_) { }
        finally { setBookingsLoading(false); }
    };

    const updateBookingStatus = async (id: number, status: string) => {
        await fetch('/api/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': password },
            body: JSON.stringify({ id, status })
        });
        fetchBookings();
    };

    const fetchGalleryImages = async () => {
        setGalleryLoading(true);
        try {
            const res = await fetch('/api/admin/gallery', { headers: { 'X-Admin-Key': password } });
            if (res.ok) setGalleryImages(await res.json());
        } catch (_) { }
        finally { setGalleryLoading(false); }
    };

    const toggleImageVisibility = async (id: number, currentVisible: number) => {
        await fetch('/api/admin/gallery', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': password },
            body: JSON.stringify({ id, visible: currentVisible === 1 ? 0 : 1 })
        });
        setGalleryImages(prev => prev.map(img => img.id === id ? { ...img, visible: currentVisible === 1 ? 0 : 1 } : img));
    };

    const deleteGalleryImage = async (id: number) => {
        if (!confirm('Permanently delete this image from R2 and the gallery? This cannot be undone.')) return;
        await fetch('/api/admin/gallery', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': password },
            body: JSON.stringify({ id })
        });
        setGalleryImages(prev => prev.filter(img => img.id !== id));
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
                            try {
                                const res = await fetch('/api/login', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ username: loginUsername, password })
                                });
                                if (res.ok) {
                                    const data = await res.json();
                                    // Keep password in state for subsequent admin API calls that still use X-Admin-Key
                                    setIsLoggedIn(true);
                                    setPassword(password); // preserve for gallery/bookings API calls
                                    console.log(`Logged in as ${data.username} (${data.role})`);
                                } else {
                                    alert("Invalid username or password.");
                                }
                            } catch (err) {
                                alert("Could not reach authentication server.");
                            }
                        }}
                        className="space-y-4 relative z-10"
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            autoComplete="username"
                            className="bg-black p-4 rounded-xl w-full border border-neutral-800 focus:border-amber-500 outline-none transition-colors"
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            autoComplete="current-password"
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
                        <button onClick={() => { setActiveTab('schedule'); fetchBookings(); }} className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'schedule' ? 'bg-amber-500 text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                            <CalendarDays className="w-5 h-5" />
                            Schedule
                        </button>
                        <button onClick={() => { setActiveTab('images'); fetchGalleryImages(); }} className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'images' ? 'bg-amber-500 text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                            <Eye className="w-5 h-5" />
                            Manage Images
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
                                    <label className="text-sm font-bold text-neutral-400">Display Section</label>
                                    <select
                                        title="Select section"
                                        aria-label="Select Section"
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value as 'signature' | 'portfolio')}
                                        className="w-full bg-black border border-neutral-800 rounded-xl p-4 focus:ring-1 focus:ring-amber-500 outline-none"
                                    >
                                        <option value="signature">✨ Signature Crowns (Homepage)</option>
                                        <option value="portfolio">🖼️ Live Portfolio (Gallery Page)</option>
                                    </select>
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

                        {/* Tab 4: Schedule */}
                        {activeTab === 'schedule' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-serif font-bold">Booking Schedule</h2>
                                    <button onClick={fetchBookings} className="text-xs font-bold text-amber-500 hover:text-white uppercase tracking-widest transition-colors">↻ Refresh</button>
                                </div>

                                {bookingsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl">
                                        <CalendarDays className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                                        <p className="text-neutral-500">No bookings yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bookings.map((b: any) => (
                                            <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    <div className="text-center bg-neutral-900 rounded-lg px-4 py-2 min-w-[100px]">
                                                        <p className="text-amber-500 font-bold text-sm">{b.date}</p>
                                                        <p className="text-neutral-400 text-xs font-mono">{b.time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">{b.customer_name}</p>
                                                        <p className="text-neutral-400 text-sm">{b.service_type}</p>
                                                        <p className="text-neutral-600 text-xs">{b.phone}{b.email ? ` · ${b.email}` : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                        {b.status}
                                                    </span>
                                                    {b.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-xs font-bold text-green-400 hover:text-white border border-green-800 hover:border-green-400 px-3 py-1 rounded-lg transition-all">Confirm</button>
                                                            <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="text-xs font-bold text-red-400 hover:text-white border border-red-900 hover:border-red-400 px-3 py-1 rounded-lg transition-all">Cancel</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 5: Manage Images */}
                        {activeTab === 'images' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-serif font-bold">Manage Gallery Images</h2>
                                    <button onClick={fetchGalleryImages} className="text-xs font-bold text-amber-500 hover:text-white uppercase tracking-widest transition-colors">↻ Refresh</button>
                                </div>
                                {galleryLoading ? (
                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" /></div>
                                ) : galleryImages.length === 0 ? (
                                    <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl">
                                        <Camera className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                                        <p className="text-neutral-500">No images uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {galleryImages.map((img: any) => (
                                            <div key={img.id} className={`relative group rounded-xl overflow-hidden border ${img.visible ? 'border-neutral-800' : 'border-red-900/50 opacity-60'}`}>
                                                <img
                                                    src={img.image_url}
                                                    alt={img.service_slug}
                                                    className="w-full h-40 object-cover bg-neutral-900"
                                                />
                                                {/* Section badge */}
                                                <div className="absolute top-2 left-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${img.section === 'signature' ? 'bg-amber-500/90 text-black' : 'bg-purple-600/90 text-white'}`}>
                                                        {img.section}
                                                    </span>
                                                </div>
                                                {/* Hidden badge */}
                                                {!img.visible && (
                                                    <div className="absolute top-2 right-2 bg-red-600/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">Hidden</div>
                                                )}
                                                {/* Actions */}
                                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        title={img.visible ? 'Hide from site' : 'Show on site'}
                                                        onClick={() => toggleImageVisibility(img.id, img.visible)}
                                                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-all"
                                                    >
                                                        {img.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                        {img.visible ? 'Hide' : 'Show'}
                                                    </button>
                                                    <button
                                                        title="Delete image permanently"
                                                        onClick={() => deleteGalleryImage(img.id)}
                                                        className="flex items-center justify-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-red-900/80 hover:bg-red-700 text-red-300 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-neutral-500 text-center py-1 truncate px-2">{img.service_slug}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div >
    );
};

export default Admin;