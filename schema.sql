-- D1 Database Schema for F&H Hair Braiding
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS services;
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    loyalty_points INTEGER DEFAULT 0
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
    duration_minutes INTEGER NOT NULL
);
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    slot_id TEXT NOT NULL,
    -- e.g., '2026-03-01T10:00:00Z'
    status TEXT NOT NULL CHECK(
        status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')
    ),
    stripe_payment_intent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE(slot_id) -- Crucial: Prevents double-booking at the database level!
);
-- Insert initial services
INSERT INTO services (
        id,
        slug,
        name,
        description,
        price,
        duration_minutes
    )
VALUES (
        'srv_1',
        'box-braids',
        'Box Braids',
        'Classic box braids professionally installed.',
        15000,
        240
    ),
    (
        'srv_2',
        'bohemian-braids',
        'Bohemian Braids',
        'Beautiful boho braids with curly ends.',
        18000,
        300
    ),
    (
        'srv_3',
        'knotless-braids',
        'Knotless Braids',
        'Pain-free knotless braids.',
        16000,
        240
    ),
    (
        'srv_4',
        'cornrows',
        'Cornrows',
        'Sleek, straight-back cornrows.',
        8000,
        120
    ),
    (
        'srv_5',
        'passion-twists',
        'Passion Twists',
        'Bouncy and textured passion twists.',
        14000,
        210
    );