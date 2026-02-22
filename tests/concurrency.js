// Test for Race Conditions in Booking
async function runRaceTest(slotId) {
    const attempts = Array.from({ length: 50 }, (_, i) =>
        fetch('http://127.0.0.1:8787/api/bookings/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slotId, user: i })
        })
    );

    const results = await Promise.all(attempts);
    const successCount = results.filter(r => r.ok).length;

    if (successCount > 1) {
        console.error("🛑 FAIL: Multiple bookings for one slot!");
    } else if (successCount === 1) {
        console.log("✅ SUCCESS: Concurrency handled. Only one booking secured the slot.");
    } else {
        console.log("⚠️ WARNING: No bookings successful. Check server status.");
    }
}

// Execute if run directly
if (require.main === module) {
    const slotId = `race-test-${Date.now()}`;
    runRaceTest(slotId).catch(console.error);
}

module.exports = { runRaceTest };
