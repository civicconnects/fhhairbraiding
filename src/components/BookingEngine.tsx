import { useState } from 'react';
import { Calendar, Clock, CreditCard, Lock } from 'lucide-react';

const mockSlots = [
    { id: '1', date: '2026-03-01', time: '10:00 AM', available: true },
    { id: '2', date: '2026-03-01', time: '02:00 PM', available: false },
    { id: '3', date: '2026-03-02', time: '09:00 AM', available: true },
    { id: '4', date: '2026-03-02', time: '01:00 PM', available: true }
];

const BookingEngine = () => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleBooking = async () => {
        if (!selectedSlot) return;
        setLoading(true);

        try {
            // API call to Cloudflare Worker to initiate Stripe Checkout & hold DB slot
            const res = await fetch('/api/bookings/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotId: selectedSlot })
            });

            if (!res.ok) throw new Error('Slot taken or error occurred.');

            const { checkoutUrl } = await res.json();
            if (checkoutUrl) window.location.href = checkoutUrl;
        } catch (err) {
            alert("This slot is no longer available. Please select another.");
            setLoading(false);
        }
    };

    return (
        <section className="w-full py-24 bg-neutral-900 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Book Your Appointment</h2>
                    <p className="text-neutral-400">Select an available time. All slots sync directly with our salon calendar. A $25 deposit is required to secure your slot.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-neutral-800 rounded-2xl p-6 shadow-xl border border-neutral-700">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-500" />
                            Available Slots
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {mockSlots.map(slot => (
                                <button
                                    key={slot.id}
                                    disabled={!slot.available}
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={`w-full flex justify-between items-center p-4 rounded-xl transition-all border ${!slot.available ? 'opacity-50 cursor-not-allowed bg-neutral-900 border-neutral-800' : selectedSlot === slot.id ? 'bg-amber-600/20 border-amber-500 text-amber-500' : 'bg-neutral-700/50 hover:bg-neutral-700 border-transparent text-white'}`}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="text-sm opacity-80 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {slot.time}</span>
                                    </div>
                                    {!slot.available ? (
                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Booked</span>
                                    ) : (
                                        <span className="text-xs font-bold uppercase tracking-wider">Select</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-neutral-800 rounded-2xl p-6 shadow-xl border border-neutral-700 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-amber-500" />
                                Deposit & Pay
                            </h3>
                            <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 mb-6">
                                <div className="flex justify-between text-neutral-300 mb-2">
                                    <span>Service Deposit</span>
                                    <span className="font-semibold text-white">$25.00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-neutral-500 border-t border-neutral-800 pt-3 mt-3">
                                    <span>Remaining balance due at salon</span>
                                </div>
                            </div>

                            <ul className="text-sm text-neutral-400 space-y-2 mb-8 list-disc pl-5">
                                <li>Deposits are non-refundable for no-shows.</li>
                                <li>Please arrive 10 minutes early.</li>
                                <li>Hair must be clean and blow-dried.</li>
                            </ul>
                        </div>

                        <button
                            disabled={!selectedSlot || loading}
                            onClick={handleBooking}
                            className="w-full relative flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Pay $25 Deposit via Stripe
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingEngine;
