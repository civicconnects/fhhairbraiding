import { useState } from 'react';

const TransformationSlider = () => {
    const [sliderPos, setSliderPos] = useState(50);

    return (
        <section className="py-24 bg-neutral-900 border-b border-neutral-800">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        The <span className="text-amber-500 italic">Transformation</span>
                    </h2>
                    <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto">
                        See the difference our certified technique makes. Slide to reveal the flawless transition from natural texture to premium bohemian braids.
                    </p>
                </div>

                {/* The Slider Container */}
                <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl group cursor-ew-resize select-none">
                    {/* After Image (Background) */}
                    <img
                        src="/images/after.png"
                        alt="After styling"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable="false"
                    />

                    {/* Before Image (Clipped overlay) */}
                    <div
                        className="absolute inset-0 w-full h-full object-cover overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                        <img
                            src="/images/before.png"
                            alt="Before styling"
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable="false"
                        />
                    </div>

                    {/* Slider Control Line */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize shine"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black border-2 border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                            <div className="flex gap-1">
                                <span className="text-amber-500 text-[10px]">&#9664;</span>
                                <span className="text-amber-500 text-[10px]">&#9654;</span>
                            </div>
                        </div>
                    </div>

                    {/* Invisible Input for Accessibility & Control */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPos}
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                        aria-label="Image comparison slider"
                    />

                    {/* Labels */}
                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-medium text-sm track-wider uppercase pointer-events-none">
                        Before
                    </div>
                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-amber-500/80 backdrop-blur-md text-black rounded-full font-bold text-sm tracking-wider uppercase pointer-events-none">
                        After
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransformationSlider;
