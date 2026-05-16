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
    { id: 5, name: 'Kashmir', icon: '/images/products/product1.png' },
];

const MobileDashboard = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState({ name: 'Guest' });

    useEffect(() => {
        // Fetch products for "Best Offer"
        const productsRef = ref(db, 'products');
        const unsub = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                setProducts(list.slice(0, 4));
            }
        });

        // Listen for auth state
        const unsubAuth = auth.onAuthStateChanged((u) => {
            if (u) setUser({ name: u.displayName || 'Alex Polly', photo: u.photoURL });
        });

        return () => { unsub(); unsubAuth(); };
    }, []);

    return (
        <div className="mobile-dashboard-wrap">
            {/* Header */}
            <header className="mobile-dash-header">
                <div className="user-profile-dash">
                    <div className="avatar-dash">
                        {user.photo ? <img src={user.photo} alt="Avatar" /> : <span>{user.name.charAt(0)}</span>}
                    </div>
                    <div className="welcome-text-dash">
                        <span>Welcome Back</span>
                        <strong>{user.name}</strong>
                    </div>
                </div>
                <button className="notif-btn-dash">
                    <Bell size={22} />
                    <span className="notif-dot"></span>
                </button>
            </header>

            {/* Search */}
            <div className="dash-search-row">
                <div className="search-bar-dash">
                    <Search size={18} className="search-icon-dash" />
                    <input type="text" placeholder="Search..." />
                </div>
                <button className="filter-btn-dash">
                    <Filter size={18} />
                </button>
            </div>

            {/* Hero Card */}
            <motion.div 
                className="dash-hero-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="hero-card-content">
                    <h2>Pure Honey Deals</h2>
                    <p>Fresh, tasty honey at great prices.</p>
                    <button className="shop-now-dash">Shop Now</button>
                    <div className="hero-special-badge">SPECIAL OFFER</div>
                </div>
                <div className="hero-card-img">
                    <img src="/images/logo/logo.png" alt="Bee" className="dash-hero-bee" />
                </div>
            </motion.div>

            {/* Categories */}
            <section className="dash-section">
                <div className="dash-section-header">
                    <h3>Category</h3>
                    <button className="see-all-dash">See All</button>
                </div>
                <div className="dash-category-scroll">
                    {categories.map((cat, idx) => (
                        <motion.div 
                            key={cat.id} 
                            className={`dash-cat-item ${idx === 0 ? 'active' : ''}`}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="dash-cat-icon">
                                <img src={cat.icon} alt={cat.name} />
                            </div>
                            <span>{cat.name}</span>
                            <ChevronRight size={14} className="cat-arrow-dash" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Best Offer */}
            <section className="dash-section">
                <div className="dash-section-header">
                    <h3>Best offer</h3>
                    <button className="see-all-dash">See All</button>
                </div>
                <div className="dash-products-grid">
                    {products.map(p => (
                        <div key={p.id} className="dash-prod-card">
                            <button className="dash-fav-btn">
                                <Heart size={16} />
                            </button>
                            <div className="dash-prod-img">
                                <img src={p.image} alt={p.title} />
                            </div>
                            <div className="dash-prod-info">
                                <h4>{p.title}</h4>
                                <div className="dash-prod-bottom">
                                    <span className="dash-price">₹{p.price}</span>
                                    <div className="dash-rating">⭐ {p.rating || '4.8'}</div>
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
