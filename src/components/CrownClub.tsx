import { Crown, Star } from 'lucide-react';

const CrownClub = () => {
    // Mock data for logged in user state.
    // In reality, this data is fetched from D1 and calculated from Stripe metadata.
    const pastBookingsCount = 3;
    const isEligibleForDiscount = pastBookingsCount >= 4;

    return (
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-2xl border border-amber-900/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-500">
                    <Crown className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Crown Club Loyalty</h3>
                    <p className="text-sm text-amber-400">Your VIP Status</p>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-neutral-300 font-medium mb-2">Bookings Completed: <span className="text-white font-bold">{pastBookingsCount}</span></p>

                {/* Progress Bar towards 5th booking */}
                <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden flex">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`h-full flex-1 border-r border-neutral-900 last:border-0 ${step <= pastBookingsCount ? 'bg-amber-500' : 'bg-transparent'}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-neutral-500 font-semibold mt-2 uppercase tracking-wide">
                    <span>Start</span>
                    <span>5th Booking (20% Off)</span>
                </div>
            </div>

            {isEligibleForDiscount ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                    <Star className="w-4 h-4 fill-green-400" />
                    You have unlocked a 20% discount on your next booking!
                </div>
            ) : (
                <p className="text-neutral-400 text-sm">
                    You are just {5 - (pastBookingsCount % 5)} appointments away from your next 20% loyalty discount!
                </p>
            )}
        </div>
    );
};

export default CrownClub;
