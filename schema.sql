-- D1 Database Schema for F&H Hair Braiding
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS availability_slots;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bookings;
CREATE TABLE gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id TEXT NOT NULL,
    -- e.g. 'srv_1'
    service_slug TEXT NOT NULL,
    -- e.g. 'box-braids'
    image_url TEXT NOT NULL,
    -- https://images.fhhairbraiding.com/...
    section TEXT NOT NULL DEFAULT 'signature' CHECK(section IN ('signature', 'portfolio')),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    -- Stored in cents
    deposit_amount INTEGER NOT NULL DEFAULT 2500,
    -- $25 in cents
    duration_minutes INTEGER NOT NULL,
    image_url TEXT -- Added for admin uploads
);
CREATE TABLE availability_slots (
    id TEXT PRIMARY KEY,
    -- e.g., '2026-03-01T10:00:00Z'
    is_booked INTEGER DEFAULT 0,
    version INTEGER DEFAULT 0
);
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slot_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    status TEXT NOT NULL CHECK(
        status IN ('pending_deposit', 'confirmed', 'cancelled')
    ),
    stripe_session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Insert initial services
INSERT INTO services (
        id,
        slug,
        name,
        description,
        price,
        duration_minutes,
        image_url
    )
VALUES (
        'srv_1',
        'box-braids',
        'Box Braids',
        'Classic box braids professionally installed.',
        15000,
        240,
        '/images/gallery-4.png'
    ),
    (
        'srv_2',
        'bohemian-braids',
        'Bohemian Braids',
        'Beautiful boho braids with curly ends.',
        18000,
        300,
        '/images/gallery-2.png'
    ),
    (
        'srv_3',
        'knotless-braids',
        'Knotless Braids',
        'Pain-free knotless braids.',
        16000,
        240,
        '/images/gallery-1.png'
    ),
    (
        'srv_4',
        'passion-twists',
        'Passion Twists',
        'Bouncy and textured passion twists.',
        14000,
        210,
        '/images/after.png'
    ),
    (
        'srv_5',
        'cornrows',
        'Cornrows',
        'Sleek, straight-back cornrows.',
        8000,
        120,
        '/images/gallery-3.png'
    ),
    (
        'srv_6',
        'fulani-braids',
        'Fulani Braids',
        'Elegant Fulani-inspired styles mixing cornrows and box braids for a striking cultural statement.',
        16000,
        240,
        '/images/gallery-2.png'
    ),
    (
        'srv_7',
        'lemonade-braids',
        'Lemonade Braids',
        'Signature side-swept Lemonade braids executed with structural perfection.',
        12000,
        180,
        '/images/gallery-1.png'
    ),
    (
        'srv_8',
        'faux-locs',
        'Faux Locs',
        'Stunning, realistic Faux Locs providing a long-term protective style with a natural finish.',
        20000,
        360,
        '/images/after.png'
    ),
    (
        'srv_9',
        'goddess-braids',
        'Goddess Braids',
        'Thick, regal Goddess braids combined with curly leave-outs for unparalleled volume.',
        15000,
        210,
        '/images/gallery-4.png'
    ),
    (
        'srv_10',
        'senegalese-twists',
        'Senegalese Twists',
        'Smooth and elegant Senegalese Twists crafted using the two-strand method for a polished look.',
        14000,
        240,
        '/images/gallery-3.png'
    ),
    (
        'srv_11',
        'tribal-braids',
        'Tribal Braids',
        'Intricate tribal patterns demonstrating advanced geometric parting and styling.',
        18000,
        270,
        '/images/gallery-2.png'
    ),
    (
        'srv_12',
        'crochet-braids',
        'Crochet Braids',
        'Fast and safe Crochet installations offering endless style variations with zero tension.',
        12000,
        150,
        '/images/gallery-1.png'
    ),
    (
        'srv_13',
        'micro-braids',
        'Micro Braids',
        'Delicate, tiny micro braids offering the flexibility of freely moving hair with the protection of braids.',
        25000,
        420,
        '/images/gallery-4.png'
    ),
    (
        'srv_14',
        'jumbo-braids',
        'Jumbo Braids',
        'Bold, statement-making jumbo braids for a striking aesthetic and quicker installation.',
        10000,
        150,
        '/images/after.png'
    ),
    (
        'srv_15',
        'spring-twists',
        'Spring Twists',
        'Short, coiled spring twists that deliver a playful, voluminous style perfect for summer.',
        13000,
        180,
        '/images/gallery-3.png'
    ),
    (
        'srv_16',
        'ponytails-updos',
        'Ponytails & Updos',
        'Sophisticated Braided Ponytails & High-Crown Styles.',
        8000,
        180,
        '/images/gallery-1.png'
    );