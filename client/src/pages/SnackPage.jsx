import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Snack catalog data
const POPCORN_OPTIONS = [
    { id: 'lrg', label: 'Large Bucket', size: '170oz', price: 12.50, tag: 'POPULAR', image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=500&fit=crop' },
    { id: 'med', label: 'Medium Tub', size: '130oz', price: 9.50, tag: null, image: 'https://images.unsplash.com/photo-1625695679703-7e43ebb2438e?w=400&h=500&fit=crop' },
    { id: 'sml', label: 'Small Bag', size: '85oz', price: 7.00, tag: null, image: 'https://images.unsplash.com/photo-1615655114865-4cc582fab63f?w=400&h=500&fit=crop' },
];
const POPCORN_FLAVORS = [
    { id: 'butter', label: 'Butter', extra: 0 },
    { id: 'salted', label: 'Salted', extra: 0 },
    { id: 'sweet-salted', label: 'Sweet & Salted', extra: 0 },
    { id: 'caramel', label: 'Caramel', extra: 1.50 },
];

const DRINK_OPTIONS = [
    { id: 'coke', label: 'Coca-Cola', size: 'Large 32oz', price: 6.00, image: 'https://images.unsplash.com/photo-1586195831835-99f5e65f4e37?w=400&h=500&fit=crop' },
    { id: 'sprite', label: 'Sprite', size: 'Large 32oz', price: 6.00, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=500&fit=crop' },
    { id: 'water', label: 'Still Water', size: '500ml', price: 3.50, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=500&fit=crop' },
    { id: 'juice', label: 'Orange Juice', size: 'Medium 16oz', price: 5.00, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=500&fit=crop' },
];

const SNACK_OPTIONS = [
    { id: 'nachos', label: 'Nachos & Salsa', price: 8.50, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=500&fit=crop' },
    { id: 'hotdog', label: 'Cinema Hot Dog', price: 7.50, image: 'https://images.unsplash.com/photo-1619740455993-9d622bf07c86?w=400&h=500&fit=crop' },
    { id: 'candy', label: 'Assorted Candy', price: 5.00, image: 'https://images.unsplash.com/photo-1553247407-23251ce81b7a?w=400&h=500&fit=crop' },
    { id: 'skip', label: 'No Snack', price: 0, image: null },
];

const STEPS = [
    { icon: 'local_popcorn', label: '1. Popcorn' },
    { icon: 'local_drink', label: '2. Drink' },
    { icon: 'lunch_dining', label: '3. Snacks' },
];

const BUNDLE_DISCOUNT = 0.20;

export default function SnackPage() {
    const navigate = useNavigate();
    const { setCombo, clearCombo, seatTotal } = useCart();

    const [step, setStep] = useState(0); // 0, 1, 2
    const [selections, setSelections] = useState({ popcorn: null, flavor: null, drink: null, snack: null });

    const setSelection = (key, value) => setSelections(prev => ({ ...prev, [key]: value }));

    const isComplete = selections.popcorn && selections.flavor !== null && selections.drink && selections.snack !== undefined;

    // Calculate prices
    const popcornPrice = selections.popcorn ? selections.popcorn.price + (selections.flavor?.extra || 0) : 0;
    const drinkPrice = selections.drink?.price || 0;
    const snackPrice = selections.snack?.price || 0;
    const rawTotal = popcornPrice + drinkPrice + snackPrice;
    const discount = rawTotal > 0 ? rawTotal * BUNDLE_DISCOUNT : 0;
    const comboPrice = parseFloat((rawTotal - discount).toFixed(2));

    const handleConfirm = () => {
        if (!isComplete) return;
        setCombo({
            name: 'Custom Combo',
            popcorn: `${selections.popcorn.label} (${selections.flavor.label})`,
            drink: selections.drink.label,
            snack: selections.snack.label,
            price: comboPrice,
            discount,
            rawTotal,
        });
        toast.success('Combo added to cart! 🍿');
        navigate('/checkout');
    };

    const handleSkipSnacks = () => {
        clearCombo();
        navigate('/checkout');
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Amber top accent bar */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #f2a60d, #ff8c00, #f2a60d)', backgroundSize: '200% 100%', animation: 'float 3s ease-in-out infinite' }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT: Selection Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

                    {/* Heading */}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Build Your Own Combo</h1>
                        <p style={{ color: '#bab09c', fontSize: '1rem' }}>Customize your cinema snack experience and save up to 20%.</p>
                    </div>

                    {/* Step Tabs */}
                    <div style={{ background: '#2d281f', borderRadius: '0.875rem', padding: '0.3rem', border: '1px solid #393328', display: 'flex', gap: '0.25rem' }}>
                        {STEPS.map((s, i) => (
                            <button key={i} onClick={() => i <= step && setStep(i)} style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                padding: '0.75rem', borderRadius: '0.625rem', border: 'none', cursor: i <= step ? 'pointer' : 'default',
                                background: step === i ? '#f2a60d' : 'transparent',
                                color: step === i ? '#1a1200' : '#bab09c',
                                fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'Be Vietnam Pro, sans-serif',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                                {s.label}
                                {i < step && <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color: step === i ? '#1a1200' : '#f2a60d' }}>check_circle</span>}
                            </button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {step === 0 ? 'Select Popcorn Size' : step === 1 ? 'Select Your Drink' : 'Select an Extra Snack'}
                            </span>
                            <span style={{ color: '#f2a60d', fontWeight: 700, fontSize: '0.85rem' }}>Step {step + 1} of 3</span>
                        </div>
                        <div style={{ height: '6px', background: '#544c3b', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: '#f2a60d', borderRadius: '999px', width: `${((step + 1) / 3) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                        <p style={{ color: '#bab09c', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                            {step === 0 ? 'Coming up: Choose your beverage' : step === 1 ? 'Almost there! Pick an extra snack' : 'Final step!'}
                        </p>
                    </div>

                    {/* STEP 0: Popcorn */}
                    {step === 0 && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                {POPCORN_OPTIONS.map(opt => (
                                    <div key={opt.id}
                                        onClick={() => setSelection('popcorn', opt)}
                                        style={{
                                            position: 'relative', background: '#2d281f', borderRadius: '0.875rem', overflow: 'hidden',
                                            border: selections.popcorn?.id === opt.id ? '2px solid #f2a60d' : '1px solid #393328',
                                            cursor: 'pointer', transition: 'all 0.25s',
                                            transform: selections.popcorn?.id === opt.id ? 'translateY(-4px)' : 'none',
                                        }}
                                    >
                                        <div style={{ paddingTop: '130%', position: 'relative', overflow: 'hidden' }}>
                                            <img src={opt.image} alt={opt.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: selections.popcorn?.id === opt.id ? 'scale(1.05)' : 'scale(1)' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #2d281f 20%, transparent 70%)' }} />
                                        </div>
                                        <div style={{ padding: '0.875rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{opt.label}</h3>
                                                {opt.tag && <span style={{ background: 'rgba(242,166,13,0.2)', color: '#f2a60d', borderRadius: '0.3rem', padding: '0.1rem 0.4rem', fontSize: '0.6rem', fontWeight: 700 }}>{opt.tag}</span>}
                                            </div>
                                            <p style={{ color: '#bab09c', fontSize: '0.75rem', marginBottom: '0.4rem' }}>Best for sharing ({opt.size})</p>
                                            <p style={{ fontWeight: 800, fontSize: '1rem' }}>${opt.price.toFixed(2)}</p>
                                        </div>
                                        {selections.popcorn?.id === opt.id && (
                                            <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', background: '#f2a60d', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#1a1200', fontVariationSettings: "'FILL' 1" }}>check</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Flavor Row */}
                            <div style={{ borderTop: '1px solid #393328', paddingTop: '1.5rem' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.875rem' }}>Select Flavor</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {POPCORN_FLAVORS.map(f => (
                                        <button key={f.id} onClick={() => setSelection('flavor', f)} style={{
                                            padding: '0.5rem 1.25rem', borderRadius: '999px', border: selections.flavor?.id === f.id ? '2px solid #f2a60d' : '1px solid #393328',
                                            background: selections.flavor?.id === f.id ? 'rgba(242,166,13,0.1)' : 'transparent',
                                            color: selections.flavor?.id === f.id ? '#f2a60d' : 'white', fontWeight: 700, cursor: 'pointer',
                                            fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'Be Vietnam Pro, sans-serif',
                                        }}>
                                            {f.label}{f.extra > 0 ? ` (+$${f.extra.toFixed(2)})` : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #393328' }}>
                                <button className="btn-amber" onClick={() => { if (!selections.popcorn || !selections.flavor) { toast.error('Please select a size and flavor'); return; } setStep(1); }}>
                                    Next Step: Drinks →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: Drinks */}
                    {step === 1 && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                {DRINK_OPTIONS.map(opt => (
                                    <div key={opt.id}
                                        onClick={() => setSelection('drink', opt)}
                                        style={{
                                            display: 'flex', gap: '1rem', alignItems: 'center',
                                            background: '#2d281f', borderRadius: '0.875rem', padding: '1rem', overflow: 'hidden',
                                            border: selections.drink?.id === opt.id ? '2px solid #f2a60d' : '1px solid #393328',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                    >
                                        <img src={opt.image} alt={opt.label} style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />
                                        <div>
                                            <h3 style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{opt.label}</h3>
                                            <p style={{ color: '#bab09c', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{opt.size}</p>
                                            <p style={{ fontWeight: 800 }}>${opt.price.toFixed(2)}</p>
                                        </div>
                                        {selections.drink?.id === opt.id && <span className="material-symbols-outlined" style={{ color: '#f2a60d', marginLeft: 'auto' }}>check_circle</span>}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid #393328' }}>
                                <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: '#bab09c', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                    <span className="material-symbols-outlined">arrow_back</span> Back
                                </button>
                                <button className="btn-amber" onClick={() => { if (!selections.drink) { toast.error('Please select a drink'); return; } setStep(2); }}>
                                    Next Step: Snacks →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Extra Snacks */}
                    {step === 2 && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                {SNACK_OPTIONS.map(opt => (
                                    <div key={opt.id}
                                        onClick={() => setSelection('snack', opt)}
                                        style={{
                                            display: 'flex', gap: '1rem', alignItems: 'center',
                                            background: '#2d281f', borderRadius: '0.875rem', padding: '1rem',
                                            border: selections.snack?.id === opt.id ? '2px solid #f2a60d' : '1px solid #393328',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                    >
                                        {opt.image ? <img src={opt.image} alt={opt.label} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} /> : <div style={{ width: '64px', height: '64px', background: '#393328', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ color: '#bab09c' }}>do_not_disturb</span></div>}
                                        <div>
                                            <h3 style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{opt.label}</h3>
                                            <p style={{ fontWeight: 700, color: opt.price === 0 ? '#bab09c' : '#f2a60d' }}>{opt.price === 0 ? 'Skip' : `$${opt.price.toFixed(2)}`}</p>
                                        </div>
                                        {selections.snack?.id === opt.id && <span className="material-symbols-outlined" style={{ color: '#f2a60d', marginLeft: 'auto' }}>check_circle</span>}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid #393328' }}>
                                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#bab09c', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                    <span className="material-symbols-outlined">arrow_back</span> Back
                                </button>
                                <button className="btn-amber" onClick={handleConfirm} disabled={!isComplete} style={{ opacity: isComplete ? 1 : 0.5, cursor: isComplete ? 'pointer' : 'not-allowed' }}>
                                    <span className="material-symbols-outlined">check</span> Confirm Combo &amp; Checkout
                                </button>
                            </div>
                        </div>
                    )}

                    <button onClick={handleSkipSnacks} style={{
                        background: 'none', border: 'none', color: '#bab09c', cursor: 'pointer', fontSize: '0.85rem',
                        textDecoration: 'underline', textAlign: 'center', padding: '0.5rem',
                    }}>
                        Skip — proceed to checkout without snacks
                    </button>
                </div>

                {/* RIGHT: Combo Preview Sidebar */}
                <aside style={{ width: '340px', flexShrink: 0, position: 'sticky', top: '90px' }}>
                    <div style={{ background: '#2d281f', borderRadius: '1.25rem', border: '1px solid #393328', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(57,51,40,0.3)', borderBottom: '1px solid #393328', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ color: '#f2a60d' }}>auto_awesome</span>
                            <h3 style={{ fontWeight: 800, fontSize: '1.05rem' }}>Your Combo Preview</h3>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Visual preview */}
                            <div style={{
                                background: 'rgba(0,0,0,0.3)', borderRadius: '0.875rem', aspectRatio: '1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '1rem',
                            }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(242,166,13,0.05), transparent 70%)' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                    {/* Popcorn */}
                                    {selections.popcorn ? (
                                        <img src={selections.popcorn.image} alt="Popcorn" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} />
                                    ) : (
                                        <div style={{ width: '100px', height: '100px', border: '2px dashed #544c3b', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#544c3b' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>local_popcorn</span>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 900, textAlign: 'center' }}>Choose Popcorn</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {/* Drink */}
                                        {selections.drink ? (
                                            <img src={selections.drink.image} alt="Drink" style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '0.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
                                        ) : (
                                            <div style={{ width: '56px', height: '72px', border: '2px dashed #544c3b', borderRadius: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#544c3b', fontSize: '0.55rem', fontWeight: 900, textAlign: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>local_drink</span>Drink
                                            </div>
                                        )}
                                        {/* Snack */}
                                        {selections.snack && selections.snack.image ? (
                                            <img src={selections.snack.image} alt="Snack" style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '0.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
                                        ) : (
                                            <div style={{ width: '56px', height: '72px', border: '2px dashed #544c3b', borderRadius: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#544c3b', fontSize: '0.55rem', fontWeight: 900, textAlign: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>lunch_dining</span>Snack
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    { label: selections.popcorn ? `${selections.popcorn.label} (${selections.flavor?.label || '—'})` : 'Popcorn', value: popcornPrice > 0 ? `$${popcornPrice.toFixed(2)}` : '—', muted: !selections.popcorn },
                                    { label: 'Drink', value: drinkPrice > 0 ? `$${drinkPrice.toFixed(2)}` : '—', muted: !selections.drink },
                                    { label: 'Extra Snack', value: snackPrice > 0 ? `$${snackPrice.toFixed(2)}` : selections.snack?.label === 'No Snack' ? 'Skipped' : '—', muted: !selections.snack },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#bab09c' }}>{r.label}</span>
                                        <span style={{ color: r.muted ? '#f2a60d' : 'white', opacity: r.muted ? 0.5 : 1 }}>{r.value}</span>
                                    </div>
                                ))}
                                {rawTotal > 0 && (
                                    <>
                                        <div style={{ height: '1px', background: '#393328', margin: '0.25rem 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: '#f2a60d', fontWeight: 700 }}>Bundle Savings (20%)</span>
                                            <span style={{ color: '#f2a60d', fontWeight: 700 }}>-${discount.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Total */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#bab09c', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Estimated Total</span>
                                    <span style={{ fontSize: '2.25rem', fontWeight: 900 }}>
                                        {rawTotal > 0 ? `$${comboPrice.toFixed(2)}` : '$—'}
                                    </span>
                                </div>
                                {rawTotal > 0 && (
                                    <div style={{ background: '#f2a60d', color: '#1a1200', borderRadius: '0.4rem', padding: '0.25rem 0.6rem', fontSize: '0.65rem', fontWeight: 900 }}>
                                        COMBO PRICE
                                    </div>
                                )}
                            </div>

                            {/* Confirm button */}
                            <div>
                                <button className="btn-amber" style={{ width: '100%', height: '52px', fontSize: '0.95rem', opacity: isComplete ? 1 : 0.45, cursor: isComplete ? 'pointer' : 'not-allowed' }}
                                    onClick={handleConfirm} disabled={!isComplete}>
                                    {isComplete ? 'Confirm Combo' : (
                                        <><span className="material-symbols-outlined">lock</span> Complete All Steps</>
                                    )}
                                </button>
                                {!isComplete && <p style={{ fontSize: '0.65rem', textAlign: 'center', color: '#bab09c', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Complete all steps to unlock combo price</p>}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
