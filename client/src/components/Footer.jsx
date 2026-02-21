import React from 'react';
import { Link } from 'react-router-dom';

const OmniViewLogo = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
    </svg>
);

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '3rem 2.5rem',
            marginTop: 'auto',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>
                {/* Brand */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <span style={{ color: '#3211d4' }}><OmniViewLogo /></span>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>OmniView Cinema System</span>
                    </div>
                    <p style={{ color: '#a19db9', fontSize: '0.8rem', lineHeight: 1.6 }}>
                        Premium cinematic experiences delivered with cutting-edge technology and comfort.
                    </p>
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Navigation</p>
                        {['Schedule', 'Gift Cards', 'Membership'].map(label => (
                            <span key={label} style={{ color: '#a19db9', fontSize: '0.8rem', cursor: 'pointer' }}>{label}</span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Support</p>
                        {['Contact Us', 'FAQ', 'Lost & Found'].map(label => (
                            <span key={label} style={{ color: '#a19db9', fontSize: '0.8rem', cursor: 'pointer' }}>{label}</span>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['language', 'share', 'social_leaderboard'].map(icon => (
                            <span key={icon} className="material-symbols-outlined" style={{ color: '#a19db9', fontSize: '1.2rem', cursor: 'pointer' }}>{icon}</span>
                        ))}
                    </div>
                    <p style={{ color: '#a19db9', fontSize: '0.75rem' }}>© 2024 OmniView Cinema. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
