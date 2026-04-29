import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { fetchScreeningSeats } from '../services/api';
import toast from 'react-hot-toast';

const generateSeats = (rows, cols, section, pricePerSeat, bookedSeatsSet) => {
    const seats = [];
    rows.forEach((row, ri) => {
        for (let col = 1; col <= cols; col++) {
            const label = `Row ${row} - Seat ${col}`;
            const isOccupied = bookedSeatsSet.has(label);
            seats.push({
                id: `${section}-${row}-${col}`,
                row, col, section,
                price: pricePerSeat,
                status: isOccupied ? 'occupied' : 'available',
                label,
            });
        }
    });
    return seats;
};

const SEAT_SECTIONS = [
    { key: 'TOP_LEFT',  label: 'Premium Left',  tier: 'premium',  cols: 6, rows: ['A', 'B'] },
    { key: 'TOP_RIGHT', label: 'Premium Right', tier: 'premium',  cols: 6, rows: ['A', 'B'] },
    { key: 'BTM_LEFT',  label: 'Standard Left', tier: 'standard', cols: 6, rows: ['C', 'D'] },
    { key: 'BTM_RIGHT', label: 'Standard Right',tier: 'standard', cols: 6, rows: ['C', 'D'] },
];

const FORMAT_CONFIG = {
    'IMAX':         { color: '#e11d48', glow: 'rgba(225, 29, 72, 0.35)', label: 'IMAX®',          icon: 'panorama_wide_angle', screen: 'IMAX Giant Screen' },
    'Dolby Cinema': { color: '#9f1239', glow: 'rgba(159, 18, 57, 0.35)',  label: 'Dolby Cinema',   icon: 'speaker', screen: 'Dolby Atmos & Vision' },
    '4DX':          { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)',  label: '4DX',            icon: 'wind_power', screen: '4DX Motion Experience' },
    '3D':           { color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)',  label: '3D',             icon: '3d_rotation', screen: '3D Projection' },
    '2D':           { color: '#6b7280', glow: 'rgba(107, 114, 128, 0.2)',  label: 'Standard 2D',   icon: 'movie', screen: 'Standard Screen' },
};

const getFormatConfig = (format) => FORMAT_CONFIG[format] || FORMAT_CONFIG['2D'];

export default function SeatSelectionPage() {
    const { screeningId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { screening, selectedSeats, toggleSeat, seatTotal, bookingFee, grandTotal } = useCart();
    const [showAuth, setShowAuth] = useState(false);
    const [bookedSeatsSet, setBookedSeatsSet] = useState(new Set());
    const [loadingSeats, setLoadingSeats] = useState(true);

    // Dynamic pricing: derive seat prices from the screening's basePrice
    const base = screening?.basePrice || 12;
    const sectionPrices = {
        premium: parseFloat((base * 1.5).toFixed(2)),
        standard: parseFloat((base * 0.85).toFixed(2)),
    };

    useEffect(() => {
        const loadSeats = async () => {
            if (!screeningId) return;
            try {
                const data = await fetchScreeningSeats(screeningId);
                setBookedSeatsSet(new Set(data.bookedSeats || []));
            } catch (error) {
                console.error('Failed to load booked seats', error);
            } finally {
                setLoadingSeats(false);
            }
        };
        loadSeats();
    }, [screeningId]);

    const [allSeats, setAllSeats] = useState({});

    useEffect(() => {
        let seatMap = {};
        SEAT_SECTIONS.forEach(s => {
            const price = sectionPrices[s.tier];
            const generated = generateSeats(s.rows, s.cols, s.key, price, bookedSeatsSet);
            generated.forEach(seat => { seatMap[seat.id] = seat; });
        });
        setAllSeats(seatMap);
    }, [bookedSeatsSet, base]);

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

    const movie = screening?.movie || 'Select a Movie';
    const movieTime = screening ? `${screening.hall} | ${screening.date} · ${screening.time}` : 'No screening selected';
    const fmt = getFormatConfig(screening?.format);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>

                {/* LEFT: Seat Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Breadcrumbs */}
                    <nav className="desktop-only" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
                        <span>/</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Movies</span>
                        <span>/</span>
                        <span style={{ color: 'white' }}>Seat Selection</span>
                    </nav>

                    {/* Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'white', fontFamily: 'var(--font-display)' }}>{movie}</h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>{movieTime}</p>
                        </div>
                    </div>

                    {/* Format Banner */}
                    {screening?.format && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(225, 29, 72, 0.1)', border: `1px solid rgba(225, 29, 72, 0.2)`, borderRadius: '1.25rem' }}>
                            <span className="material-symbols-outlined" style={{ color: fmt.color, fontSize: '1.5rem' }}>{fmt.icon}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 900, fontSize: '1rem', color: fmt.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{fmt.label} Experience</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600 }}>{fmt.screen}</p>
                            </div>
                            <div className="desktop-only" style={{ background: '#e11d48', borderRadius: '0.75rem', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 900, color: 'white' }}>${screening.basePrice?.toFixed(2)} BASE</div>
                        </div>
                    )}

                    {/* Seat Map */}
                    <div className="seat-container" style={{ background: 'rgba(18, 1, 1, 0.6)', borderRadius: '1.5rem', padding: '4rem 2rem', border: `1px solid rgba(225, 29, 72, 0.15)`, boxShadow: `0 0 60px rgba(18, 1, 1, 0.8)`, position: 'relative', overflow: 'auto', opacity: loadingSeats ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                        {loadingSeats && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', zIndex: 10 }}><span style={{ color: 'white', fontWeight: 800 }}>Loading Theatre Map...</span></div>}
                        
                        {/* Screen */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5rem' }}>
                            <div className="screen-curve" style={{ width: '85%', maxWidth: '800px' }} />
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#e11d48', fontWeight: 900, marginTop: '1.25rem', opacity: 0.8 }}>{fmt.screen}</span>
                        </div>

                        {/* Seat Grid - 2x2 layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', gap: '3rem 4rem', width: 'fit-content', margin: '0 auto' }}>
                            {SEAT_SECTIONS.map(section => (
                                <div key={section.key}>
                                    <p style={{ fontSize: '0.75rem', color: section.tier === 'premium' ? '#f59e0b' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem', letterSpacing: '0.1em', fontWeight: 900 }}>
                                        {section.label}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.cols}, 1fr)`, gap: '0.5rem' }}>
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
                                                        style={{ width: '1.75rem', height: '1.75rem' }}
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
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {[
                                { color: 'var(--seat-available)', label: 'Available' },
                                { color: 'var(--seat-occupied)', label: 'Occupied' },
                                { color: 'var(--seat-selected)', label: 'Selected' },
                            ].map(({ color, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '4px', background: color, boxShadow: label === 'Selected' ? '0 0 12px rgba(245,158,11,0.6)' : 'none' }} />
                                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Order Summary Sidebar */}
                <div className="sidebar-fixed" style={{ position: 'sticky', top: '96px' }}>
                    <div className="glass-card" style={{ padding: '2rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                        {/* Movie info (desktop only) */}
                        <div className="desktop-only" style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                            {screening?.poster && (
                                <img src={screening.poster} alt={movie} style={{ width: '80px', height: '115px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: 1.2, marginBottom: '0.4rem', color: '#000', fontFamily: 'var(--font-display)' }}>{movie}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600 }}>English · {screening?.format || '2D'}</p>
                                <p style={{ color: fmt.color, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginTop: '0.4rem', letterSpacing: '0.05em' }}>{fmt.label} EXPERIENCE</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af' }}>Order Summary</h4>
                            {selectedSeats.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#9ca3af' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }}>event_seat</span>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>No seats selected yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {selectedSeats.map(seat => (
                                        <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.1rem' }}>event_seat</span>
                                                <span style={{ color: '#000' }}>{seat.label}</span>
                                            </div>
                                            <span style={{ color: '#000' }}>${seat.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#6b7280', fontWeight: 500 }}>
                                    <span>Subtotal</span><span style={{ color: '#000' }}>${seatTotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#6b7280', fontWeight: 500 }}>
                                    <span>Booking Fee</span><span style={{ color: '#000' }}>${bookingFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 900, paddingTop: '0.75rem', color: '#000', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#e11d48' }}>${(seatTotal + bookingFee).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', height: '60px', fontSize: '1.1rem' }}>
                                {user ? (
                                    <>
                                        <span className="material-symbols-outlined">restaurant</span>
                                        Continue to Snacks
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">login</span>
                                        Sign In to Checkout
                                    </>
                                )}
                            </button>
                            <p style={{ fontSize: '0.7rem', textAlign: 'center', color: '#9ca3af', lineHeight: 1.6, fontWeight: 500 }}>
                                By proceeding, you agree to our Terms of Service. All sales are final.
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
