import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import toast from 'react-hot-toast';

// Generate seats for a section
const generateSeats = (rows, cols, section, pricePerSeat) => {
    const seats = [];
    const rowLetters = 'ABCDEFGHIJ';
    // Pre-occupied seats (random)
    const occupiedIndexes = new Set([2, 5, 8, 11, 14, 20, 23]);
    rows.forEach((row, ri) => {
        for (let col = 1; col <= cols; col++) {
            const idx = ri * cols + col;
            seats.push({
                id: `${section}-${row}-${col}`,
                row, col, section,
                price: pricePerSeat,
                status: occupiedIndexes.has(idx) ? 'occupied' : 'available',
                label: `Row ${row} - Seat ${col}`,
            });
        }
    });
    return seats;
};

const SEAT_SECTIONS = [
    { key: 'TOP_LEFT', label: 'Top Left', price: 20, rows: ['A', 'B'], cols: 6 },
    { key: 'TOP_RIGHT', label: 'Top Right', price: 20, rows: ['A', 'B'], cols: 6 },
    { key: 'BTM_LEFT', label: 'Bottom Left', price: 10, rows: ['C', 'D'], cols: 6 },
    { key: 'BTM_RIGHT', label: 'Bottom Right', price: 10, rows: ['C', 'D'], cols: 6 },
];

export default function SeatSelectionPage() {
    const { screeningId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { screening, selectedSeats, toggleSeat, seatTotal, bookingFee, grandTotal } = useCart();
    const [showAuth, setShowAuth] = useState(false);

    const [allSeats] = useState(() => {
        let seatMap = {};
        SEAT_SECTIONS.forEach(s => {
            const generated = generateSeats(s.rows, s.cols, s.key, s.price);
            generated.forEach(seat => { seatMap[seat.id] = seat; });
        });
        return seatMap;
    });

    const isSelected = (seatId) => selectedSeats.some(s => s.id === seatId);

    const handleSeatClick = (seat) => {
        if (seat.status === 'occupied') return;
        toggleSeat(seat);
    };

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }
        if (!user) {
            setShowAuth(true);
            return;
        }
        navigate('/snacks');
    };

    const movie = screening?.movie || 'The Dark Knight Returns';
    const movieTime = screening ? `${screening.hall} | ${screening.time}` : 'The Grand Theater - Screen 4 | Today, 8:30 PM';

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT: Seat Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Breadcrumbs */}
                    <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: '#a19db9' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
                        <span>/</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Movies</span>
                        <span>/</span>
                        <span style={{ color: 'white' }}>Seat Selection</span>
                    </nav>

                    {/* Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{movie}</h1>
                            <p style={{ color: '#a19db9', marginTop: '0.4rem' }}>{movieTime}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span className="material-symbols-outlined" style={{ color: '#3211d4', fontSize: '1.1rem' }}>info</span>
                            <span style={{ fontSize: '0.75rem', color: '#a19db9' }}>Taxes &amp; fees calculated at checkout</span>
                        </div>
                    </div>

                    {/* Seat Map */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                        {/* Screen */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                            <div className="screen-curve" style={{ width: '80%' }} />
                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#a19db9', fontWeight: 700, marginTop: '0.4rem' }}>Screen This Way</span>
                        </div>

                        {/* Seat Grid - 2x2 layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 3rem', maxWidth: '700px', margin: '0 auto' }}>
                            {SEAT_SECTIONS.map(section => (
                                <div key={section.key}>
                                    <p style={{ fontSize: '0.65rem', color: '#a19db9', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                        {section.label} (${section.price})
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.cols}, 1fr)`, gap: '0.375rem' }}>
                                        {section.rows.flatMap(row =>
                                            Array.from({ length: section.cols }, (_, ci) => {
                                                const seatId = `${section.key}-${row}-${ci + 1}`;
                                                const seat = allSeats[seatId];
                                                if (!seat) return null;
                                                const selected = isSelected(seatId);
                                                const occupied = seat.status === 'occupied';
                                                return (
                                                    <div key={seatId}
                                                        className={`seat ${occupied ? 'occupied' : selected ? 'selected' : 'available'}`}
                                                        onClick={() => handleSeatClick(seat)}
                                                        title={occupied ? 'Occupied' : selected ? `Selected — $${seat.price}` : `${seat.label} — $${seat.price}`}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {[
                                { color: 'var(--seat-available)', label: 'Available' },
                                { color: 'var(--seat-occupied)', label: 'Occupied' },
                                { color: 'var(--seat-selected)', label: 'Selected' },
                            ].map(({ color, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '1rem', height: '1rem', borderRadius: '3px', background: color, boxShadow: label === 'Selected' ? '0 0 8px rgba(234,179,8,0.5)' : 'none' }} />
                                    <span style={{ fontSize: '0.8rem', color: '#a19db9' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Chips */}
                    <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Pricing Tiers</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {[
                                { icon: 'workspace_premium', color: '#eab308', label: 'Top Section ($20)' },
                                { icon: 'star', color: '#3211d4', label: 'Side Sections ($15)' },
                                { icon: 'theater_comedy', color: '#a19db9', label: 'Bottom Section ($10)' },
                            ].map(({ icon, color, label }) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '0.75rem', padding: '0.5rem 1rem',
                                }}>
                                    <span className="material-symbols-outlined" style={{ color, fontSize: '1.1rem' }}>{icon}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Order Summary Sidebar */}
                <div style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '1rem', padding: '1.5rem' }}>
                        {/* Movie info */}
                        <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
                            {screening?.poster && (
                                <img src={screening.poster} alt={movie} style={{ width: '72px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }} />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.3, marginBottom: '0.25rem' }}>{movie}</h3>
                                <p style={{ color: '#a19db9', fontSize: '0.8rem' }}>English, {screening?.format || '2D'}</p>
                                {screening?.format === 'IMAX' && (
                                    <p style={{ color: '#3211d4', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>IMAX Premium</p>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h4 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>Order Summary</h4>
                            {selectedSeats.length === 0 ? (
                                <p style={{ color: '#a19db9', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No seats selected yet</p>
                            ) : (
                                selectedSeats.map(seat => (
                                    <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#eab308', fontSize: '0.9rem' }}>event_seat</span>
                                            <span>{seat.label}</span>
                                        </div>
                                        <span style={{ fontWeight: 700 }}>${seat.price}.00</span>
                                    </div>
                                ))
                            )}

                            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#a19db9' }}>
                                    <span>Subtotal</span><span>${seatTotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#a19db9' }}>
                                    <span>Booking Fee</span><span>${bookingFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, paddingTop: '0.5rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#3211d4' }}>${(seatTotal + bookingFee).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', height: '52px', fontSize: '0.95rem' }}>
                                <span className="material-symbols-outlined">{user ? 'restaurant' : 'login'}</span>
                                {user ? 'Continue to Snacks' : 'Login to Checkout'}
                            </button>
                            <p style={{ fontSize: '0.65rem', textAlign: 'center', color: '#a19db9', lineHeight: 1.5 }}>
                                By proceeding, you agree to our Terms of Service and Privacy Policy. All sales are final.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showAuth && (
                <AuthModal
                    initialMode="login"
                    onClose={() => setShowAuth(false)}
                    onSuccess={() => { setShowAuth(false); navigate('/snacks'); }}
                />
            )}
        </div>
    );
}
