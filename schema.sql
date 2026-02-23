-- D1 Database Schema for F&H Hair Braiding
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS availability_slots;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bookings;
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
        'cornrows',
        'Cornrows',
        'Sleek, straight-back cornrows.',
        8000,
        120,
        '/images/gallery-3.png'
    ),
    (
        'srv_5',
        'passion-twists',
        'Passion Twists',
        'Bouncy and textured passion twists.',
        14000,
        210,
        '/images/after.png'
    );