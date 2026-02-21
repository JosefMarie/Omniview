import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import SnackPage from './pages/SnackPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmedPage from './pages/BookingConfirmedPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOperational from './pages/AdminOperational';

const AppLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1d1c27',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'Be Vietnam Pro, sans-serif',
              },
            }}
          />
          <Routes>
            {/* Admin (no navbar/footer) */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ops" element={<AdminOperational />} />

            {/* Main app with Navbar + Footer */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/select-seats/:screeningId" element={<AppLayout><SeatSelectionPage /></AppLayout>} />
            <Route path="/snacks" element={<AppLayout><SnackPage /></AppLayout>} />
            <Route path="/checkout" element={<AppLayout><CheckoutPage /></AppLayout>} />
            <Route path="/booking-confirmed" element={<AppLayout><BookingConfirmedPage /></AppLayout>} />
            <Route path="/my-tickets" element={<AppLayout><MyTicketsPage /></AppLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
