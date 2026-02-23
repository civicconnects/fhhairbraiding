const testBooking = async () => {
    const slotId = `slot_${Date.now()}`;
    console.log(`Testing slot: ${slotId}`);

    const makeRequest = () => fetch('http://localhost:8787/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            slotId,
            customerName: 'Test User',
            customerEmail: 'test@example.com',
            customerPhone: '555-5555'
        })
    });

    // Fire two requests simultaneously
    console.log('Sending two concurrent booking requests for the same slot...');
    const [res1, res2] = await Promise.all([makeRequest(), makeRequest()]);

    const data1 = await res1.json();
    const data2 = await res2.json();

    console.log('Request 1 Status:', res1.status, 'Body:', data1);
    console.log('Request 2 Status:', res2.status, 'Body:', data2);

    const statuses = [res1.status, res2.status];
    if (statuses.includes(200) && statuses.includes(409)) {
        console.log('✅ SUCCESS: D1 Transaction logic prevented double-booking. One succeeded (200), one failed (409).');
    } else {
        console.error('❌ FAILURE: Did not get the expected 200/409 split.');
    }

    const payload = [data1, data2].find(d => d.checkoutUrl);
    if (payload && payload.checkoutUrl.includes('checkout.stripe.com')) {
        console.log('✅ SUCCESS: Valid Stripe Checkout Session URL generated:', payload.checkoutUrl);
    } else {
        console.error('❌ FAILURE: No Stripe Checkout URL returned.');
    }

    // Also test SEO tags later on frontend, but for now this proves Phase 3 Backend Guardrails.
};

testBooking();
