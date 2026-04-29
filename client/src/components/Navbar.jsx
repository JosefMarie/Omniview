import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchUserRewards } from '../services/api';
import AuthModal from './AuthModal';

const OmniViewLogo = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
    </svg>
);

const NAV_LINKS = [
    { to: '/', label: 'Movies', exact: true },
    { to: '/my-tickets', label: 'My Tickets' },
    { to: '/cinemas', label: 'Cinemas' },
    { to: '/offers', label: 'Offers' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const { selectedSeats, selectedCombo } = useCart() || { selectedSeats: [], selectedCombo: null };
    const [rewards, setRewards] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const cartCount = (selectedSeats?.length || 0) + (selectedCombo ? 1 : 0);

    useEffect(() => {
        if (user) {
            fetchUserRewards(user.uid)
                .then(setRewards)
                .catch(err => console.error('Navbar rewards fetch failed:', err));
        } else {
            setRewards(null);
        }
    }, [user, location.pathname]);

    const isActive = (link) => link.exact
        ? location.pathname === link.to
        : location.pathname.startsWith(link.to);

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserMenu(false);
            setMenuOpen(false);
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                height: '72px',
                borderBottom: '1px solid rgba(225, 29, 72, 0.15)',
                background: 'rgba(18, 1, 1, 0.98)',
                backdropFilter: 'blur(20px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white' }}>
                    <span style={{ color: '#e11d48' }}><OmniViewLogo /></span>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>OmniView</span>
                </Link>

                {/* Nav Links (desktop) */}
                <nav className="desktop-only" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    {NAV_LINKS.map(link => {
                        const active = isActive(link);
                        return (
                            <Link key={link.to} to={link.to} style={{ position: 'relative', color: active ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: active ? 850 : 600, textDecoration: 'none', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {link.label}
                                {active && (
                                    <span style={{ position: 'absolute', bottom: '-8px', left: 0, right: 0, height: '2.5px', background: '#e11d48', boxShadow: '0 0 15px #e11d48' }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Cart indicator */}
                    {cartCount > 0 && (
                        <button onClick={() => navigate('/checkout')} style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            background: 'rgba(225, 29, 72, 0.2)', border: '1px solid rgba(225, 29, 72, 0.4)',
                            borderRadius: '999px', padding: '0.6rem 1.25rem', color: 'white',
                            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 800, transition: 'all 0.2s', boxShadow: '0 0 20px rgba(225, 29, 72, 0.2)'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>shopping_cart</span>
                            <span>{cartCount}</span>
                        </button>
                    )}

                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '999px', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                color: 'white', cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <div style={{ textAlign: 'right' }} className="desktop-only">
                                    <p style={{ fontSize: '0.8rem', fontWeight: 900, lineHeight: 1 }}>{user.displayName?.toUpperCase()}</p>
                                    <p style={{ fontSize: '0.65rem', color: '#e11d48', fontWeight: 800 }}>{rewards?.tier?.toUpperCase() || 'MEMBER'}</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', color: '#e11d48' }}>account_circle</span>
                            </button>

                            {showUserMenu && (
                                <div style={{
                                    position: 'absolute', top: '120%', right: 0, width: '220px',
                                    background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1.25rem',
                                    padding: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease-out'
                                }}>
                                    <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.5rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase' }}>Points Balance</p>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 950, color: '#e11d48', fontFamily: 'var(--font-display)' }}>{rewards?.points || 0} PTS</p>
                                    </div>
                                    <button onClick={() => { navigate('/rewards'); setShowUserMenu(false); }} className="user-menu-item">
                                        <span className="material-symbols-outlined">stars</span> Rewards Dashboard
                                    </button>
                                    <button onClick={() => { navigate('/my-tickets'); setShowUserMenu(false); }} className="user-menu-item">
                                        <span className="material-symbols-outlined">local_activity</span> My Bookings
                                    </button>
                                    {user.role === 'admin' && (
                                        <button onClick={() => { navigate('/admin'); setShowUserMenu(false); }} className="user-menu-item" style={{ color: '#e11d48' }}>
                                            <span className="material-symbols-outlined">admin_panel_settings</span> Management
                                        </button>
                                    )}
                                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0.5rem 0' }} />
                                    <button onClick={handleLogout} className="user-menu-item" style={{ color: '#ef4444' }}>
                                        <span className="material-symbols-outlined">logout</span> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setShowAuth(true)} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>login</span> Sign In
                        </button>
                    )}

                    {/* Mobile menu toggle */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-only" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>{menuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            {menuOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99, background: '#120101',
                    padding: '80px 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    {NAV_LINKS.map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 900, color: isActive(link) ? '#e11d48' : 'white', textDecoration: 'none', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                            {link.label}
                        </Link>
                    ))}
                    {!user && (
                        <button onClick={() => { setShowAuth(true); setMenuOpen(false); }} className="btn-primary" style={{ marginTop: 'auto', width: '100%' }}>Get Started</button>
                    )}
                </div>
            )}

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

            <style>{`
                .user-menu-item {
                    width: 100%; display: flex; alignItems: center; gap: 0.75rem;
                    padding: 0.75rem 1rem; border: none; background: none;
                    color: #374151; font-size: 0.9rem; font-weight: 700; cursor: pointer;
                    border-radius: 0.75rem; transition: all 0.2s; text-align: left;
                }
                .user-menu-item:hover { background: rgba(0,0,0,0.05); }
                .user-menu-item span { font-size: 1.25rem; }
                
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                }
                @media (min-width: 769px) {
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </>
    );
}
