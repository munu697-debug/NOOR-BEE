import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import CoreValuesSection from './components/CoreValuesSection';
import HealthBenefitsSection from './components/HealthBenefitsSection';
import PackagesSection from './components/PackagesSection';
import CraftsmanshipSection from './components/CraftsmanshipSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import TrustSection from './components/TrustSection';
import DeliveryWidget from './components/DeliveryWidget';
import ContactSection from './components/ContactSection';
import CartModal from './components/CartModal';
import WishlistModal from './components/WishlistModal';
import UserProfile from './components/UserProfile';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to allow animation assets to begin buffering
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#contact') {
        setCurrentPage('contact');
      } else if (window.location.hash === '#shop') {
        setCurrentPage('shop');
      } else if (window.location.hash === '#profile') {
        setCurrentPage('profile');
      } else if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Admin panel renders standalone (no navbar/footer)
  if (currentPage === 'admin') {
    return (
      <CartProvider>
        <AdminPanel />
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="app-container">
        <NavBar page={currentPage} />

        {currentPage === 'home' ? (
          <main className="main-content">
            {/* 1. Header & Hero Section */}
            <HeroSection />

            {/* 2. Trust Banner (Infinite Marquee) */}
            <TrustSection />

            {/* 3. Health Benefits */}
            <HealthBenefitsSection />

            {/* 4. Bundles & Gifting */}
            <PackagesSection />

            {/* 6. Social Proof */}
            <TestimonialsSection />

            {/* 7. Brand Story */}
            <CoreValuesSection />
            <CraftsmanshipSection /> 

            {/* 8. FAQ */}
            <FAQSection />

            <Footer />
          </main>
        ) : currentPage === 'shop' ? (
          <main className="main-content" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <ProductsSection />
          </main>
        ) : currentPage === 'profile' ? (
          <main className="main-content" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <UserProfile />
          </main>
        ) : (
          <main className="main-content contact-page">
            <ContactSection />
          </main>
        )}

        <WishlistModal />
        <CartModal />
        <SpeedInsights />
      </div>
    </CartProvider>
  );
}

export default App;
