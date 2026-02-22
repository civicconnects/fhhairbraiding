import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, ComponentType } from 'react';
import BookingEngine from '../components/BookingEngine';

// Dynamically import all MDX files in the content/services directory
const modules = import.meta.glob('../content/services/*.mdx');

interface MDXModule {
    default: ComponentType<any>;
    frontmatter?: any;
}

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
                    const mod = await loadMdx() as MDXModule;
                    setMdxContent(() => mod.default);
                } catch (e) {
                    console.error("Failed to load generic service MDX", e);
                }
            }
            setLoading(false);
        }
        loadContent();
    }, [slug]);

    if (loading) return <div className="p-24 text-center text-white text-2xl animate-pulse">Loading Elite Braiding Services...</div>;

    if (!MdxContent) return (
        <div className="p-24 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Service Not Found</h2>
            <Link to="/" className="text-amber-500 hover:text-amber-400">Return to Home</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-amber-500/30">

            {/* Dynamic MDX Content Area */}
            <article className="prose prose-invert prose-amber max-w-4xl mx-auto px-6 py-16 prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:font-extrabold prose-h1:mb-12 prose-h2:text-white prose-h2:border-b-2 prose-h2:border-amber-900/50 prose-h2:pb-4 prose-h2:mt-12 prose-img:rounded-2xl prose-img:shadow-2xl">
                <Link to="/" className="inline-block mb-8 text-amber-500 hover:text-amber-400 font-bold tracking-wide no-underline">&larr; Back to all services</Link>
                <MdxContent />
            </article>

            {/* Booking Engine attached below every service page for maximum conversion */}
            <div className="bg-neutral-900 border-t border-neutral-800 pb-16">
                <BookingEngine />
            </div>
        </main>
    );
}
