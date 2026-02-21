import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QRCode from 'qrcode';

// Sample tickets data (would come from Firestore in production)
const SAMPLE_TICKETS = [
    {
        id: 'OMV-A1B2C3', movie: 'Dune: Part Two', genre: 'Sci-Fi',
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
        date: 'Sat, Feb 22, 2024', time: '7:30 PM', hall: 'IMAX Hall 1',
        seats: ['Row A - Seat 5', 'Row A - Seat 6'], format: 'IMAX',
        total: 58.95, status: 'active',
        snackStatus: 'pending', combo: { popcorn: 'Large Bucket (Butter)', drink: 'Coca-Cola' },
    },
    {
        id: 'OMV-D3E4F5', movie: 'Oppenheimer', genre: 'Drama',
        poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
        date: 'Mon, Feb 24, 2024', time: '3:00 PM', hall: 'Hall 3',
        seats: ['Row C - Seat 11'], format: '2D',
        total: 28.50, status: 'upcoming',
        snackStatus: null, combo: null,
    },
];

function QRCodeCanvas({ data }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, data, {
                width: 180, margin: 2, color: { dark: '#000000', light: '#ffffff' },
            });
        }
    }, [data]);
    return <canvas ref={canvasRef} style={{ borderRadius: '0.75rem', display: 'block' }} />;
}

export default function MyTicketsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [featured, setFeatured] = useState(SAMPLE_TICKETS[0]);

    const filteredTickets = activeTab === 'active'
        ? SAMPLE_TICKETS.filter(t => t.status === 'active')
        : SAMPLE_TICKETS.filter(t => t.status === 'upcoming' || t.status === 'past');

    const qrData = JSON.stringify({ orderId: featured.id, seats: featured.seats, movie: featured.movie });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'inline-block', background: 'rgba(50,17,212,0.1)', border: '1px solid rgba(50,17,212,0.25)', borderRadius: '999px', padding: '0.25rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.7rem', fontWeight: 700, color: '#7b5ea7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Your Cinema Pass
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>My Digital Tickets</h1>
                    {user && <p style={{ color: '#a19db9', marginTop: '0.4rem' }}>Welcome back, {user.displayName?.split(' ')[0] || 'Movie Lover'}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
                        Book Again
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT: Ticket List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.25rem', gap: '0.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {[['active', 'Active Bookings'], ['upcoming', 'Upcoming & Past']].map(([id, label]) => (
                            <button key={id} onClick={() => setActiveTab(id)} style={{
                                flex: 1, padding: '0.6rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
                                background: activeTab === id ? '#3211d4' : 'transparent',
                                color: 'white', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Be Vietnam Pro, sans-serif',
                                transition: 'all 0.2s',
                            }}>{label}</button>
                        ))}
                    </div>

                    {/* Ticket Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredTickets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#a19db9' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>confirmation_number</span>
                                <p>No tickets in this category.</p>
                                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>Book a Movie</button>
                            </div>
                        ) : filteredTickets.map(ticket => (
                            <div key={ticket.id}
                                onClick={() => setFeatured(ticket)}
                                style={{
                                    background: featured.id === ticket.id ? 'rgba(50,17,212,0.08)' : '#1d1c27',
                                    border: `1px solid ${featured.id === ticket.id ? 'rgba(50,17,212,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                    borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer',
                                    transition: 'all 0.2s', display: 'flex',
                                }}
                            >
                                <img src={ticket.poster} alt={ticket.movie} style={{ width: '90px', objectFit: 'cover', flexShrink: 0 }} />
                                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <h3 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{ticket.movie}</h3>
                                            <span style={{ background: ticket.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(50,17,212,0.1)', color: ticket.status === 'active' ? '#22c55e' : '#7b5ea7', border: `1px solid ${ticket.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(50,17,212,0.25)'}`, borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>
                                                {ticket.status === 'active' ? '● UPCOMING' : '○ Later'}
                                            </span>
                                        </div>
                                        <p style={{ color: '#a19db9', fontSize: '0.8rem', marginTop: '0.25rem' }}>{ticket.date} · {ticket.time}</p>
                                        <p style={{ color: '#a19db9', fontSize: '0.8rem' }}>{ticket.hall}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                                        {ticket.seats.map(s => (
                                            <span key={s} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.3rem', padding: '0.15rem 0.5rem', fontSize: '0.72rem', fontWeight: 600 }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: QR Code / Featured Ticket */}
                <div style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1d1c27, #16151f)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                        {/* Colored top strip */}
                        <div style={{ height: '4px', background: 'linear-gradient(90deg, #3211d4, #7b5ea7)' }} />

                        <div style={{ padding: '1.75rem' }}>
                            {/* Movie info */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                                <img src={featured.poster} alt={featured.movie} style={{ width: '72px', height: '100px', objectFit: 'cover', borderRadius: '0.625rem', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} />
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontWeight: 900, fontSize: '1.3rem', lineHeight: 1.2, marginBottom: '0.4rem' }}>{featured.movie}</h2>
                                    <p style={{ color: '#a19db9', fontSize: '0.8rem' }}>{featured.hall}</p>
                                    <p style={{ color: '#a19db9', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{featured.date}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{ background: 'rgba(50,17,212,0.15)', border: '1px solid rgba(50,17,212,0.3)', borderRadius: '0.3rem', padding: '0.15rem 0.45rem', fontSize: '0.65rem', fontWeight: 700 }}>
                                            {featured.format}
                                        </span>
                                        <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.3rem', padding: '0.15rem 0.45rem', fontSize: '0.65rem', fontWeight: 600 }}>
                                            {featured.time}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Seat labels */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {featured.seats.map((seat, i) => {
                                        const [, row, , num] = seat.split(' ');
                                        return (
                                            <div key={i} style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '0.6rem', color: '#a19db9', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.15rem' }}>{i === 0 ? 'Row' : 'Row'}</p>
                                                <p style={{ fontWeight: 900, fontSize: '1.5rem' }}>{row}</p>
                                                <p style={{ fontSize: '0.6rem', color: '#a19db9', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Seat</p>
                                                <p style={{ fontWeight: 900, fontSize: '1.5rem' }}>{num}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dashed separator */}
                            <div style={{ position: 'relative', margin: '0 -1.75rem', padding: '0 1.75rem' }}>
                                <div style={{ borderTop: '2px dashed rgba(255,255,255,0.1)', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-1.75rem', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#131022' }} />
                                    <div style={{ position: 'absolute', right: '-1.75rem', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#131022' }} />
                                </div>
                            </div>

                            {/* QR Code */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', gap: '0.75rem' }}>
                                <div style={{ background: 'white', borderRadius: '0.875rem', padding: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                                    <QRCodeCanvas data={qrData} />
                                </div>
                                <p style={{ fontSize: '0.65rem', color: '#a19db9', textAlign: 'center', lineHeight: 1.6 }}>
                                    Scan at the entrance gate • Order: <strong style={{ color: 'white' }}>{featured.id}</strong>
                                </p>
                            </div>

                            {/* Snack status */}
                            {featured.combo && (
                                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(242,166,13,0.06)', border: '1px solid rgba(242,166,13,0.2)', borderRadius: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#f2a60d', fontSize: '1.1rem' }}>local_dining</span>
                                        <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Snack Order</p>
                                        <span style={{ marginLeft: 'auto', background: featured.snackStatus === 'collected' ? 'rgba(34,197,94,0.15)' : 'rgba(242,166,13,0.15)', color: featured.snackStatus === 'collected' ? '#22c55e' : '#f2a60d', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 700 }}>
                                            {featured.snackStatus === 'collected' ? 'Collected ✓' : 'Pending'}
                                        </span>
                                    </div>
                                    <p style={{ color: '#bab09c', fontSize: '0.78rem' }}>{featured.combo.popcorn}</p>
                                    <p style={{ color: '#bab09c', fontSize: '0.78rem' }}>{featured.combo.drink}</p>
                                </div>
                            )}

                            {/* Download */}
                            <button className="btn-primary" onClick={() => window.print()} style={{ width: '100%', marginTop: '1.25rem', height: '44px', fontSize: '0.85rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>download</span>
                                Download PDF Ticket
                            </button>
                            <button className="btn-secondary" style={{ width: '100%', marginTop: '0.5rem', height: '44px', fontSize: '0.85rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>share</span>
                                Share Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
