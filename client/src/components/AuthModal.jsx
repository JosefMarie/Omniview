import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OmniViewLogo = () => (
    <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '2rem' }}>confirmation_number</span>
);

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
    const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forgotMode, setForgotMode] = useState(false);

    const { login, signup, loginWithGoogle, resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (forgotMode) {
                await resetPassword(email);
                toast.success('Password reset email sent!');
                setForgotMode(false);
            } else if (mode === 'signup') {
                await signup(email, password, displayName);
                toast.success('Account created! Welcome to OmniView 🎬');
                onSuccess?.();
                onClose();
            } else {
                await login(email, password);
                toast.success('Welcome back!');
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            toast.error(err.message?.replace('Firebase: ', '').replace(/\(auth.*\)/, '') || 'Something went wrong');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Signed in with Google!');
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error('Google sign-in failed');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            {/* Blurred bg */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />

            <div className="modal-content glass" style={{ position: 'relative', zIndex: 1 }}>
                {/* Close button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    background: 'none', border: 'none', color: '#a19db9', cursor: 'pointer', fontSize: '1.25rem'
                }}>
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex', background: '#3211d4', borderRadius: '0.875rem',
                        padding: '0.75rem', marginBottom: '1rem', boxShadow: '0 8px 24px rgba(50,17,212,0.3)',
                    }}>
                        <OmniViewLogo />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                        {forgotMode ? 'Reset Password' : mode === 'login' ? 'OmniView' : 'Create Account'}
                    </h1>
                    <p style={{ color: '#a19db9', marginTop: '0.4rem', fontSize: '0.9rem' }}>
                        {forgotMode ? 'Enter your email to receive a reset link' : mode === 'login' ? 'Welcome back, Movie Lover' : 'Your cinematic journey starts here'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {mode === 'signup' && !forgotMode && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Full Name</label>
                            <input
                                type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                                className="form-input" placeholder="e.g. John Doe" required
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email Address</label>
                        <input
                            type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="form-input" placeholder="Enter your email" required
                        />
                    </div>
                    {!forgotMode && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    className="form-input" placeholder="Enter your password" required
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: '#a19db9', cursor: 'pointer',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'login' && !forgotMode && (
                        <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                            <button type="button" onClick={() => setForgotMode(true)} style={{
                                background: 'none', border: 'none', color: '#a19db9', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline'
                            }}>Forgot Password?</button>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', height: '52px', fontSize: '1rem' }}>
                        {loading ? 'Please wait...' : forgotMode ? 'Send Reset Email' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {!forgotMode && (
                    <>
                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <span style={{ color: '#a19db9', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or continue with</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        {/* Google */}
                        <button onClick={handleGoogle} disabled={loading} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            width: '100%', height: '48px', borderRadius: '0.75rem',
                            border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                            color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                <path d="M3.964 10.707C3.784 10.167 3.682 9.6 3.682 9c0-.6.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9c0 1.45.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Toggle */}
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a19db9', fontSize: '0.85rem' }}>
                            {mode === 'login' ? "New to OmniView? " : 'Already have an account? '}
                            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{
                                background: 'none', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                            }}>
                                {mode === 'login' ? 'Create an account' : 'Sign in'}
                            </button>
                        </p>
                    </>
                )}

                {forgotMode && (
                    <p style={{ textAlign: 'center', marginTop: '1rem', color: '#a19db9', fontSize: '0.85rem' }}>
                        <button onClick={() => setForgotMode(false)} style={{
                            background: 'none', border: 'none', color: '#3211d4', cursor: 'pointer', fontWeight: 600
                        }}>← Back to login</button>
                    </p>
                )}
            </div>
        </div>
    );
}
