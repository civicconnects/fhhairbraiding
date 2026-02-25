import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, ComponentType } from 'react';

// Dynamically import all MDX files
const modules = import.meta.glob('../content/services/*.mdx');

export default function ServiceDetail() {
    const { slug } = useParams();
    const [MdxContent, setMdxContent] = useState<ComponentType<any> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadContent() {
            if (!slug) return;
            const path = `../content/services/${slug}.mdx`;
            const loadMdx = modules[path];

            if (loadMdx) {
                try {
                    const mod = await loadMdx() as { default: ComponentType<any> };
                    setMdxContent(() => mod.default);
                    injectSEO(slug); // Inject SEO for the specific service
                } catch (e) {
                    console.error("Failed to load service MDX", e);
                }
            }
            setLoading(false);
        }
        loadContent();

        // Cleanup injected tags on unmount
        return () => {
            document.querySelectorAll('[data-dynamic-seo]').forEach(el => el.remove());
        };
    }, [slug]);

    const injectSEO = (serviceSlug: string) => {
        const titleCase = serviceSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        // Update document title
        document.title = `${titleCase} in Radcliff KY & Fort Knox | F&H Hair Braiding`;

        // Generate JSON-LD
        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": titleCase,
            "provider": {
                "@type": "LocalBusiness",
                "name": "F & H Hair Braiding",
                "telephone": "+1-502-644-2754",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "543 N Wilson Rd, Suite D",
                    "addressLocality": "Radcliff",
                    "addressRegion": "KY",
                    "postalCode": "40160"
                }
            },
            "areaServed": ["Radcliff", "Fort Knox", "Kentucky"],
            "description": `Premium, tension-free ${titleCase} by certified professionals in Radcliff.`
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-seo', 'true');
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);

        // Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Looking for flawless ${titleCase}? F&H Hair Braiding provides premium, tension-free ${titleCase} styling in the Fort Knox and Radcliff area. Book today!`);
        metaDesc.setAttribute('data-dynamic-seo', 'true');
    };

    if (loading) return <div className="p-24 text-center text-white text-2xl animate-pulse font-serif">Loading Elite Braiding Services...</div>;

    if (!MdxContent) return (
        <div className="p-24 text-center text-white h-screen bg-black flex flex-col justify-center items-center">
            <h2 className="text-4xl font-serif font-bold mb-4 text-amber-500">Service Not Found</h2>
            <Link to="/" className="text-neutral-400 hover:text-white underline tracking-wide">Return to Homepage</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-amber-500/30 font-sans pb-24 md:pb-0">

            {/* Dynamic MDX Content Area */}
            <article className="prose prose-invert prose-amber max-w-4xl mx-auto px-6 py-16 prose-h2:text-white prose-h2:border-b border-neutral-800 prose-h2:pb-4 prose-h2:mt-16 prose-img:rounded-2xl prose-img:shadow-2xl prose-a:text-amber-500">
                <Link to="/" className="inline-block mb-12 text-neutral-400 hover:text-amber-500 font-bold tracking-widest uppercase text-sm transition-colors no-underline">
                    &larr; Back to all styles
                </Link>

                <h1 className="text-4xl md:text-6xl font-extrabold font-serif mb-12 text-white">
                    {slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''} <span className="text-amber-500 italic">in Radcliff, KY</span>
                </h1>

                <MdxContent />
            </article>

            {/* Lead Gen CTA attached below every service page for maximum conversion */}
            <div className="bg-neutral-900 border-t border-y-[1px] border-neutral-800 py-16 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl font-serif font-bold text-white mb-6">Ready for your Transformation?</h2>
                    <p className="text-xl text-neutral-400 font-light mb-10">
                        Contact us to verify schedule openings. Immediate response guaranteed.
                    </p>
                    <a href="https://wa.me/15026442754?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment!" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-black transition-all bg-amber-500 hover:bg-white rounded-xl shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]">
                        💬 Book via WhatsApp / Text
                    </a>
                </div>
            </div>
        </main>
    );
}
