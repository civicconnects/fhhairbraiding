import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Calendar, Sparkles } from 'lucide-react';

export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Custom TikTok Icon
    const TikTokIcon = ({ className }: { className?: string }) => (
        <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05 6.33 6.33 0 0 0-5 10.33 6.37 6.37 0 0 0 10.15-2.07l.06-.11V8.65a8.44 8.44 0 0 0 5 1.55z" />
        </svg>
    );

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/#services' },
        { name: 'Portfolio', href: '/#gallery' },
    ];

    const socialLinks = [
        { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/fhhairbraiding' },
        { name: 'TikTok', icon: TikTokIcon, href: 'https://tiktok.com/@fhhairbraiding' },
        { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/FHHAIRBraiding' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${isScrolled ? 'bg-black/95 backdrop-blur-md border-b border-neutral-900 shadow-xl py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Brand / Logo Area */}
                <a href="/" className="flex items-center gap-2 group relative z-50">
                    <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center font-serif text-black font-extrabold text-xl group-hover:bg-white transition-colors">
                        F&H
                    </div>
                    <span className="font-serif font-bold text-lg tracking-wide hidden sm:block text-white">Hair Braiding</span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
                    <div className="flex gap-6 text-neutral-400">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="hover:text-amber-500 transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Social Divider */}
                    <div className="w-px h-6 bg-neutral-800" />

                    <div className="flex gap-4 text-neutral-400">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors hover:scale-110" aria-label={`Follow us on ${social.name}`}>
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>

                    <a href="/#contact" className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-black transition-all bg-amber-500 hover:bg-white rounded-full shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]">
                        <Calendar className="w-3.5 h-3.5" />
                        Book Now
                        <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-ping text-amber-600 absolute right-3" />
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-white p-2 relative z-50 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-neutral-950 z-40 px-6 pt-24 transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col gap-6 text-2xl font-serif font-bold h-full">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white hover:text-amber-500 transition-colors border-b border-neutral-900 pb-4"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="mt-8 flex gap-6">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-amber-500 transition-colors"
                                    aria-label={`Follow us on ${social.name}`}
                                    title={`Follow us on ${social.name}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
