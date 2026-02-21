import React, { useState } from 'react';

const SCREENINGS = [
    { hall: 'Hall 01 — IMAX', movies: [{ title: 'Dune: Part Two', start: '10:00', end: '12:45', left: 40, width: 250 }, { title: 'Dune: Part Two', start: '14:30', end: '17:15', left: 350, width: 250 }, { title: 'Dune: Part Two', start: '19:00', end: '21:45', left: 650, width: 250 }] },
    { hall: 'Hall 02 — 2D', movies: [{ title: 'Oppenheimer', start: '11:00', end: '14:00', left: 100, width: 280 }, { title: 'The Dark Knight', start: '16:00', end: '18:30', left: 450, width: 230 }, { title: 'Oppenheimer', start: '20:15', end: '23:15', left: 750, width: 280 }] },
    { hall: 'Hall 03 — 2D', movies: [{ title: 'Interstellar', start: '13:00', end: '15:50', left: 220, width: 260 }, { title: 'Poor Things', start: '18:00', end: '20:20', left: 550, width: 220 }] },
];

const ACTIONS = [
    { icon: 'payments', title: 'Update Pricing', desc: 'Modify tier rates across all halls.' },
    { icon: 'add_to_photos', title: 'Add Movie', desc: 'CMS entry for new releases & posters.' },
    { icon: 'bar_chart_4_bars', title: 'Sales Report', desc: 'Export PDF of daily performance.' },
];

const ACTIVITY = [
    { user: 'Sarah J.', action: 'Booked Hall 01', seats: 'H12, H13', time: 'Just now' },
    { user: 'System', action: 'Hall 03 Cleaned', seats: null, time: '5m ago' },
    { user: 'Mike T.', action: 'Snacks Collected', seats: 'Order #A1B2', time: '12m ago' },
    { user: 'System', action: 'Low Stock Alert', seats: 'Popcorn Kernels', time: '22m ago' },
];

export default function AdminOperational() {
    const [activeTab, setActiveTab] = useState('Scheduling');

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#131022', overflow: 'hidden' }}>
            <aside style={{ width: '240px', flexShrink: 0, background: '#1d1c27', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem', height: '68px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '0.625rem', background: '#3211d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>theaters</span>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>OmniView Admin</span>
                </div>
                <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Dashboard', 'Analytics', 'Scheduling', 'Ticketing', 'Settings'].map(label => (
                        <button key={label} onClick={() => setActiveTab(label)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                            borderRadius: '0.75rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: activeTab === label ? 'rgba(242,166,13,0.1)' : 'transparent',
                            color: activeTab === label ? '#f2a60d' : '#a19db9',
                            fontWeight: 600, fontSize: '0.875rem', fontFamily: 'Be Vietnam Pro',
                        }}>{label}</button>
                    ))}
                </nav>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <header style={{ height: '68px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: 'rgba(19,16,34,0.95)' }}>
                    <h2 style={{ fontWeight: 900, fontSize: '1.1rem' }}>Operational Control</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#a19db9', fontSize: '0.8rem' }}>21 Feb 2024</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3211d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <section>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Quick Actions</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                {ACTIONS.map(a => (
                                    <div key={a.title} style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#f2a60d', marginBottom: '0.5rem' }}>{a.icon}</span>
                                        <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{a.title}</h4>
                                        <p style={{ color: '#a19db9', fontSize: '0.75rem', lineHeight: 1.4 }}>{a.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Hall Scheduling</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <div style={{ minWidth: '900px' }}>
                                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ width: '180px', flexShrink: 0, padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#a19db9', fontWeight: 700 }}>HALL / TIME</div>
                                        <div style={{ flex: 1, display: 'flex' }}>
                                            {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map(t => (
                                                <div key={t} style={{ flex: 1, padding: '0.75rem', fontSize: '0.7rem', color: '#6d6a8a', textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                    {SCREENINGS.map(h => (
                                        <div key={h.hall} style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', height: '100px' }}>
                                            <div style={{ width: '180px', flexShrink: 0, padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{h.hall}</h4>
                                            </div>
                                            <div style={{ flex: 1, position: 'relative', background: 'repeating-linear-gradient(90deg, transparent, transparent 150px, rgba(255,255,255,0.02) 150px, rgba(255,255,255,0.02) 151px)' }}>
                                                {h.movies.map((m, i) => (
                                                    <div key={i} style={{
                                                        position: 'absolute', top: '15px', left: `${m.left}px`, width: `${m.width}px`, height: '70px',
                                                        background: '#131022', borderLeft: '4px solid #f2a60d', borderRadius: '0.5rem',
                                                        padding: '0.75rem', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', cursor: 'grab',
                                                    }}>
                                                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.2rem' }}>{m.title}</h5>
                                                        <p style={{ fontSize: '0.65rem', color: '#f2a60d', fontWeight: 700 }}>{m.start} — {m.end}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </main>

                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <section style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.25rem' }}>Live Activity</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {ACTIVITY.map((a, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f2a60d', marginTop: '0.4rem', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <p><strong style={{ color: 'white' }}>{a.user}</strong> <span style={{ color: '#a19db9' }}>{a.action}</span></p>
                                            {a.seats && <p style={{ fontSize: '0.7rem', color: '#f2a60d', marginTop: '0.1rem' }}>{a.seats}</p>}
                                            <p style={{ color: '#6d6a8a', fontSize: '0.7rem', marginTop: '0.25rem' }}>{a.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
