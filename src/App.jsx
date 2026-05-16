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
import ContactSection from './components/ContactSection';
import CartModal from './components/CartModal';
import WishlistModal from './components/WishlistModal';
import UserProfile from './components/UserProfile';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import MobileBottomNav from './components/MobileBottomNav';
import MobileDashboard from './components/MobileDashboard';
import MobileMenu from './components/MobileMenu';
import { SpeedInsights } from '@vercelspeed-insights/react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user has seen the NEW onboarding
    const onboarded = localStorage.getItem('noorbee_onboarded_v2');
    if (onboarded) setIsOnboarded(true);

    const checkMobile = () => {
      const isMob = window.innerWidth <= 768;
      setIsMobile(isMob);
      if (!isMob) setIsAppLoading(false); // Desktop doesn't load splash
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Initial loading for mobile
    if (window.innerWidth <= 768) {
      if (!onboarded) {
        setIsAppLoading(true);
      } else {
        setIsAppLoading(false);
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#contact') setCurrentPage('contact');
      else if (hash === '#shop') setCurrentPage('shop');
      else if (hash === '#profile') setCurrentPage('profile');
      else if (hash === '#admin') setCurrentPage('admin');
      else if (hash === '#values' || hash === '#health' || hash === '#mission' || hash === '#vision') {
          // These will stay on home but scroll to section
          setCurrentPage('home');
          setTimeout(() => {
              const el = document.getElementById(hash.substring(1));
              if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
      else setCurrentPage('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    setIsAppLoading(false);
    localStorage.setItem('noorbee_onboarded_v2', 'true');
  };

  if (currentPage === 'admin') {
    return (
      <CartProvider>
        <AdminPanel />
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      {isAppLoading && isMobile && !isOnboarded ? (
        <SplashScreen onComplete={handleOnboardingComplete} />
      ) : (
        <motion.div 
          className="app-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NavBar 
            page={currentPage} 
            onSearch={setSearchQuery} 
            onMenuOpen={() => setIsMenuOpen(true)} 
          />
          
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          {isMobile && currentPage === 'home' ? (
            <main className="main-content">
                <MobileDashboard />
                <div id="values"><CoreValuesSection /></div>
                <div id="health"><HealthBenefitsSection /></div>
                <div id="mission"><CraftsmanshipSection /></div>
                <TestimonialsSection />
                <Footer />
            </main>
          ) : currentPage === 'home' ? (
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
              <ProductsSection searchQuery={searchQuery} />
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
