import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';

const OmniViewLogo = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
    </svg>
);

export default function Navbar() {
    const { user, logout } = useAuth();
    const { selectedSeats, selectedCombo } = useCart();
    const [showAuth, setShowAuth] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const cartCount = selectedSeats.length + (selectedCombo ? 1 : 0);

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2.5rem',
                height: '68px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(19,16,34,0.95)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white' }}>
                    <span style={{ color: '#3211d4' }}><OmniViewLogo /></span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>OmniView Cinema</span>
                </Link>

                {/* Nav Links (desktop) */}
                <nav style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
                    {[['/', 'Movies'], ['/my-tickets', 'My Tickets'], ['#', 'Cinemas'], ['#', 'Offers']].map(([href, label]) => (
                        <Link key={label} to={href} style={{
                            color: '#a19db9', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s'
                        }}
                            onMouseEnter={e => e.target.style.color = 'white'}
                            onMouseLeave={e => e.target.style.color = '#a19db9'}
                        >{label}</Link>
                    ))}
                </nav>

                {/* Right section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Cart indicator */}
                    {cartCount > 0 && (
                        <button onClick={() => navigate('/checkout')} style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'rgba(50,17,212,0.15)', border: '1px solid rgba(50,17,212,0.4)',
                            borderRadius: '999px', padding: '0.4rem 0.9rem', color: '#a19db9',
                            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>shopping_cart</span>
                            {cartCount}
                        </button>
                    )}

                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '999px', padding: '0.4rem 1rem 0.4rem 0.4rem', cursor: 'pointer', color: 'white',
                            }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3211d4, #6d3fdb)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.8rem',
                                }}>
                                    {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.displayName?.split(' ')[0] || 'User'}</span>
                            </button>

                            {showUserMenu && (
                                <div style={{
                                    position: 'absolute', top: '110%', right: 0, minWidth: '180px',
                                    background: '#1d1c27', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                                }}>
                                    <Link to="/my-tickets" onClick={() => setShowUserMenu(false)} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.75rem 1rem', color: '#a19db9', textDecoration: 'none',
                                        fontSize: '0.875rem', transition: 'background 0.2s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>confirmation_number</span>
                                        My Tickets
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setShowUserMenu(false)} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.75rem 1rem', color: '#a19db9', textDecoration: 'none',
                                            fontSize: '0.875rem',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>dashboard</span>
                                            Admin
                                        </Link>
                                    )}
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />
                                    <button onClick={handleLogout} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                        padding: '0.75rem 1rem', color: '#f87171', background: 'none', border: 'none',
                                        cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setShowAuth('login')} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                                Login
                            </button>
                            <button onClick={() => setShowAuth('signup')} className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {showAuth && (
                <AuthModal
                    initialMode={showAuth}
                    onClose={() => setShowAuth(false)}
                />
            )}
        </>
    );
}
