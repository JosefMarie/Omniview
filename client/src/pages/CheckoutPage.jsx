import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProgressBar = ({ step }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2.5rem' }}>
        {['Seats', 'Snacks', 'Payment'].map((label, i) => (
            <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: i < step ? '#22c55e' : i === step ? '#3211d4' : 'rgba(255,255,255,0.08)',
                        border: i === step ? '2px solid rgba(50,17,212,0.5)' : 'none',
                        fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.3s',
                    }}>
                        {i < step ? <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>check</span> : i + 1}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: i === step ? 'white' : '#a19db9' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '2px', background: i < step ? '#22c55e' : 'rgba(255,255,255,0.1)', margin: '0 0.5rem', marginBottom: '1.2rem', transition: 'background 0.3s' }} />}
            </React.Fragment>
        ))}
    </div>
);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedSeats, selectedCombo, selectedSnacks, seatTotal, comboTotal, snacksTotal, bookingFee, taxes, grandTotal, clearCart, screening } = useCart();

    const [activePayment, setActivePayment] = useState('card');
    const [loading, setLoading] = useState(false);
    const [showCvv, setShowCvv] = useState(false);
    const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });

    const formatCardNumber = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (val) => {
        const d = val.replace(/\D/g, '').slice(0, 4);
        return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (selectedSeats.length === 0) { toast.error('No seats selected!'); return; }
        setLoading(true);
        // Simulate payment processing
        await new Promise(r => setTimeout(r, 2200));
        const orderId = `OMV-${Date.now().toString(36).toUpperCase()}`;
        // Save order data for the confirmation page
        sessionStorage.setItem('lastOrder', JSON.stringify({
            orderId,
            movie: screening?.movie || 'The Dark Knight Returns',
            poster: screening?.poster,
            time: `${screening?.date || 'Today'} · ${screening?.time || '8:30 PM'}`,
            hall: screening?.hall || 'Hall IMAX-1',
            seats: selectedSeats.map(s => s.label),
            combo: selectedCombo,
            total: grandTotal,
        }));
        clearCart();
        setLoading(false);
        navigate('/booking-confirmed');
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>

                {/* LEFT — Payment Form */}
                <div>
                    <ProgressBar step={2} />

                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Secure Checkout</h1>
                    <p style={{ color: '#a19db9', marginBottom: '2rem' }}>Complete your booking by providing payment details below.</p>

                    {/* Payment Method Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
                        {[
                            { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card' },
                            { id: 'wallet', label: 'Digital Wallets', icon: 'account_balance_wallet' },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActivePayment(tab.id)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem',
                                borderRadius: '0.75rem', cursor: 'pointer',
                                background: activePayment === tab.id ? '#3211d4' : 'rgba(255,255,255,0.04)',
                                border: activePayment === tab.id ? '1px solid #3211d4' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Be Vietnam Pro, sans-serif',
                                transition: 'all 0.2s',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activePayment === 'card' ? (
                        <form onSubmit={handlePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Cardholder Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Cardholder Name</label>
                                <input type="text" className="form-input" placeholder="John M. Doe" required
                                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </div>

                            {/* Card Number */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Card Number</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" className="form-input" placeholder="1234 5678 9012 3456" required
                                        value={form.number} onChange={e => setForm(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a19db9', fontSize: '1.2rem' }}>credit_card</span>
                                </div>
                            </div>

                            {/* Expiry + CVV */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Expiry Date</label>
                                    <input type="text" className="form-input" placeholder="MM / YY" required
                                        value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>CVV / CVC</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showCvv ? 'text' : 'password'} className="form-input" placeholder="•••" required
                                            maxLength={4} value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                                            style={{ paddingRight: '2.5rem' }}
                                        />
                                        <button type="button" onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a19db9', cursor: 'pointer' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>{showCvv ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                {[
                                    { icon: 'lock', label: 'SSL Secured' },
                                    { icon: 'verified_user', label: 'PCI Compliant' },
                                    { icon: 'fingerprint', label: '3D Authenticated' },
                                ].map(b => (
                                    <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '1rem' }}>{b.icon}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#a19db9', fontWeight: 600 }}>{b.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '56px', fontSize: '1.05rem', boxShadow: '0 12px 32px rgba(50,17,212,0.3)' }}>
                                {loading ? (
                                    <><span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> Processing...</>
                                ) : (
                                    <><span className="material-symbols-outlined">lock</span> Complete Purchase — ${grandTotal.toFixed(2)}</>
                                )}
                            </button>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.08)', color: '#a19db9' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>account_balance_wallet</span>
                            Digital wallet payments coming soon. Please use a credit or debit card.
                        </div>
                    )}
                </div>

                {/* RIGHT — Order Summary */}
                <div style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '1rem', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Booking Summary</h3>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Movie */}
                            <div style={{ display: 'flex', gap: '0.875rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                {screening?.poster && (
                                    <img src={screening.poster} style={{ width: '56px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', flexShrink: 0 }} alt="poster" />
                                )}
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{screening?.movie || 'The Dark Knight Returns'}</p>
                                    <p style={{ color: '#a19db9', fontSize: '0.8rem' }}>{screening?.hall || 'IMAX Hall 1'}</p>
                                    <p style={{ color: '#a19db9', fontSize: '0.8rem' }}>{screening?.date || 'Today'} · {screening?.time || '8:30 PM'}</p>
                                </div>
                            </div>

                            {/* Seats */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a19db9' }}>Seats</p>
                                {selectedSeats.map(s => (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span>{s.label}</span><span style={{ fontWeight: 700 }}>${s.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Combo */}
                            {selectedCombo && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a19db9' }}>Combo</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#f2a60d' }}>Custom Combo Bundle</span>
                                        <span style={{ fontWeight: 700 }}>${selectedCombo.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Totals */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                {[['Subtotal', seatTotal + comboTotal + snacksTotal], ['Booking Fee', bookingFee], ['Tax (10%)', taxes]].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#a19db9' }}>
                                        <span>{k}</span><span>${v.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, paddingTop: '0.5rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#3211d4' }}>${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
