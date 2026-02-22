import { test, expect } from '@playwright/test';

test.describe('Booking Engine Edge Cases', () => {
    test('Race Condition Mitigation: Simultaneous Bookings', async ({ browser }) => {
        // This test simulates two users trying to book the same slot at the exact same time
        // We expect the D1 transaction to allow only one through and reject the other

        // In a real Playwright setup for an API endpoint without UI:
        const context1 = await browser.newContext();
        const context2 = await browser.newContext();

        const request1 = context1.request;
        const request2 = context2.request;

        // Simulate concurrent POST requests to the booking API
        const targetSlotId = 'slot-friday-2pm';

        const [res1, res2] = await Promise.all([
            request1.post('http://localhost:8787/api/bookings', {
                data: { slotId: targetSlotId, userId: 'user-A' }
            }).catch(e => e),
            request2.post('http://localhost:8787/api/bookings', {
                data: { slotId: targetSlotId, userId: 'user-B' }
            }).catch(e => e)
        ]);

        // One should succeed (200 OK), the other should fail (409 Conflict)
        const statuses = [res1.status(), res2.status()];
        expect(statuses).toContain(200);
        expect(statuses).toContain(409);
    });

    test('Interrupted Payment Flow: No Ghost Bookings', async ({ request }) => {
        // A user starts a checkout session but abandons it.
        // Ensure the slot remains available.

        const targetSlotId = 'slot-saturday-10am';

        // 1. Initial booking creates a pending hold
        const initRes = await request.post('http://localhost:8787/api/bookings/init', {
            data: { slotId: targetSlotId, userId: 'user-C' }
        });

        expect(initRes.status()).toBe(200);

        // 2. We pretend the Stripe webhook fires a 'checkout.session.expired' event
        const expireRes = await request.post('http://localhost:8787/api/webhook', {
            data: {
                type: 'checkout.session.expired',
                data: { object: { metadata: { slotId: targetSlotId } } }
            }
        });

        expect(expireRes.status()).toBe(200);

        // 3. Verify the slot is open again
        const verifyRes = await request.get(`http://localhost:8787/api/slots/${targetSlotId}`);
        const slot = await verifyRes.json();

        expect(slot.status).toBe('AVAILABLE');
    });
});
