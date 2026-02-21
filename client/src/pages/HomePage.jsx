import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Sample movie data (in production, fetched from Firestore)
const MOVIES = [
    {
        id: 'dune-2', title: 'Dune: Part Two', genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 46m',
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        screenings: [
            { id: 'sc1', time: '2:30 PM', hall: 'IMAX Hall 1', format: 'IMAX', date: '2024-02-21' },
            { id: 'sc2', time: '7:30 PM', hall: 'Hall 2', format: '2D', date: '2024-02-21' },
        ]
    },
    {
        id: 'oppenheimer', title: 'Oppenheimer', genre: 'Drama', rating: 'R', duration: '3h 0m',
        poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
        description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        screenings: [
            { id: 'sc3', time: '3:00 PM', hall: 'Hall 3', format: '2D', date: '2024-02-21' },
            { id: 'sc4', time: '8:15 PM', hall: 'Dolby Hall 4', format: 'Dolby', date: '2024-02-21' },
        ]
    },
    {
        id: 'dark-knight', title: 'The Dark Knight Returns', genre: 'Action', rating: 'PG-13', duration: '2h 32m',
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'When a criminal mastermind known as the Joker emerges, Batman must face a force that teases the city into anarchy.',
        screenings: [
            { id: 'sc5', time: '4:00 PM', hall: 'IMAX Hall 1', format: 'IMAX', date: '2024-02-21' },
            { id: 'sc6', time: '9:00 PM', hall: 'Hall 2', format: '2D', date: '2024-02-21' },
        ]
    },
    {
        id: 'interstellar', title: 'Interstellar: Anniversary', genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 49m',
        poster: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=400&h=600&fit=crop',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        screenings: [
            { id: 'sc7', time: '1:00 PM', hall: 'Hall 3', format: '2D', date: '2024-02-21' },
            { id: 'sc8', time: '6:30 PM', hall: 'IMAX Hall 1', format: 'IMAX', date: '2024-02-21' },
        ]
    },
    {
        id: 'avatar', title: 'Avatar: Way of Water', genre: 'Fantasy', rating: 'PG-13', duration: '3h 12m',
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'Jake Sully and Neytiri have formed a family and do what it takes to stay together.',
        screenings: [
            { id: 'sc9', time: '11:00 AM', hall: 'IMAX Hall 1', format: 'IMAX', date: '2024-02-21' },
            { id: 'sc10', time: '5:00 PM', hall: 'Hall 2', format: '2D', date: '2024-02-21' },
        ]
    },
    {
        id: 'poor-things', title: 'Poor Things', genre: 'Comedy', rating: 'R', duration: '2h 21m',
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'The unbelievable tale of Bella Baxter brought back to life by the brilliant and unorthodox scientist.',
        screenings: [
            { id: 'sc11', time: '2:00 PM', hall: 'Hall 3', format: '2D', date: '2024-02-21' },
            { id: 'sc12', time: '7:00 PM', hall: 'Hall 4', format: '2D', date: '2024-02-21' },
        ]
    },
];

const GENRES = ['All', 'Sci-Fi', 'Action', 'Drama', 'Fantasy', 'Comedy'];

export default function HomePage() {
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();
    const { setScreening } = useCart();

    const filtered = selectedGenre === 'All' ? MOVIES : MOVIES.filter(m => m.genre === selectedGenre);

    const handleSelectScreening = (movie, screening) => {
        setScreening({ id: screening.id, movie: movie.title, poster: movie.poster, date: screening.date, time: screening.time, hall: screening.hall, format: screening.format });
        navigate(`/select-seats/${screening.id}`);
        setSelectedMovie(null);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeIn 0.6s ease' }}>
                <div style={{
                    display: 'inline-block', background: 'rgba(50,17,212,0.15)', border: '1px solid rgba(50,17,212,0.3)',
                    borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1.25rem',
                    fontSize: '0.75rem', fontWeight: 700, color: '#7b5ea7', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                    🎬 Now Showing
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
                    Your Next<br />
                    <span style={{ background: 'linear-gradient(135deg, #3211d4, #7b5ea7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Cinematic Experience
                    </span>
                </h1>
                <p style={{ color: '#a19db9', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
                    Choose your film, pick the perfect seats, and customize your snack experience — all in one seamless journey.
                </p>
            </div>

            {/* Genre Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {GENRES.map(genre => (
                    <button key={genre} onClick={() => setSelectedGenre(genre)} style={{
                        padding: '0.45rem 1.1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                        border: selectedGenre === genre ? '1px solid #3211d4' : '1px solid rgba(255,255,255,0.12)',
                        background: selectedGenre === genre ? '#3211d4' : 'rgba(255,255,255,0.04)',
                        color: 'white', transition: 'all 0.2s',
                    }}>
                        {genre}
                    </button>
                ))}
            </div>

            {/* Movie Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filtered.map(movie => (
                    <div key={movie.id}
                        onMouseEnter={() => setHoveredCard(movie.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: '#1d1c27',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            transform: hoveredCard === movie.id ? 'translateY(-6px)' : 'none',
                            boxShadow: hoveredCard === movie.id ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
                        }}
                        onClick={() => setSelectedMovie(movie)}
                    >
                        {/* Poster */}
                        <div style={{ position: 'relative', paddingTop: '140%', overflow: 'hidden' }}>
                            <img src={movie.poster} alt={movie.title}
                                style={{
                                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                                    transition: 'transform 0.4s ease', transform: hoveredCard === movie.id ? 'scale(1.05)' : 'scale(1)'
                                }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,16,34,1) 0%, rgba(19,16,34,0.4) 40%, transparent 70%)' }} />
                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.7)', borderRadius: '0.4rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                                {movie.rating}
                            </div>
                            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                                <span style={{ background: 'rgba(50,17,212,0.8)', borderRadius: '0.4rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                                    {movie.genre}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '1.1rem' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>{movie.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color: '#a19db9' }}>schedule</span>
                                <span style={{ color: '#a19db9', fontSize: '0.8rem' }}>{movie.duration}</span>
                            </div>
                            <p style={{ color: '#a19db9', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {movie.description}
                            </p>
                            <button className="btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Showtime Modal */}
            {selectedMovie && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedMovie(null)}>
                    <div style={{
                        background: '#1d1c27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem',
                        padding: '2rem', width: '100%', maxWidth: '480px', animation: 'fadeIn 0.3s ease',
                    }}>
                        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
                            <img src={selectedMovie.poster} alt={selectedMovie.title}
                                style={{ width: '90px', height: '130px', objectFit: 'cover', borderRadius: '0.75rem' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.3rem' }}>{selectedMovie.title}</h3>
                                <p style={{ color: '#a19db9', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{selectedMovie.genre} · {selectedMovie.duration} · {selectedMovie.rating}</p>
                                <p style={{ color: '#a19db9', fontSize: '0.78rem', lineHeight: 1.5 }}>{selectedMovie.description}</p>
                            </div>
                        </div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a19db9', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                            Select Showtime — Today
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {selectedMovie.screenings.map(s => (
                                <button key={s.id} onClick={() => handleSelectScreening(selectedMovie, s)} style={{
                                    background: 'rgba(50,17,212,0.1)', border: '1px solid rgba(50,17,212,0.3)',
                                    borderRadius: '0.75rem', padding: '0.875rem', textAlign: 'left', cursor: 'pointer',
                                    transition: 'all 0.2s', color: 'white',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(50,17,212,0.2)'; e.currentTarget.style.borderColor = '#3211d4'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(50,17,212,0.1)'; e.currentTarget.style.borderColor = 'rgba(50,17,212,0.3)'; }}
                                >
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.time}</div>
                                    <div style={{ color: '#a19db9', fontSize: '0.75rem' }}>{s.hall}</div>
                                    <div style={{ display: 'inline-block', marginTop: '0.4rem', background: '#3211d4', borderRadius: '0.3rem', padding: '0.1rem 0.4rem', fontSize: '0.65rem', fontWeight: 700 }}>
                                        {s.format}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setSelectedMovie(null)} style={{
                            marginTop: '1.25rem', width: '100%', background: 'none', border: 'none', color: '#a19db9', cursor: 'pointer', padding: '0.5rem', fontSize: '0.85rem'
                        }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
