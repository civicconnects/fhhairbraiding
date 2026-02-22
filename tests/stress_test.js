// Adversarial Test: Concurrent Booking Collision
async function simulateBookingWar(slotId) {
    const users = 100; // Simulating 100 simultaneous clicks
    const bookingRequests = [];

    console.log(`🚀 Launching ${users} concurrent attempts on Slot: ${slotId}`);

    for (let i = 0; i < users; i++) {
        bookingRequests.push(
            fetch('http://127.0.0.1:8787/api/bookings/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotId, userId: `user_${i}`, depositPaid: true })
            })
        );
    }

    const results = await Promise.all(bookingRequests);
    const successes = results.filter(r => r.status === 200).length;

    if (successes > 1) {
        throw new Error(`❌ CRITICAL FAILURE: ${successes} users booked the same slot!`);
    } else if (successes === 1) {
        console.log(`✅ SUCCESS: Only ${successes} user secured the appointment.`);
    } else {
        console.log(`⚠️ WARNING: No users secured the appointment. Server might have crashed or rate limited.`);
    }
}

// Run test if called directly
if (require.main === module) {
    const slotId = `stress-test-${Date.now()}`;
    simulateBookingWar(slotId).catch(console.error);
}

module.exports = { simulateBookingWar };
