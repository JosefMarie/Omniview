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
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div className="animate-success" style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3211d4, #4e2fds)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(50,17,212,0.4)',
                    animation: 'success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards, pulse-glow 2s 0.6s ease-in-out infinite',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
            </div>

            <div style={{ display: 'inline-block', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '0.3rem 0.9rem', marginBottom: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ✓ Payment Successful
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.1 }}>
                Booking<br />
                <span style={{ background: 'linear-gradient(135deg, #3211d4, #7b5ea7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Confirmed!</span>
            </h1>
            <p style={{ color: '#a19db9', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Your tickets are ready. Enjoy the movie and your snacks! 🎬🍿
            </p>

            {order && (
                <div style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '2rem' }}>
                    {/* Movie info */}
                    <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {order.poster && <img src={order.poster} alt={order.movie} style={{ width: '64px', height: '90px', objectFit: 'cover', borderRadius: '0.5rem' }} />}
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{order.movie}</h3>
                            <p style={{ color: '#a19db9', fontSize: '0.85rem' }}>{order.time}</p>
                            <p style={{ color: '#a19db9', fontSize: '0.85rem' }}>{order.hall}</p>
                        </div>
                    </div>
                    {/* Seats */}
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <p style={{ fontSize: '0.7rem', color: '#a19db9', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Seats</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {order.seats?.map((s, i) => (
                                <span key={i} style={{ background: 'rgba(50,17,212,0.15)', border: '1px solid rgba(50,17,212,0.3)', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}>{s}</span>
                            ))}
                        </div>
                    </div>
                    {/* Total & Order ID */}
                    <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '0.7rem', color: '#a19db9', fontWeight: 700, textTransform: 'uppercase' }}>Order ID</p>
                            <p style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.05em' }}>{order.orderId}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.7rem', color: '#a19db9', fontWeight: 700, textTransform: 'uppercase' }}>Total Paid</p>
                            <p style={{ fontWeight: 900, fontSize: '1.5rem', color: '#3211d4' }}>${order.total?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => navigate('/my-tickets')} className="btn-primary" style={{ height: '56px', fontSize: '1rem', boxShadow: '0 12px 32px rgba(50,17,212,0.3)' }}>
                    <span className="material-symbols-outlined">qr_code_2</span>
                    View My Tickets
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => window.print()} className="btn-secondary" style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>print</span>
                        Print Receipt
                    </button>
                    <button onClick={() => navigate('/')} className="btn-secondary" style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>local_movies</span>
                        Browse Movies
                    </button>
                </div>
            </div>
        </div>
    );
}
