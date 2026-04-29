const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { sendBookingConfirmation } = require('./emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin
let db;
try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-project-id') {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        if (privateKey) {
            privateKey = privateKey.replace(/\\n/g, '\n');
            if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                privateKey = privateKey.substring(1, privateKey.length - 1);
            }
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
        db = admin.firestore();
        console.log('✅ Firebase Admin initialized');
    } else {
        console.warn('⚠️ No Firebase credentials found. Running in Mock Mode.');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
}

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --------------- Helpers ---------------
const getCollection = async (collectionName, fallbackData) => {
    if (!db) return fallbackData;
    try {
        const snapshot = await db.collection(collectionName).get();
        if (snapshot.empty) return fallbackData;
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return fallbackData;
    }
};

// --------------- Routes ---------------

// Movies
app.get('/api/movies', async (req, res) => {
    const fallback = [
        { id: 'dune-2', title: 'Dune: Part Two', genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 46m', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge.' },
        { id: 'oppenheimer', title: 'Oppenheimer', genre: 'Drama', rating: 'R', duration: '3h 0m', poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop', description: 'The story of J. Robert Oppenheimer and the atomic bomb.' },
    ];
    const movies = await getCollection('movies', fallback);
    res.json(movies);
});

app.post('/api/movies', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        const docRef = await db.collection('movies').add(req.body);
        res.json({ id: docRef.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('movies').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('movies').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Products
app.get('/api/products', async (req, res) => {
    const fallback = [
        { id: 'pop-lrg', name: 'Large Popcorn', category: 'popcorn', price: 12.50 },
        { id: 'pop-med', name: 'Medium Popcorn', category: 'popcorn', price: 9.50 },
        { id: 'coke-lrg', name: 'Coca-Cola Large', category: 'drink', price: 6.00 },
        { id: 'nachos', name: 'Nachos & Salsa', category: 'snack', price: 8.50 },
    ];
    const products = await getCollection('products', fallback);
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        const docRef = await db.collection('products').add(req.body);
        res.json({ id: docRef.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('products').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('products').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Staff
app.get('/api/staff', async (req, res) => {
    const fallback = [
        { id: 's1', name: 'Alice Johnson', role: 'Manager', shift: 'Morning' },
        { id: 's2', name: 'Bob Smith', role: 'Projectionist', shift: 'Evening' },
    ];
    const staff = await getCollection('staff', fallback);
    res.json(staff);
});

app.post('/api/staff', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        const docRef = await db.collection('staff').add(req.body);
        res.json({ id: docRef.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/staff/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('staff').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('staff').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        if (!db) return res.json({ revenue: 14520, ticketsSold: 847, visitors: 1204, occupancy: 59.75 });
        const ordersSnapshot = await db.collection('orders').get();
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        const revenue = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
        const ticketsSold = orders.reduce((sum, o) => sum + (o.seats?.length || 0), 0);
        res.json({
            revenue: 14520 + revenue,
            ticketsSold: 847 + ticketsSold,
            visitors: 1204 + ordersSnapshot.size,
            occupancy: 62.5
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── Rewards Helpers ──────────────────────────────────────────────────────────
const TIER_THRESHOLDS = { Bronze: 0, Silver: 500, Gold: 2000, Platinum: 5000 };
const getTier = (pts) => {
    if (pts >= 5000) return 'Platinum';
    if (pts >= 2000) return 'Gold';
    if (pts >= 500)  return 'Silver';
    return 'Bronze';
};
const getPointsMultiplier = (format) => {
    if (['IMAX', 'Dolby Cinema'].includes(format)) return 2;
    if (format === '4DX') return 1.5;
    return 1;
};

// ─── Send FCM Push Notification ───────────────────────────────────────────────
const sendPushNotification = async (userId, title, body, data = {}) => {
    if (!db) return;
    try {
        const userSnap = await db.collection('users').doc(userId).get();
        const fcmToken = userSnap.data()?.fcmToken;
        if (!fcmToken) return;
        await admin.messaging().send({
            token: fcmToken,
            notification: { title, body },
            data,
            webpush: {
                notification: {
                    title, body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    requireInteraction: false,
                },
                fcmOptions: { link: '/' },
            },
        });
        console.log(`🔔 Push sent to user ${userId}: ${title}`);
    } catch (err) {
        console.error('🔔 Push failed:', err.message);
    }
};

// ─── Schedule Pre-Show Reminder ───────────────────────────────────────────────
const schedulePreShowReminder = (userId, movie, date, time) => {
    try {
        const [timePart, meridiem] = (time || '').split(' ');
        let [hours, minutes] = (timePart || '12:00').split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        const showDate = new Date(date);
        showDate.setHours(hours, minutes || 0, 0, 0);
        const reminderTime = showDate.getTime() - 60 * 60 * 1000; // 1 hour before
        const delay = reminderTime - Date.now();
        if (delay < 0) return; // Already past
        setTimeout(() => {
            sendPushNotification(userId, `🎬 Starting Soon: ${movie}`, `Your screening starts in 1 hour. Head to the cinema now!`, { type: 'reminder' });
        }, delay);
        console.log(`⏰ Reminder scheduled for ${movie} in ${Math.round(delay / 60000)} min`);
    } catch (err) {
        console.error('⏰ Reminder schedule failed:', err.message);
    }
};

// Orders
app.post('/api/orders', async (req, res) => {
    try {
        if (!db) return res.json({ success: true, orderId: `MOCK-${Date.now()}` });
        const order = {
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'confirmed',
        };
        const docRef = await db.collection('orders').add(order);
        const orderId = docRef.id;

        // ── 1. Send confirmation email (non-blocking)
        const emailResult = await sendBookingConfirmation({
            orderId,
            movie:      order.movie,
            hall:       order.hall,
            date:       order.date,
            time:       order.time,
            format:     order.format,
            seats:      order.seats,
            totalPaid:  order.totalPaid,
            userEmail:  order.userEmail,
            userName:   order.userName,
        });

        // ── 2. Earn OmniRewards points (non-blocking)
        let pointsEarned = 0;
        if (order.userId && order.userId !== 'guest' && order.totalPaid) {
            const multiplier = getPointsMultiplier(order.format);
            pointsEarned = Math.round(order.totalPaid * 10 * multiplier);
            try {
                const rewardRef = db.collection('rewards').doc(order.userId);
                const rewardSnap = await rewardRef.get();
                const historyEntry = {
                    type: 'earned',
                    points: pointsEarned,
                    reason: `${order.movie}${multiplier > 1 ? ` (${order.format} ${multiplier}×)` : ''}`,
                    orderId,
                    date: new Date().toISOString().split('T')[0],
                };
                if (rewardSnap.exists) {
                    const current = rewardSnap.data();
                    const newPoints = (current.points || 0) + pointsEarned;
                    await rewardRef.update({
                        points: newPoints,
                        lifetimePoints: (current.lifetimePoints || 0) + pointsEarned,
                        tier: getTier(newPoints),
                        history: admin.firestore.FieldValue.arrayUnion(historyEntry),
                    });
                } else {
                    await rewardRef.set({
                        userId: order.userId,
                        points: pointsEarned,
                        lifetimePoints: pointsEarned,
                        tier: getTier(pointsEarned),
                        history: [historyEntry],
                    });
                }
                console.log(`⭐ ${pointsEarned} points earned for user ${order.userId}`);
            } catch (err) {
                console.error('⭐ Rewards earn failed:', err.message);
            }
        }

        // ── 3. Send FCM push notification + schedule reminder (non-blocking)
        if (order.userId && order.userId !== 'guest') {
            sendPushNotification(
                order.userId,
                `🎬 Booking Confirmed: ${order.movie}`,
                `${order.seats?.length} seat(s) · ${order.time} · ${order.hall}${pointsEarned > 0 ? ` · +${pointsEarned} OmniPoints!` : ''}`,
                { type: 'booking', orderId }
            );
            if (order.date && order.time) {
                schedulePreShowReminder(order.userId, order.movie, order.date, order.time);
            }
        }

        res.json({
            success: true,
            orderId,
            pointsEarned,
            emailSent: !!emailResult,
            ...(emailResult?.previewUrl ? { emailPreview: emailResult.previewUrl } : {}),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        if (!db) return res.json([]);
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        if (!db) return res.json([]);
        const snapshot = await db.collection('orders')
            .where('userId', '==', req.params.userId)
            .get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/screening/:screeningId', async (req, res) => {
    try {
        if (!db) return res.json([]);
        const snapshot = await db.collection('orders')
            .where('screeningId', '==', req.params.screeningId)
            .where('status', 'in', ['confirmed', 'checked-in'])
            .get();
        
        let bookedSeats = [];
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.seats && Array.isArray(data.seats)) {
                bookedSeats = bookedSeats.concat(data.seats);
            }
        });
        
        res.json({ bookedSeats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.put('/api/orders/:id', async (req, res) => {
    try {
        if (!db) return res.json({ success: true });
        await db.collection('orders').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});



// ─── Rewards Endpoints ────────────────────────────────────────────────────────
app.get('/api/rewards/:userId', async (req, res) => {
    try {
        if (!db) return res.json({ points: 0, tier: 'Bronze', lifetimePoints: 0, history: [] });
        const snap = await db.collection('rewards').doc(req.params.userId).get();
        if (!snap.exists) return res.json({ points: 0, tier: 'Bronze', lifetimePoints: 0, history: [] });
        res.json(snap.data());
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/rewards/:userId/redeem', async (req, res) => {
    try {
        if (!db) return res.json({ success: false, message: 'DB not available' });
        const rewardRef = db.collection('rewards').doc(req.params.userId);
        const snap = await rewardRef.get();
        if (!snap.exists || (snap.data().points || 0) < 500)
            return res.status(400).json({ success: false, message: 'Insufficient points. Need at least 500.' });
        const current = snap.data();
        const newPoints = current.points - 500;
        const historyEntry = { type: 'redeemed', points: -500, reason: '$5 discount redemption', date: new Date().toISOString().split('T')[0] };
        await rewardRef.update({
            points: newPoints,
            tier: getTier(newPoints),
            history: admin.firestore.FieldValue.arrayUnion(historyEntry),
        });
        res.json({ success: true, newPoints, discount: 5 });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ─── Notification Registration ─────────────────────────────────────────────────
app.post('/api/notifications/register', async (req, res) => {
    try {
        const { userId, fcmToken } = req.body;
        if (!userId || !fcmToken) return res.status(400).json({ error: 'userId and fcmToken required' });
        if (db) {
            await db.collection('users').doc(userId).set({ fcmToken }, { merge: true });
        }
        console.log(`🔔 FCM token registered for user ${userId}`);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});



// --------------- Screenings ---------------

app.get('/api/screenings', async (req, res) => {
    try {
        if (!db) return res.json([]);
        let query = db.collection('screenings');
        if (req.query.movieId) query = query.where('movieId', '==', req.query.movieId);
        if (req.query.date) query = query.where('date', '==', req.query.date);
        const snapshot = await query.get();
        const screenings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/screenings', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        const screening = {
            ...req.body,
            createdAt: new Date().toISOString(),
            bookedSeats: [],
        };
        const docRef = await db.collection('screenings').add(screening);
        res.json({ id: docRef.id, ...screening });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/screenings/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('screenings').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/screenings/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Firestore not connected' });
        await db.collection('screenings').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pricing helper  — called on checkout to get authoritative price
const calculateSeatPrice = (format, time) => {
    let base = 12.00;
    // Format surcharge
    if (format === 'IMAX') base = 20.00;
    else if (format === 'Dolby Cinema') base = 17.00;
    else if (format === '4DX') base = 22.00;
    else if (format === '3D') base = 14.00;
    // Matinee discount: before 4 PM = 15% off
    try {
        const [timePart, meridiem] = (time || '').split(' ');
        let [hours] = timePart.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        if (hours < 16) base = Math.round(base * 0.85 * 100) / 100;
    } catch {}
    return base;
};

app.get('/api/screenings/:id/price', (req, res) => {
    const { format, time } = req.query;
    res.json({ price: calculateSeatPrice(format, time) });
});

app.get('/', (req, res) => {
    res.send(`<h1 style="color: #3211d4; text-align: center; font-family: sans-serif; padding-top: 50px;">🎬 OmniView Cinema API: Online</h1>`);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', firebase: !!db, timestamp: new Date().toISOString() });
});

// Seed
app.post('/api/seed', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Firebase not connected' });
    try {
        const batch = db.batch();
        const moviesData = [
            {
                title: 'Dune: Part Two',
                genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 46m',
                poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
                description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
                trailerId: 'Way9Dexny3w',
            },
            {
                title: 'Oppenheimer',
                genre: 'Drama', rating: 'R', duration: '3h 0m',
                poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
                description: 'The story of J. Robert Oppenheimer and his role in the development of the first nuclear weapons during World War II.',
                trailerId: 'uYPbbksJxIg',
            },
            {
                title: 'The Dark Knight',
                genre: 'Action', rating: 'PG-13', duration: '2h 32m',
                poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
                description: 'Batman raises the stakes in his war on crime when the Joker, a sadistic criminal mastermind, wreaks chaos across Gotham City.',
                trailerId: 'EXeTwQWrcwY',
            },
        ];

        const movieRefs = moviesData.map(() => db.collection('movies').doc());
        moviesData.forEach((m, i) => batch.set(movieRefs[i], m));

        // Screenings as separate relational documents
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const screeningsData = [
            { movieId: movieRefs[0].id, movieTitle: 'Dune: Part Two', hall: 'IMAX Hall 1', format: 'IMAX', date: today, time: '2:30 PM', basePrice: 20.00, bookedSeats: [] },
            { movieId: movieRefs[0].id, movieTitle: 'Dune: Part Two', hall: 'IMAX Hall 1', format: 'IMAX', date: today, time: '8:00 PM', basePrice: 20.00, bookedSeats: [] },
            { movieId: movieRefs[0].id, movieTitle: 'Dune: Part Two', hall: 'Hall 3', format: '2D', date: tomorrow, time: '11:00 AM', basePrice: 10.20, bookedSeats: [] },
            { movieId: movieRefs[1].id, movieTitle: 'Oppenheimer', hall: 'Dolby Cinema', format: 'Dolby Cinema', date: today, time: '6:00 PM', basePrice: 17.00, bookedSeats: [] },
            { movieId: movieRefs[1].id, movieTitle: 'Oppenheimer', hall: 'Hall 2', format: '2D', date: tomorrow, time: '1:00 PM', basePrice: 10.20, bookedSeats: [] },
            { movieId: movieRefs[2].id, movieTitle: 'The Dark Knight', hall: '4DX Hall', format: '4DX', date: today, time: '9:30 PM', basePrice: 22.00, bookedSeats: [] },
            { movieId: movieRefs[2].id, movieTitle: 'The Dark Knight', hall: 'Hall 4', format: '3D', date: tomorrow, time: '4:00 PM', basePrice: 14.00, bookedSeats: [] },
        ];
        screeningsData.forEach(s => batch.set(db.collection('screenings').doc(), { ...s, createdAt: new Date().toISOString() }));

        const products = [
            { name: 'Large Popcorn', category: 'popcorn', price: 12.50 },
            { name: 'Medium Popcorn', category: 'popcorn', price: 9.50 },
            { name: 'Nachos & Salsa', category: 'snack', price: 8.50 },
            { name: 'Coca-Cola Large', category: 'drink', price: 6.00 },
            { name: 'Coca-Cola Medium', category: 'drink', price: 4.50 },
            { name: 'Water Bottle', category: 'drink', price: 3.00 },
            { name: 'Candy Bundle', category: 'snack', price: 5.50 },
        ];
        products.forEach(p => batch.set(db.collection('products').doc(), p));

        const staff = [
            { name: 'Alice Johnson', role: 'General Manager', shift: 'Morning' },
            { name: 'Bob Smith', role: 'Head Projectionist', shift: 'Evening' },
            { name: 'Charlie Davis', role: 'Concessions Lead', shift: 'Afternoon' },
            { name: 'Diana Lee', role: 'Ticketing Supervisor', shift: 'Morning' },
        ];
        staff.forEach(s => batch.set(db.collection('staff').doc(), s));

        await batch.commit();
        res.json({ message: 'Database seeded successfully with relational screenings!' });
    } catch (error) {
        res.status(500).json({ error: 'Seeding failed', details: error.message });
    }
});

app.listen(PORT, () => console.log(`🎬 API: http://localhost:${PORT}`));



