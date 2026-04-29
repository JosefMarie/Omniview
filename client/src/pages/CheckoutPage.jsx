import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, fetchUserRewards, redeemPoints } from '../services/api';
import toast from 'react-hot-toast';

const ProgressBar = ({ step }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3rem' }}>
        {['Seats', 'Snacks', 'Payment'].map((label, i) => (
            <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: i < step ? '#22c55e' : i === step ? '#e11d48' : 'rgba(255,255,255,0.08)',
                        border: i === step ? '4px solid rgba(225, 29, 72, 0.2)' : 'none',
                        color: 'white', fontWeight: 900, fontSize: '0.9rem', transition: 'all 0.3s',
                        boxShadow: i === step ? '0 0 20px rgba(225, 29, 72, 0.4)' : 'none'
                    }}>
                        {i < step ? <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>check</span> : i + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: i === step ? 'white' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '3px', background: i < step ? '#22c55e' : 'rgba(255,255,255,0.1)', margin: '0 0.75rem', marginBottom: '1.5rem', borderRadius: '2px' }} />}
            </React.Fragment>
        ))}
    </div>
);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { 
        selectedSeats, selectedCombo, seatTotal, comboTotal, snacksTotal, 
        grandTotal, bookingFee, taxes, clearCart, screening 
    } = useCart();

    const [activePayment, setActivePayment] = useState('card');
    const [loading, setLoading] = useState(false);
    const [showCvv, setShowCvv] = useState(false);
    const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
    const [rewards, setRewards] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(0);

    useEffect(() => {
        if (user) {
            fetchUserRewards(user.uid)
                .then(setRewards)
                .catch(err => console.error('Rewards fetch failed:', err));
        }
    }, [user]);

    const handleRedeemToggle = async () => {
        if (discountApplied > 0) {
            setDiscountApplied(0);
            return;
        }
        if (!rewards || rewards.points < 500) {
            toast.error('You need at least 500 points to redeem a discount.');
            return;
        }
        
        if (window.confirm('Redeem 500 points for an instant $5 discount?')) {
            try {
                setLoading(true);
                const res = await redeemPoints(user.uid);
                if (res.success) {
                    setDiscountApplied(5);
                    setRewards(prev => ({ ...prev, points: prev.points - 500 }));
                    toast.success('Points redeemed! $5 discount applied.');
                }
            } catch (err) {
                toast.error(err.message || 'Redemption failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const finalTotal = grandTotal - discountApplied;

    const formatCardNumber = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (val) => {
        const d = val.replace(/\D/g, '').slice(0, 4);
        return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (selectedSeats.length === 0) { toast.error('No seats selected!'); return; }
        setLoading(true);

        try {
            const orderData = {
                userId:      user?.uid   || 'guest',
                userEmail:   user?.email || null,
                userName:    user?.displayName || form.name || 'Movie Lover',
                screeningId: screening?.id     || 'unknown',
                movie:       screening?.movie  || '',
                hall:        screening?.hall   || '',
                date:        screening?.date   || '',
                time:        screening?.time   || '',
                format:      screening?.format || '2D',
                poster:      screening?.poster || '',
                seats:       selectedSeats.map(s => s.label),
                snackItems:  selectedCombo,
                totalPaid:   finalTotal,
            };

            const response = await createOrder(orderData);

            if (response.success) {
                sessionStorage.setItem('lastOrder', JSON.stringify({
                    orderId:      response.orderId,
                    movie:        screening?.movie   || 'Movie Title',
                    poster:       screening?.poster,
                    time:         `${screening?.date || ''} · ${screening?.time || ''}`,
                    hall:         screening?.hall    || 'Cinema Hall',
                    format:       screening?.format  || '2D',
                    seats:        selectedSeats.map(s => s.label),
                    combo:        selectedCombo,
                    total:        finalTotal,
                    emailSent:    response.emailSent,
                    emailPreview: response.emailPreview || null,
                    pointsEarned: response.pointsEarned,
                }));
                clearCart();
                toast.success('Booking confirmed! Check your email for your ticket.');
                navigate('/booking-confirmed');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>

                {/* LEFT — Payment Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <ProgressBar step={2} />

                    <div style={{ marginBottom: '1rem' }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', color: 'white', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>SECURE CHECKOUT</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', fontWeight: 500 }}>Confirm your order and complete the transaction.</p>
                    </div>

                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        {/* Payment Method Tabs */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {[
                                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
                                { id: 'wallet', label: 'Digital Wallets', icon: 'account_balance_wallet' },
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActivePayment(tab.id)} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem',
                                    borderRadius: '1rem', cursor: 'pointer',
                                    background: activePayment === tab.id ? 'rgba(225, 29, 72, 0.1)' : 'white',
                                    border: activePayment === tab.id ? '2px solid #e11d48' : '1px solid rgba(0,0,0,0.1)',
                                    color: activePayment === tab.id ? '#e11d48' : '#6b7280',
                                    fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activePayment === 'card' ? (
                            <form onSubmit={handlePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Cardholder Name</label>
                                    <input type="text" className="form-input" placeholder="FULL NAME AS ON CARD" required
                                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Card Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="text" className="form-input" placeholder="0000 0000 0000 0000" required
                                            value={form.number} onChange={e => setForm(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                                            style={{ paddingRight: '3.5rem' }}
                                        />
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.5rem' }}>credit_card</span>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Expiry Date</label>
                                        <input type="text" className="form-input" placeholder="MM / YY" required
                                            value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>CVV / CVC</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type={showCvv ? 'text' : 'password'} className="form-input" placeholder="000" required
                                                maxLength={4} value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                                                style={{ paddingRight: '3rem' }}
                                            />
                                            <button type="button" onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{showCvv ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" disabled={loading} style={{ height: '64px', fontSize: '1.25rem', borderRadius: '1.25rem', marginTop: '1rem' }}>
                                    {loading ? (
                                        <><span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} /> PROCESSING...</>
                                    ) : (
                                        <><span className="material-symbols-outlined">verified_user</span> AUTHORIZE ${finalTotal.toFixed(2)}</>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem', opacity: 0.2 }}>account_balance_wallet</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1f2937', marginBottom: '0.5rem' }}>DIGITAL WALLETS</h3>
                                <p style={{ fontWeight: 500 }}>Apple Pay, Google Pay, and PayPal coming in next release.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT — Order Summary */}
                <div style={{ position: 'sticky', top: '96px' }}>
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
                        <div style={{ padding: '1.5rem 2rem', background: 'rgba(225, 29, 72, 0.05)', borderBottom: '1px solid rgba(225, 29, 72, 0.1)' }}>
                            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#000', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>ORDER SUMMARY</h3>
                        </div>
                        
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Movie */}
                            <div style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                {screening?.poster && (
                                    <img src={screening.poster} style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', flexShrink: 0 }} alt="poster" />
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#000', marginBottom: '0.25rem', lineHeight: 1.2 }}>{screening?.movie}</h4>
                                    <p style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600 }}>{screening?.hall} · {screening?.format}</p>
                                    <p style={{ color: '#e11d48', fontSize: '0.85rem', fontWeight: 800 }}>{screening?.date} @ {screening?.time}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>SEATS ({selectedSeats.length})</p>
                                    {selectedSeats.map(s => (
                                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>
                                            <span>{s.label}</span><span>${s.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {selectedCombo && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>CONCESSIONS</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                                            <span>Custom Combo Bundle</span>
                                            <span>${selectedCombo.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '1.5rem', borderTop: '2px solid rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#6b7280', fontWeight: 500 }}>
                                    <span>Subtotal</span><span style={{ color: '#000', fontWeight: 700 }}>${(seatTotal + comboTotal + snacksTotal).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#6b7280', fontWeight: 500 }}>
                                    <span>Booking Fee</span><span style={{ color: '#000', fontWeight: 700 }}>${bookingFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#6b7280', fontWeight: 500 }}>
                                    <span>Tax (10%)</span><span style={{ color: '#000', fontWeight: 700 }}>${taxes.toFixed(2)}</span>
                                </div>
                                {discountApplied > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#059669', fontWeight: 800 }}>
                                        <span>OmniRewards Credit</span><span>-$5.00</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: 900, paddingTop: '1rem', color: '#000', fontFamily: 'var(--font-display)', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                    <span>TOTAL</span>
                                    <span style={{ color: '#e11d48' }}>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Rewards Widget */}
                            {user && rewards && (
                                <div style={{ marginTop: '0.5rem', padding: '1.25rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.5rem' }}>stars</span>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#92400e', textTransform: 'uppercase' }}>LOYALTY BALANCE</p>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000' }}>{rewards.points} OMNIPOINTS</p>
                                        </div>
                                    </div>
                                    {rewards.points >= 500 || discountApplied > 0 ? (
                                        <button onClick={handleRedeemToggle} disabled={loading} style={{
                                            width: '100%', height: '44px', background: discountApplied > 0 ? '#059669' : '#f59e0b',
                                            color: 'white', border: 'none', borderRadius: '0.75rem',
                                            fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s'
                                        }}>
                                            {discountApplied > 0 ? '✓ REWARD ACTIVATED' : 'REDEEM 500 PTS (-$5.00)'}
                                        </button>
                                    ) : (
                                        <div style={{ background: 'rgba(0,0,0,0.05)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                            <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', fontWeight: 600 }}>Earn 500 pts for a $5 discount!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
