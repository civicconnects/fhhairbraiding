import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, ChevronRight, Mail } from 'lucide-react';

// Hardcoded for MVP availability slots. Real-world would calculate against service durations.
const DAILY_SLOTS = ["09:00 AM", "01:00 PM"];

export default function CalendarPicker() {
    const [step, setStep] = useState(1);

    const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([]);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const [availableDates, setAvailableDates] = useState<{ date: string, slots: string[] }[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedDateStamp, setSelectedDateStamp] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', service: 'Knotless Braids' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const fetchAvailability = async () => {
        try {
            // Fetch all booked slots for the next 14 days from D1
            const resp = await fetch('/api/availability', { cache: 'no-store' });
            if (resp.ok) {
                const data = await resp.json();
                setBookedSlots(data.booked || []);
            }
        } catch (e) {
            // Silently fallback — all slots appear available
        } finally {
            // Build the next 14 days regardless
            const targetDates: { date: string, slots: string[] }[] = [];
            for (let i = 1; i <= 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                if (d.getDay() !== 0) { // Skip Sundays
                    targetDates.push({ date: d.toISOString(), slots: DAILY_SLOTS });
                }
            }
            setAvailableDates(targetDates);
            setLoading(false);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setBookingError('');

        try {
            const baseDate = new Date(selectedDateStamp);
            const isAfternoon = selectedSlot.includes("PM") && !selectedSlot.startsWith("12");
            const hours = parseInt(selectedSlot.split(":")[0]) + (isAfternoon ? 12 : 0);
            baseDate.setHours(hours, 0, 0, 0);

            const payload = {
                clientName: formData.name,
                clientPhone: formData.phone,
                clientEmail: formData.email,
                serviceName: formData.service,
                startTime: baseDate.toISOString(),
                durationHours: 4
            };

            const resp = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resp.ok) {
                setSuccess(true);
                fetchAvailability(); // refresh booked slots
            } else if (resp.status === 409) {
                const err = await resp.json();
                setBookingError(err.error || 'This slot is already taken.');
            } else {
                setBookingError('Something went wrong. Please try again.');
            }
        } catch (e) {
            setBookingError('Could not connect. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-black/40 border border-amber-500/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
                <CheckCircle2 className="w-16 h-16 text-amber-500 mb-6 relative z-10" />
                <h3 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">Consultation Booked</h3>
                <p className="text-neutral-400 relative z-10">
                    A calendar invite has been dispatched. Monica will review your requested time slot and confirm shortly.
                </p>
                <button onClick={() => { setSuccess(false); setStep(1); }} className="mt-8 text-amber-500 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                    Book Another
                </button>
            </div>
        );
    }

    return (
        <div className="bg-black/40 border border-neutral-800 p-6 md:p-8 rounded-2xl flex flex-col h-full relative z-10">
            {/* Header Steps */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-800">
                <h4 className="text-white font-bold font-serif text-xl flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-amber-500" />
                    Book an Opening
                </h4>
                <div className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-amber-500' : 'bg-neutral-800'}`} />
                    <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-amber-500' : 'bg-neutral-800'}`} />
                </div>
            </div>

            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <div className="flex-grow">
                    {/* Step 1: Date & Time Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-bold text-neutral-400 block mb-3 uppercase tracking-wider">1. Select a Date</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {availableDates.slice(0, 6).map((item, idx) => {
                                        const d = new Date(item.date);
                                        const isSelected = selectedDateStamp === item.date;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => { setSelectedDateStamp(item.date); setSelectedSlot(''); }}
                                                className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600 hover:text-white'}`}
                                            >
                                                <div className="text-xs uppercase font-bold mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                                <div className="text-lg font-serif">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedDateStamp && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="text-sm font-bold text-neutral-400 block mb-3 uppercase tracking-wider">2. Select a Time</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {DAILY_SLOTS.map((slot, idx) => {
                                            const dateStr = new Date(selectedDateStamp).toISOString().split('T')[0];
                                            const isTaken = bookedSlots.some(
                                                (b: any) => b.date === dateStr && b.time === slot
                                            );
                                            const isSelected = selectedSlot === slot;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => !isTaken && setSelectedSlot(slot)}
                                                    disabled={isTaken}
                                                    className={`p-3 flex items-center justify-center gap-2 rounded-xl border font-mono transition-all ${isTaken
                                                            ? 'border-neutral-800 bg-neutral-900/30 text-neutral-600 cursor-not-allowed line-through'
                                                            : isSelected
                                                                ? 'border-amber-500 bg-amber-500 text-black font-bold'
                                                                : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600 hover:text-white'
                                                        }`}
                                                >
                                                    <Clock className="w-4 h-4" />
                                                    {slot}
                                                    {isTaken && <span className="text-xs ml-1 text-red-500">Taken</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <button
                                disabled={!selectedDateStamp || !selectedSlot}
                                onClick={() => setStep(2)}
                                className="w-full mt-6 flex items-center justify-center gap-2 bg-white disabled:bg-neutral-800 disabled:text-neutral-500 hover:bg-amber-500 hover:text-white text-black font-bold py-4 rounded-xl transition-all"
                            >
                                Continue to Details
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Details & Dispatch */}
                    {step === 2 && (
                        <form onSubmit={handleBook} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">

                            <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-6 text-amber-500 text-sm font-bold">
                                <div>{new Date(selectedDateStamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                                <div className="font-mono">{selectedSlot}</div>
                            </div>

                            <div>
                                <select aria-label="Select Service" title="Select Service" required value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none appearance-none">
                                    <option>Knotless Braids</option>
                                    <option>Bohemian Braids</option>
                                    <option>Box Braids</option>
                                    <option>Cornrows / Feed-ins</option>
                                    <option>Ponytails & Updos</option>
                                </select>
                            </div>

                            <div className="relative">
                                <User className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 pl-12 text-white focus:border-amber-500 outline-none placeholder:text-neutral-600" />
                            </div>

                            <div className="relative">
                                <Phone className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 pl-12 text-white focus:border-amber-500 outline-none placeholder:text-neutral-600" />
                            </div>

                            <div className="relative mb-6">
                                <Mail className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input type="email" placeholder="Email (Optional via Calendar Invite)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 pl-12 text-white focus:border-amber-500 outline-none placeholder:text-neutral-600" />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-neutral-800">
                                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white font-bold transition-all">
                                    Back
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-grow flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black disabled:bg-amber-500/50 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                    {isSubmitting ? 'Sending...' : 'Request Slot'}
                                </button>
                            </div>
                            {bookingError && (
                                <p className="mt-3 text-center text-red-400 text-sm font-bold">{bookingError}</p>
                            )}
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
