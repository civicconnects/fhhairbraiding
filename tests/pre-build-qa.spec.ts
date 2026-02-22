import { test, expect } from '@playwright/test';

test.describe('Pre-Build QA Blueprint Assertions', () => {

    test('Test Scenario: The "Double-Queen" Collision (Concurrency)', async ({ request }) => {
        // Goal: Prove two clients cannot book the same slot simultaneously
        const slotId = `slot_10am_${Date.now()}`;
        const attempts = 10;

        // Fire 10 concurrent POST requests
        const promises = Array.from({ length: attempts }, (_, i) => {
            return request.post('http://127.0.0.1:8787/api/bookings/init', {
                data: {
                    slotId,
                    customerName: `Queen ${i}`,
                    customerEmail: `queen${i}@example.com`,
                    customerPhone: `555-010${i}`
                }
            });
        });

        const responses = await Promise.all(promises);

        // Count exact successes and failures
        const successResponses = responses.filter(r => r.status() === 200);
        const failureResponses = responses.filter(r => r.status() === 409);

        // Success Criteria: Exactly 1 success, 9 failures due to unique constraint
        expect(successResponses.length).toBe(1);
        expect(failureResponses.length).toBe(attempts - 1);
    });

    test('Test Scenario: The "Ghost Payment" (Webhook Reliability)', async ({ request }) => {
        // Goal: Ensure no appointment is confirmed without a verified Stripe signature.
        // Send a mock webhook payload with an invalid signature
        const payload = JSON.stringify({
            type: 'checkout.session.completed',
            data: { object: { metadata: { appointmentId: 'test_123', slotId: 'test_456' } } }
        });

        const response = await request.post('http://127.0.0.1:8787/api/webhook', {
            headers: {
                'stripe-signature': 't=123,v1=invalid_signature',
                'Content-Type': 'application/json'
            },
            data: payload
        });

        // Success Criteria: Returns 401/400 and database logic is NOT executed.
        expect(response.status()).toBe(400);
    });
});
