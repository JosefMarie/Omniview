const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --------------- Routes ---------------

// Movies
app.get('/api/movies', (req, res) => {
    res.json([
        { id: 'dune-2', title: 'Dune: Part Two', genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 46m' },
        { id: 'oppenheimer', title: 'Oppenheimer', genre: 'Drama', rating: 'R', duration: '3h 0m' },
    ]);
});

// Seats for a screening
app.get('/api/seats/:screeningId', (req, res) => {
    const { screeningId } = req.params;
    res.json({ screeningId, message: 'Seat data returned (use Firestore in production)' });
});

// Products (Snacks & combos)
app.get('/api/products', (req, res) => {
    res.json([
        { id: 'pop-lrg', name: 'Large Popcorn', category: 'popcorn', price: 12.50 },
        { id: 'pop-med', name: 'Medium Popcorn', category: 'popcorn', price: 9.50 },
        { id: 'coke-lrg', name: 'Coca-Cola Large', category: 'drink', price: 6.00 },
        { id: 'nachos', name: 'Nachos & Salsa', category: 'snack', price: 8.50 },
    ]);
});

// Create Order
app.post('/api/orders', async (req, res) => {
    const { userId, screeningId, seats, snackItems, comboId, totalPaid } = req.body;

    // Validate required fields
    if (!screeningId || !seats || seats.length === 0) {
        return res.status(400).json({ error: 'Missing required fields: screeningId or seats' });
    }

    // In production: verify seat availability via Firestore transaction, re-calculate total
    const orderId = `OMV-${Date.now().toString(36).toUpperCase()}`;

    res.status(201).json({
        success: true,
        orderId,
        message: 'Order created successfully. In production this writes to Firestore.',
        order: { orderId, userId, screeningId, seats, totalPaid, status: 'confirmed' },
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'OmniView Cinema API running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n🎬 OmniView Cinema API running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
