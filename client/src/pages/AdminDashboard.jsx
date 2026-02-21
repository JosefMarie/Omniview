import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
    { time: '9AM', revenue: 1200 }, { time: '11AM', revenue: 3400 }, { time: '1PM', revenue: 6700 },
    { time: '3PM', revenue: 5200 }, { time: '5PM', revenue: 9100 }, { time: '7PM', revenue: 11800 },
    { time: '9PM', revenue: 14500 },
];

const halls = [
    { name: 'Hall 01', movie: 'Dune: Part Two', format: 'IMAX', pct: 78, seats: Array.from({ length: 30 }, (_, i) => i < 23 ? 'occupied' : 'available') },
    { name: 'Hall 02', movie: 'Oppenheimer', format: '2D', pct: 45, seats: Array.from({ length: 30 }, (_, i) => i < 13 ? 'occupied' : 'available') },
    { name: 'Hall 03', movie: 'The Dark Knight', format: 'Dolby', pct: 94, seats: Array.from({ length: 30 }, (_, i) => i < 28 ? 'occupied' : 'available') },
    { name: 'Hall 04', movie: 'Interstellar', format: '2D', pct: 22, seats: Array.from({ length: 30 }, (_, i) => i < 6 ? 'occupied' : 'available') },
];

const ALERTS = [
    { severity: 'high', icon: 'warning', msg: 'Hall 03 — projection flicker reported.', time: '2m ago' },
    { severity: 'medium', icon: 'groups', msg: 'Hall 01 — 95% capacity. Consider overflow.', time: '8m ago' },
    { severity: 'low', icon: 'info', msg: 'Concession stock low: Nachos & Salsa.', time: '15m ago' },
];

const SIDEBAR_ITEMS = [
    { icon: 'dashboard', label: 'Dashboard', active: true },
    { icon: 'analytics', label: 'Analytics' },
    { icon: 'event', label: 'Scheduling' },
    { icon: 'confirmation_number', label: 'Ticketing' },
    { icon: 'restaurant', label: 'Concessions' },
    { icon: 'supervised_user_circle', label: 'Staff' },
    { icon: 'settings', label: 'Settings' },
];

export default function AdminDashboard() {
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#131022', overflow: 'hidden' }}>

            {/* Sidebar */}
            <aside style={{
                width: sidebarCollapsed ? '72px' : '240px', flexShrink: 0, background: '#1d1c27',
                borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease', overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem', height: '68px' }}>
                    <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '0.625rem', background: '#3211d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>theaters</span>
                    </div>
                    {!sidebarCollapsed && <span style={{ fontWeight: 900, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>OmniView Admin</span>}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', overflowX: 'hidden' }}>
                    {SIDEBAR_ITEMS.map(item => (
                        <button key={item.label} onClick={() => setActiveNav(item.label)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem',
                            borderRadius: '0.75rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: activeNav === item.label ? 'rgba(242,166,13,0.1)' : 'transparent',
                            color: activeNav === item.label ? '#f2a60d' : '#a19db9',
                            fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', fontFamily: 'Be Vietnam Pro, sans-serif',
                            whiteSpace: 'nowrap', overflow: 'hidden',
                        }}
                            onMouseEnter={e => { if (activeNav !== item.label) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'white'; } }}
                            onMouseLeave={e => { if (activeNav !== item.label) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a19db9'; } }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                            {!sidebarCollapsed && item.label}
                        </button>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 0.75rem',
                        background: 'none', border: 'none', color: '#a19db9', cursor: 'pointer', borderRadius: '0.5rem',
                        fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Be Vietnam Pro, sans-serif',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', transform: sidebarCollapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }}>
                            keyboard_double_arrow_left
                        </span>
                        {!sidebarCollapsed && 'Collapse'}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Topbar */}
                <header style={{ height: '68px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: 'rgba(19,16,34,0.95)', backdropFilter: 'blur(10px)', flexShrink: 0 }}>
                    <div>
                        <h2 style={{ fontWeight: 900, fontSize: '1.1rem' }}>Analytics Dashboard</h2>
                        <p style={{ color: '#a19db9', fontSize: '0.75rem' }}>Real-time data · February 22, 2024</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '0.3rem 0.75rem' }}>
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s ease-in-out infinite' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e' }}>Live</span>
                        </div>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3211d4, #7b5ea7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer' }}>
                            A
                        </div>
                    </div>
                    <style>{`@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>
                </header>

                {/* Scrollable content area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>

                    {/* KPI Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {[
                            { icon: 'attach_money', label: "Today's Revenue", value: '$14,520', change: '+12.3%', up: true },
                            { icon: 'confirmation_number', label: 'Tickets Sold', value: '847', change: '+8.1%', up: true },
                            { icon: 'groups', label: 'Total Visitors', value: '1,204', change: '+5.7%', up: true },
                            { icon: 'theater_comedy', label: 'Avg Occupancy', value: '59.75%', change: '-2.1%', up: false },
                        ].map(k => (
                            <div key={k.label} style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#a19db9', fontSize: '1.3rem' }}>{k.icon}</span>
                                    <span style={{ fontSize: '0.72rem', color: k.up ? '#22c55e' : '#f87171', fontWeight: 700, background: k.up ? 'rgba(34,197,94,0.08)' : 'rgba(248,113,113,0.08)', borderRadius: '999px', padding: '0.15rem 0.4rem' }}>{k.change}</span>
                                </div>
                                <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>{k.value}</p>
                                <p style={{ color: '#a19db9', fontSize: '0.75rem', marginTop: '0.2rem' }}>{k.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main grid: Chart + Alerts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Revenue Chart */}
                        <div style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>Revenue Trend (Today)</h3>
                                <span style={{ color: '#a19db9', fontSize: '0.75rem' }}>9AM – 10PM</span>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3211d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3211d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" tick={{ fill: '#a19db9', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#a19db9', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                                    <Tooltip contentStyle={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3211d4" strokeWidth={2.5} fill="url(#revGradient)" dot={{ r: 3, fill: '#3211d4', strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Alerts */}
                        <div style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>Quick Alerts</h3>
                            {ALERTS.map((a, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.875rem',
                                    background: a.severity === 'high' ? 'rgba(248,113,113,0.06)' : a.severity === 'medium' ? 'rgba(242,166,13,0.06)' : 'rgba(50,17,212,0.06)',
                                    border: `1px solid ${a.severity === 'high' ? 'rgba(248,113,113,0.2)' : a.severity === 'medium' ? 'rgba(242,166,13,0.2)' : 'rgba(50,17,212,0.2)'}`,
                                    borderRadius: '0.75rem',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: a.severity === 'high' ? '#f87171' : a.severity === 'medium' ? '#f2a60d' : '#7b5ea7', flexShrink: 0, marginTop: '0.1rem' }}>{a.icon}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4 }}>{a.msg}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#a19db9', marginTop: '0.2rem' }}>{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hall Status Cards */}
                    <div style={{ background: '#1d1c27', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem' }}>Hall Status — Live</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {halls.map(hall => (
                                <div key={hall.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h4 style={{ fontWeight: 800, fontSize: '0.9rem' }}>{hall.name}</h4>
                                            <p style={{ color: '#a19db9', fontSize: '0.72rem', marginTop: '0.1rem' }}>{hall.movie}</p>
                                        </div>
                                        <span style={{ background: 'rgba(50,17,212,0.15)', color: '#7b5ea7', borderRadius: '0.3rem', padding: '0.15rem 0.35rem', fontSize: '0.6rem', fontWeight: 700 }}>{hall.format}</span>
                                    </div>

                                    {/* Mini heatmap */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px', marginBottom: '0.75rem' }}>
                                        {hall.seats.map((status, si) => (
                                            <div key={si} className="grid-dot" style={{ background: status === 'occupied' ? '#3211d4' : 'rgba(255,255,255,0.08)' }} />
                                        ))}
                                    </div>

                                    {/* Occupancy bar */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                                            <span style={{ color: '#a19db9' }}>Occupancy</span>
                                            <span style={{ fontWeight: 700, color: hall.pct > 80 ? '#f87171' : hall.pct > 50 ? '#f2a60d' : '#22c55e' }}>{hall.pct}%</span>
                                        </div>
                                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${hall.pct}%`, background: hall.pct > 80 ? '#f87171' : hall.pct > 50 ? '#f2a60d' : '#22c55e', borderRadius: '999px', transition: 'width 1s ease' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
