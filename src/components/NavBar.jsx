import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './NavBar.css';

const NavBar = ({ page = 'home', onSearch }) => {
  const { getTotalItems, setIsCartOpen, wishlistItems, setIsWishlistOpen } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  return (
    <header className={`navbar glass navbar-top`}>
      <div className="navbar-container">
        <div className="nav-logo">
          <a href="/">
            <img src="/images/logo/logo.png" alt="Noor Bee Logo" className="nav-logo-icon" />
            <span className="nav-brand-name">NOOR BEE</span>
          </a>
        </div>

        <nav className="nav-links desktop-only">
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#story">Our Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          {isSearchOpen && (
            <motion.div 
              className="search-container-nav"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
            >
              <input 
                type="text" 
                placeholder="Search products..." 
                className="nav-search-input"
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch?.(e.target.value);
                  if (e.target.value && window.location.hash !== '#shop') {
                    window.location.hash = '#shop';
                  }
                }}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
            </motion.div>
          )}
          
          <button 
            className="icon-btn search-btn" 
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>
          
          <button 
            className="icon-btn cart-btn desktop-only" 
            aria-label="Wishlist"
            onClick={() => setIsWishlistOpen(true)}
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </button>

          <a href="#profile" className="icon-btn desktop-only" aria-label="User Profile">
            <User size={20} />
          </a>

          <button 
            className="icon-btn cart-btn cart-icon-wrapper" 
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            <span className="cart-badge">{cartCount}</span>
          </button>

          <button className="icon-btn mobile-only hamburger" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
