import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchMovies, fetchScreenings } from '../services/api';
import toast from 'react-hot-toast';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Drama', 'Fantasy', 'Comedy'];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Build an array of {label, value} date options: Today, Tomorrow, then next 5 days */
const buildDateOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow'
            : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        options.push({ label, value: iso });
    }
    return options;
};

const DATE_OPTIONS = buildDateOptions();

/** Returns true when a screening can no longer be booked (started > 30 min ago, today only) */
const isScreeningClosed = (screening) => {
    const todayIso = new Date().toISOString().split('T')[0];
    if (screening.date !== todayIso) return false;
    if (!screening.time) return false;
    try {
        const [timePart, meridiem] = screening.time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        const now = new Date();
        const screeningStart = new Date();
        screeningStart.setHours(hours, minutes || 0, 0, 0);
        return (now - screeningStart) > 30 * 60 * 1000;
    } catch { return false; }
};

const FORMAT_COLORS = {
    'IMAX': '#e11d48',
    'Dolby Cinema': '#9f1239',
    '4DX': '#f59e0b',
    '3D': '#10b981',
    '2D': '#6b7280',
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const MovieSkeleton = () => (
    <div style={{ borderRadius: '1.25rem', overflow: 'hidden', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', animation: 'pulse 1.5s infinite ease-in-out', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ paddingTop: '140%', background: 'rgba(0,0,0,0.05)' }} />
        <div style={{ padding: '1.25rem' }}>
            <div style={{ height: '1.2rem', width: '70%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '0.8rem', width: '40%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '1.25rem' }} />
            <div style={{ height: '2.5rem', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '0.75rem' }} />
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Showtime modal state
    const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0].value);
    const [screenings, setScreenings] = useState([]);
    const [loadingScreenings, setLoadingScreenings] = useState(false);
    // Trailer modal state
    const [trailerMovie, setTrailerMovie] = useState(null);

    const navigate = useNavigate();
    const { setScreening } = useCart();

    // Close trailer on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setTrailerMovie(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []); 

    // Load movies
    useEffect(() => {
        const load = async () => {
            try { setMovies(await fetchMovies()); }
            catch { toast.error('Failed to load movies'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    // Auto-advance hero carousel
    useEffect(() => {
        if (movies.length === 0) return;
        const id = setInterval(() => setCurrentHeroIndex(p => (p + 1) % Math.min(movies.length, 3)), 6000);
        return () => clearInterval(id);
    }, [movies]);

    // Load screenings when movie or date changes
    const loadScreenings = useCallback(async (movieId, date) => {
        setLoadingScreenings(true);
        try {
            const data = await fetchScreenings({ movieId, date });
            setScreenings(data);
        } catch {
            const movie = movies.find(m => m.id === movieId);
            setScreenings(movie?.screenings || []);
        } finally {
            setLoadingScreenings(false);
        }
    }, [movies]);

    useEffect(() => {
        if (selectedMovie) loadScreenings(selectedMovie.id, selectedDate);
    }, [selectedMovie, selectedDate, loadScreenings]);

    const filtered = selectedGenre === 'All' ? movies : movies.filter(m => m.genre === selectedGenre);

    const handleSelectScreening = (screening) => {
        if (isScreeningClosed(screening)) return;
        setScreening({
            id: screening.id,
            movie: selectedMovie.title,
            poster: selectedMovie.poster,
            date: screening.date,
            time: screening.time,
            hall: screening.hall,
            format: screening.format,
            basePrice: screening.basePrice || 12,
        });
        navigate(`/select-seats/${screening.id}`);
        setSelectedMovie(null);
    };

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setSelectedDate(DATE_OPTIONS[0].value);
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            <style>{`
                @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:0.3; } }
                @keyframes fadeIn { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
                .movie-card:hover img { transform: scale(1.08); }
                .genre-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .genre-btn:hover { background: rgba(225, 29, 72, 0.2); }
            `}</style>

            {/* ── Hero Carousel ── */}
            {!loading && movies.length > 0 && (
                <div style={{ position: 'relative', height: 'auto', minHeight: '480px', borderRadius: '2rem', overflow: 'hidden', marginBottom: '4rem', animation: 'fadeIn 1s ease-out', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                    {movies.slice(0, 3).map((movie, index) => (
                        <div key={movie.id} style={{ position: 'relative', minHeight: '480px', opacity: index === currentHeroIndex ? 1 : 0, transition: 'opacity 1.2s ease-in-out', zIndex: index === currentHeroIndex ? 1 : 0, display: index === currentHeroIndex ? 'block' : 'none' }}>
                            <img src={movie.poster} style={{ width: '100%', height: '100%', position: 'absolute', objectFit: 'cover', objectPosition: 'center 20%' }} alt={movie.title} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #120101 15%, rgba(18, 1, 1, 0.7) 50%, transparent 100%)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #120101 0%, transparent 40%)' }} />
                            <div style={{ position: 'relative', zIndex: 2, padding: '4rem 3rem', maxWidth: '700px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '999px', padding: '0.5rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#ff4d7d', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48', animation: 'pulse 1.5s infinite' }} />
                                    Now Playing
                                </div>
                                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'white' }}>
                                    {movie.title}
                                </h1>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', fontWeight: 700 }}>
                                    <span style={{ background: '#e11d48', padding: '0.3rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>{movie.rating}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>{movie.genre}</span>
                                    <span style={{ color: '#e11d48' }}>·</span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>{movie.duration}</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {movie.description}
                                </p>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={() => openModal(movie)}>
                                        <span className="material-symbols-outlined">local_activity</span> Get Tickets
                                    </button>
                                    {movie.trailerId && (
                                        <button onClick={() => setTrailerMovie(movie)} className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            <span className="material-symbols-outlined">play_circle</span> Watch Trailer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Carousel indicators */}
                    <div style={{ position: 'absolute', bottom: '2.5rem', left: '3rem', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
                        {movies.slice(0, 3).map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentHeroIndex(idx)} aria-label={`Slide ${idx + 1}`} style={{ width: currentHeroIndex === idx ? '2.5rem' : '0.75rem', height: '0.75rem', borderRadius: '999px', background: currentHeroIndex === idx ? '#e11d48' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: currentHeroIndex === idx ? '0 0 15px rgba(225, 29, 72, 0.6)' : 'none' }} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Genre Filter ── */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1.5rem', marginBottom: '3rem', scrollbarWidth: 'none' }}>
                {GENRES.map(genre => (
                    <button key={genre} onClick={() => setSelectedGenre(genre)} className="genre-btn" style={{ flexShrink: 0, padding: '0.75rem 1.75rem', borderRadius: '999px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', border: selectedGenre === genre ? 'none' : '1px solid rgba(255,255,255,0.15)', background: selectedGenre === genre ? '#e11d48' : 'rgba(255,255,255,0.05)', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: selectedGenre === genre ? '0 10px 25px rgba(225, 29, 72, 0.4)' : 'none' }}>
                        {genre}
                    </button>
                ))}
            </div>

            {/* ── Movie Grid ── */}
            <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem', animation: 'fadeIn 0.8s ease-out 0.2s both' }}>
                {loading ? Array(6).fill(0).map((_, i) => <MovieSkeleton key={i} />) :
                    filtered.length > 0 ? filtered.map(movie => (
                        <div key={movie.id} className="movie-card glass-card"
                            onMouseEnter={() => setHoveredCard(movie.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => openModal(movie)}
                            style={{ padding: 0, overflow: 'hidden', transform: hoveredCard === movie.id ? 'translateY(-12px)' : 'none', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                            <div style={{ position: 'relative', paddingTop: '145%', overflow: 'hidden' }}>
                                <img src={movie.poster} alt={movie.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)' }} />
                                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#e11d48', borderRadius: '0.6rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 900, color: 'white', boxShadow: '0 5px 15px rgba(225, 29, 72, 0.4)' }}>{movie.rating}</div>
                            </div>
                            <div style={{ padding: '1.75rem' }}>
                                <h3 style={{ fontWeight: 950, fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: 1.1, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>{movie.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.85rem' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#e11d48' }}>movie</span>
                                    <span>{movie.genre.toUpperCase()}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                                    <span>{movie.duration}</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>{movie.description}</p>
                                <button className="btn-primary" style={{ width: '100%', height: '54px', fontSize: '0.95rem' }}>BOOK EXPERIENCE</button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', color: 'rgba(255,255,255,0.4)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>search_off</span>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>No movies found in this category.</p>
                        </div>
                    )}
            </div>

            {/* ── Showtime Modal ── */}
            {selectedMovie && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedMovie(null)}>
                    <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '650px', animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                            <img src={selectedMovie.poster} alt={selectedMovie.title} style={{ width: '140px', height: '210px', objectFit: 'cover', borderRadius: '1.25rem', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 style={{ fontWeight: 950, fontSize: '2.5rem', marginBottom: '0.75rem', color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '0.02em', lineHeight: 1 }}>{selectedMovie.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                    <span style={{ background: '#e11d48', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '0.85rem' }}>{selectedMovie.rating}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.95rem' }}>{selectedMovie.genre} · {selectedMovie.duration}</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>{selectedMovie.description}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e11d48', marginBottom: '1.25rem' }}>Select Screening Date</p>
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                                {DATE_OPTIONS.map(opt => (
                                    <button key={opt.value} onClick={() => setSelectedDate(opt.value)} style={{ flexShrink: 0, padding: '0.85rem 1.75rem', borderRadius: '1rem', border: selectedDate === opt.value ? '2px solid #e11d48' : '1px solid rgba(255,255,255,0.1)', background: selectedDate === opt.value ? '#e11d48' : 'rgba(255,255,255,0.03)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                                        {opt.label.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ minHeight: '150px' }}>
                            {loadingScreenings ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(225,29,72,0.1)', borderTopColor: '#e11d48', animation: 'spin 0.8s linear infinite' }} />
                                </div>
                            ) : screenings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', background: 'rgba(0,0,0,0.02)', borderRadius: '1.25rem', border: '1px dashed rgba(0,0,0,0.1)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>calendar_today</span>
                                    <p>No screenings scheduled for this date.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                    {screenings.map(s => {
                                        const closed = isScreeningClosed(s);
                                        return (
                                            <button key={s.id} onClick={() => !closed && handleSelectScreening(s)} disabled={closed}
                                                style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', background: closed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', cursor: closed ? 'not-allowed' : 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden' }}
                                                onMouseEnter={e => { if (!closed) { e.currentTarget.style.borderColor = '#e11d48'; e.currentTarget.style.background = 'rgba(225, 29, 72, 0.1)'; }}}
                                                onMouseLeave={e => { if (!closed) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
                                            >
                                                <div style={{ fontWeight: 950, fontSize: '1.8rem', color: closed ? 'rgba(255,255,255,0.2)' : 'white', marginBottom: '0.25rem', fontFamily: 'var(--font-accent)', lineHeight: 1 }}>{s.time}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.hall}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span style={{ background: FORMAT_COLORS[s.format] || '#6b7280', color: 'white', borderRadius: '0.5rem', padding: '0.3rem 0.7rem', fontSize: '0.75rem', fontWeight: 900 }}>{s.format}</span>
                                                    {!closed && s.basePrice && <span style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 950 }}>${s.basePrice.toFixed(0)}</span>}
                                                </div>
                                                {closed && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', fontSize: '0.8rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Closed</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button onClick={() => setSelectedMovie(null)} style={{ marginTop: '2rem', width: '100%', padding: '1rem', background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '0.875rem', color: '#6b7280', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 800, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#f9fafb'} onMouseLeave={e => e.currentTarget.style.background='none'}>Close</button>
                    </div>
                </div>
            )}

            {/* ── Trailer Modal ── */}
            {trailerMovie && (
                <div onClick={() => setTrailerMovie(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.4s ease-out' }}>
                    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '1000px', background: '#000', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.9)', border: '1px solid rgba(225,29,72,0.3)' }}>
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerMovie.trailerId}?autoplay=1&rel=0&modestbranding=1`}
                                title={`${trailerMovie.title} Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem 2rem', background: 'linear-gradient(to right, #1e0202, #120101)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{trailerMovie.title}</h4>
                                <p style={{ color: '#e11d48', fontWeight: 800 }}>Official Trailer · {trailerMovie.genre}</p>
                            </div>
                            <button className="btn-primary" onClick={() => { setTrailerMovie(null); openModal(trailerMovie); }}>Book Now</button>
                        </div>
                    </div>
                    <button onClick={() => setTrailerMovie(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}
        </div>
    );
}
