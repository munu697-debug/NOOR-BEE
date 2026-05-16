import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Filter, Heart, ChevronRight } from 'lucide-react';
import { db, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import './MobileDashboard.css';

const categories = [
    { id: 1, name: 'Munaka', icon: '/images/products/product1.png' },
    { id: 2, name: 'Clover', icon: '/images/products/product2.png' },
    { id: 3, name: 'Sidr', icon: '/images/products/product3.png' },
    { id: 4, name: 'Alfalfa', icon: '/images/products/product4.png' },
    { id: 5, name: 'Sidr', icon: '/images/products/product2.png' },
];

const MobileDashboard = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState({ name: 'Alex Polly' }); // Defaulting to Alex Polly as requested for psychology

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const unsub = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                setProducts(list.slice(0, 4));
            }
        });

        const unsubAuth = auth.onAuthStateChanged((u) => {
            if (u) setUser({ name: u.displayName || 'Alex Polly', photo: u.photoURL });
        });

        return () => { unsub(); unsubAuth(); };
    }, []);

    return (
        <div className="mobile-dashboard-wrap">
            {/* 2. WELCOME HEADER SECTION */}
            <header className="mobile-dash-header">
                <div className="user-profile-dash">
                    <div className="avatar-dash">
                        {user.photo ? <img src={user.photo} alt="Avatar" /> : <img src="/images/others/user-avatar.png" alt="Avatar" onError={(e) => e.target.src='https://ui-avatars.com/api/?name=Alex+Polly&background=f1a100&color=fff'} />}
                    </div>
                    <div className="welcome-text-dash">
                        <span className="welcome-label">Welcome Back</span>
                        <strong className="user-name-dash">{user.name}</strong>
                    </div>
                </div>
                <button className="notif-btn-dash" aria-label="Notifications">
                    <Bell size={24} strokeWidth={1.5} />
                    <span className="notif-dot"></span>
                </button>
            </header>

            {/* 3. SEARCH BAR SECTION */}
            <div className="dash-search-row">
                <div className="search-bar-dash">
                    <Search size={20} className="search-icon-dash" />
                    <input type="text" placeholder="Search..." />
                </div>
                <button className="filter-btn-dash">
                    <Filter size={20} />
                </button>
            </div>

            {/* 4. HERO PROMOTION CARD */}
            <motion.div 
                className="dash-hero-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="hero-card-content">
                    <h2 className="promo-title">Pure Honey Deals</h2>
                    <p className="promo-desc">Fresh, tasty honey at great prices.</p>
                    <button className="shop-now-dash-btn">Shop Now</button>
                    <div className="hero-special-badge">SPECIAL OFFER</div>
                </div>
                <div className="hero-card-img-wrap">
                    <img src="/images/logo/logo.png" alt="Honey Bee" className="dash-hero-bee-img" />
                </div>
            </motion.div>

            {/* 5. CATEGORY SECTION */}
            <section className="dash-section">
                <div className="dash-section-header">
                    <h3>Category</h3>
                    <button className="see-all-dash">See All</button>
                </div>
                <div className="dash-category-scroll">
                    {categories.map((cat, idx) => (
                        <motion.div 
                            key={idx} 
                            className={`dash-cat-item ${idx === 0 ? 'active' : ''}`}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="dash-cat-icon-circle">
                                <img src={cat.icon} alt={cat.name} />
                            </div>
                            <span className="cat-name-dash">{cat.name}</span>
                            <div className="cat-arrow-circle">
                                <ChevronRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. BEST OFFER SECTION */}
            <section className="dash-section">
                <div className="dash-section-header">
                    <h3>Best offer</h3>
                    <button className="see-all-dash">See All</button>
                </div>
                <div className="dash-products-grid">
                    {products.map(p => (
                        <div key={p.id} className="dash-prod-card">
                            <button className="dash-fav-heart-btn">
                                <Heart size={16} />
                            </button>
                            <div className="dash-prod-img-box">
                                <img src={p.image} alt={p.title} />
                            </div>
                            <div className="dash-prod-info-box">
                                <h4>{p.title}</h4>
                                <div className="dash-prod-price-row">
                                    <span className="dash-price-text">₹{p.price}</span>
                                    <div className="dash-rating-badge">⭐ {p.rating || '4.8'}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MobileDashboard;
