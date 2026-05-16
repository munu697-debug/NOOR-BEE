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
import SplashScreen from './components/SplashScreen';
import MobileBottomNav from './components/MobileBottomNav';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2800); // 2s duration + animation buffer
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
      {isAppLoading ? (
        <SplashScreen onComplete={() => setIsAppLoading(false)} />
      ) : (
        <motion.div 
          className="app-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <NavBar page={currentPage} />

          {currentPage === 'home' ? (
            <main className="main-content">
              <HeroSection />
              <TrustSection />
              <HealthBenefitsSection />
              <PackagesSection />
              <TestimonialsSection />
              <CoreValuesSection />
              <CraftsmanshipSection /> 
              <FAQSection />
              <Footer />
            </main>
          ) : currentPage === 'shop' ? (
            <main className="main-content shop-page">
              <ProductsSection />
            </main>
          ) : currentPage === 'profile' ? (
            <main className="main-content profile-page">
              <UserProfile />
            </main>
          ) : (
            <main className="main-content contact-page">
              <ContactSection />
            </main>
          )}

          <MobileBottomNav activeTab={currentPage} />
          <WishlistModal />
          <CartModal />
          <SpeedInsights />
        </motion.div>
      )}
    </CartProvider>
  );
}

export default App;
