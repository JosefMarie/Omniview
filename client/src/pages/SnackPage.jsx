import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = [
    { icon: 'local_popcorn', label: '1. POPCORN' },
    { icon: 'local_drink', label: '2. DRINK' },
    { icon: 'lunch_dining', label: '3. SNACKS' },
];

const BUNDLE_DISCOUNT = 0.20;

const SkeletonItem = () => (
    <div style={{ height: '140px', background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', animation: 'pulse 1.5s infinite' }} />
);

export default function SnackPage() {
    const navigate = useNavigate();
    const { setCombo, clearCombo } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({ popcorn: null, flavor: null, drink: null, snack: null });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products:', error);
                toast.error('Failed to load snack menu');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const popcornOptions = products.filter(p => p.category === 'popcorn').map(p => ({
        ...p,
        label: p.name,
        size: p.id.includes('lrg') ? '170oz GIANT' : p.id.includes('med') ? '130oz LARGE' : '85oz STANDARD',
        image: p.image || (p.id.includes('lrg') ? 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=500&fit=crop' : 'https://images.unsplash.com/photo-1625695679703-7e43ebb2438e?w=400&h=500&fit=crop')
    }));

    const flavorOptions = [
        { id: 'butter', label: 'Classic Butter', extra: 0 },
        { id: 'salted', label: 'Sea Salt', extra: 0 },
        { id: 'caramel', label: 'Premium Caramel', extra: 1.50 },
    ];

    const drinkOptions = products.filter(p => p.category === 'drink').map(p => ({
        ...p,
        label: p.name,
        size: 'Large 32oz',
        image: p.image || 'https://images.unsplash.com/photo-1586195831835-99f5e65f4e37?w=400&h=500&fit=crop'
    }));

    const snackOptions = [
        ...products.filter(p => p.category === 'snack').map(p => ({
            ...p,
            label: p.name,
            image: p.image || 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=500&fit=crop'
        })),
        { id: 'skip', label: 'No Snack', price: 0, image: null }
    ];

    const setSelection = (key, value) => setSelections(prev => ({ ...prev, [key]: value }));

    const isComplete = selections.popcorn && selections.flavor !== null && selections.drink && selections.snack !== null;

    const popcornPrice = selections.popcorn ? selections.popcorn.price + (selections.flavor?.extra || 0) : 0;
    const drinkPrice = selections.drink?.price || 0;
    const snackPrice = selections.snack?.price || 0;
    const rawTotal = popcornPrice + drinkPrice + snackPrice;
    const discount = rawTotal > 0 ? rawTotal * BUNDLE_DISCOUNT : 0;
    const comboPrice = parseFloat((rawTotal - discount).toFixed(2));

    const handleConfirm = () => {
        if (!isComplete) return;
        setCombo({
            name: 'Custom Cinema Combo',
            popcorn: `${selections.popcorn.label} (${selections.flavor.label})`,
            drink: selections.drink.label,
            snack: selections.snack.label,
            price: comboPrice,
            discount,
            rawTotal,
        });
        toast.success('Gourmet combo added! 🍿');
        navigate('/checkout');
    };

    const handleSkipSnacks = () => {
        clearCombo();
        navigate('/checkout');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#120101', color: 'white' }}>
            <style>{`
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.2; } 100% { opacity: 0.5; } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .snack-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .snack-card:hover { transform: translateY(-8px); border-color: #e11d48 !important; box-shadow: 0 15px 30px rgba(225, 29, 72, 0.2); }
            `}</style>
            
            {/* Header progress bar */}
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', 
                    width: `${((step + 1) / 3) * 100}%`, background: '#e11d48',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 15px #e11d48'
                }} />
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', gap: '3rem', alignItems: 'start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem', minWidth: 0 }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '999px', padding: '0.5rem 1.25rem', marginBottom: '1.5rem' }}>
                            <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.2rem' }}>restaurant</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Concessions Experience</span>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>BUILD YOUR<br /><span style={{ color: '#e11d48' }}>GOURMET COMBO</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', fontWeight: 500 }}>Select your favorites and unlock a 20% bundle discount.</p>
                    </div>

                    {/* Step Tabs */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.5rem' }}>
                        {STEPS.map((s, i) => (
                            <button key={i} onClick={() => i <= step && setStep(i)} style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                                padding: '1.25rem', borderRadius: '1.25rem', border: 'none', cursor: i <= step ? 'pointer' : 'default',
                                background: step === i ? '#e11d48' : 'transparent',
                                color: step === i ? 'white' : 'rgba(255,255,255,0.4)',
                                fontWeight: 900, fontSize: '0.9rem', transition: 'all 0.3s', letterSpacing: '0.1em'
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                                {s.label}
                                {i < step && <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', marginLeft: 'auto', color: 'white' }}>check_circle</span>}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            <SkeletonItem /><SkeletonItem /><SkeletonItem /><SkeletonItem />
                        </div>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
                            {step === 0 && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                                        {popcornOptions.map(opt => (
                                            <div key={opt.id} onClick={() => setSelection('popcorn', opt)} className="snack-card" style={{
                                                background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', overflow: 'hidden',
                                                border: selections.popcorn?.id === opt.id ? '3px solid #e11d48' : '1px solid rgba(255,255,255,0.1)',
                                                cursor: 'pointer', position: 'relative'
                                            }}>
                                                <img src={opt.image} alt={opt.label} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                                <div style={{ padding: '1.5rem' }}>
                                                    <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: 'white' }}>{opt.label.toUpperCase()}</h3>
                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.25rem' }}>{opt.size}</p>
                                                    <p style={{ fontWeight: 950, marginTop: '1rem', fontSize: '1.2rem', color: '#e11d48' }}>${opt.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>SIGNATURE FLAVORS</h3>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {flavorOptions.map(f => (
                                            <button key={f.id} onClick={() => setSelection('flavor', f)} style={{
                                                padding: '1rem 2rem', borderRadius: '999px',
                                                border: selections.flavor?.id === f.id ? '2px solid #e11d48' : '2px solid rgba(255,255,255,0.1)',
                                                background: selections.flavor?.id === f.id ? 'white' : 'transparent',
                                                color: selections.flavor?.id === f.id ? '#000' : 'white', cursor: 'pointer', fontWeight: 900, transition: 'all 0.3s'
                                            }}>
                                                {f.label.toUpperCase()}{f.extra > 0 ? ` (+$${f.extra.toFixed(2)})` : ''}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
                                        <button className="btn-primary" style={{ padding: '0 3rem' }} onClick={() => selections.popcorn && selections.flavor && setStep(1)}>SELECT DRINKS <span className="material-symbols-outlined">arrow_forward</span></button>
                                    </div>
                                </>
                            )}

                            {step === 1 && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                        {drinkOptions.map(opt => (
                                            <div key={opt.id} onClick={() => setSelection('drink', opt)} className="snack-card" style={{
                                                display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem',
                                                border: selections.drink?.id === opt.id ? '3px solid #e11d48' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
                                            }}>
                                                <img src={opt.image} alt={opt.label} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <h3 style={{ fontWeight: 900, fontSize: '1.15rem' }}>{opt.label.toUpperCase()}</h3>
                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 800 }}>{opt.size}</p>
                                                    <p style={{ fontWeight: 950, marginTop: '0.75rem', fontSize: '1.2rem', color: '#e11d48' }}>${opt.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                                        <button onClick={() => setStep(0)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: 900, fontSize: '1rem' }}>← PREVIOUS</button>
                                        <button className="btn-primary" style={{ padding: '0 3rem' }} onClick={() => selections.drink && setStep(2)}>CHOOSE SNACKS <span className="material-symbols-outlined">arrow_forward</span></button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                        {snackOptions.map(opt => (
                                            <div key={opt.id} onClick={() => setSelection('snack', opt)} className="snack-card" style={{
                                                display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem',
                                                border: selections.snack?.id === opt.id ? '3px solid #e11d48' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                                                alignItems: 'center'
                                            }}>
                                                {opt.image ? <img src={opt.image} alt={opt.label} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '1rem' }} /> : <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.2)' }}>close</span></div>}
                                                <div>
                                                    <h3 style={{ fontWeight: 900, fontSize: '1.15rem' }}>{opt.label.toUpperCase()}</h3>
                                                    <p style={{ fontWeight: 950, color: opt.price === 0 ? 'rgba(255,255,255,0.3)' : '#e11d48', fontSize: '1.1rem', marginTop: '0.25rem' }}>{opt.price === 0 ? 'SKIPPED' : `$${opt.price.toFixed(2)}`}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                                        <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: 900, fontSize: '1rem' }}>← PREVIOUS</button>
                                        <button className="btn-primary" style={{ padding: '0 3rem' }} onClick={handleConfirm} disabled={!isComplete}>FINALIZE COMBO <span className="material-symbols-outlined">celebration</span></button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <button onClick={handleSkipSnacks} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem', fontWeight: 700, fontSize: '0.9rem' }}>Proceed to checkout without snacks</button>
                </div>

                {/* Sidebar Order Preview */}
                <aside style={{ width: '380px', flexShrink: 0, position: 'sticky', top: '100px' }}>
                    <div className="glass-card" style={{ padding: '2.5rem', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                        <h3 style={{ fontWeight: 950, fontSize: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '0.1em' }}>
                            <span className="material-symbols-outlined" style={{ color: '#e11d48' }}>shopping_bag</span> YOUR COMBO
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { label: 'POPCORN', value: selections.popcorn ? `$${popcornPrice.toFixed(2)}` : '—', sub: selections.popcorn?.label },
                                { label: 'BEVERAGE', value: selections.drink ? `$${drinkPrice.toFixed(2)}` : '—', sub: selections.drink?.label },
                                { label: 'GOURMET SNACK', value: selections.snack ? (selections.snack.price === 0 ? 'SKIPPED' : `$${snackPrice.toFixed(2)}`) : '—', sub: selections.snack?.label },
                            ].map(item => (
                                <div key={item.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                                        <span style={{ color: '#000' }}>{item.label}</span>
                                        <span style={{ color: '#000' }}>{item.value}</span>
                                    </div>
                                    {item.sub && <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>{item.sub.toUpperCase()}</p>}
                                </div>
                            ))}
                            
                            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0.5rem 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 950, fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>
                                <span style={{ color: '#000' }}>TOTAL</span>
                                <span style={{ color: '#e11d48' }}>${comboPrice.toFixed(2)}</span>
                            </div>
                            
                            <div style={{ background: '#1e0202', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
                                <p style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: 900, letterSpacing: '0.05em' }}>BUNDLE SAVINGS ACTIVATED</p>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', fontWeight: 600 }}>20% OFF ALL SELECTIONS</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
