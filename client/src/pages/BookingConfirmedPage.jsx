import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingConfirmedPage() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('lastOrder');
        if (data) setOrder(JSON.parse(data));
    }, []);

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <div className="animate-success" style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e11d48, #9f1239)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(225, 29, 72, 0.4)',
                    animation: 'success-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, pulse-glow 2s 0.8s ease-in-out infinite',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'white', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '0.5rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>verified</span>
                Payment Successful
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1, fontFamily: 'var(--font-display)', color: 'white' }}>
                BOOKING<br />
                <span style={{ color: '#e11d48', textShadow: '0 0 20px rgba(225, 29, 72, 0.3)' }}>CONFIRMED!</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 }}>
                Your cinematic journey is set. We've sent your tickets and details to your inbox. 🎬🍿
            </p>

            {order && (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem', textAlign: 'left' }}>
                    {/* Movie info */}
                    <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        {order.poster && <img src={order.poster} alt={order.movie} style={{ width: '80px', height: '115px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }} />}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.4rem', color: '#000', fontFamily: 'var(--font-display)' }}>{order.movie}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontWeight: 700, fontSize: '0.95rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#e11d48' }}>event</span>
                                <span>{order.time}</span>
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.2rem' }}>{order.hall} · {order.format}</p>
                        </div>
                    </div>
                    {/* Seats */}
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>YOUR SEATS</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {order.seats?.map((s, i) => (
                                <span key={i} style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem', fontWeight: 800, color: '#e11d48' }}>{s}</span>
                            ))}
                        </div>
                    </div>
                    {/* Total & Order ID */}
                    <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#f9fafb' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ORDER REFERENCE</p>
                            <p style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '0.05em', color: '#000' }}>#{order.orderId}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>TOTAL PAID</p>
                            <p style={{ fontWeight: 900, fontSize: '2rem', color: '#e11d48', fontFamily: 'var(--font-display)' }}>${order.total?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* OmniPoints Earned Badge */}
            {order && order.pointsEarned > 0 && (
                <div className="animate-success" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '1.25rem', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 12px 30px rgba(245,158,11,0.1)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900 }}>stars</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>+{order.pointsEarned} OmniPoints Earned!</p>
                            <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loyalty Member Reward</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate('/my-tickets')} className="btn-primary" style={{ height: '64px', fontSize: '1.2rem', borderRadius: '1.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>qr_code_2</span>
                    VIEW MY TICKETS
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.print()} className="btn-secondary" style={{ flex: 1, height: '52px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)' }}>
                        <span className="material-symbols-outlined">print</span>
                        Print Receipt
                    </button>
                    <button onClick={() => navigate('/')} className="btn-secondary" style={{ flex: 1, height: '52px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)' }}>
                        <span className="material-symbols-outlined">local_movies</span>
                        Home Page
                    </button>
                </div>
            </div>
        </div>
    );
}
