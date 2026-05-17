import React from 'react';
import { motion } from 'framer-motion';
import { Home, Grid, ShoppingCart, Clock, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './MobileBottomNav.css';

const MobileBottomNav = ({ activeTab, onNavigate }) => {
    const { cartItems, setIsCartOpen } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const tabs = [
        { id: 'home',    icon: Home,         label: 'Home'    },
        { id: 'shop',    icon: Grid,         label: 'Shop'    },
        { id: 'cart',    icon: ShoppingCart, label: 'Cart', count: cartCount },
        { id: 'profile', icon: User,         label: 'Profile' },
        { id: 'contact', icon: Clock,        label: 'Support' },
    ];

    const handleTabClick = (tab) => {
        if (tab.id === 'cart') {
            // Open cart modal directly — no page navigation needed
            setIsCartOpen(true);
            return;
        }
        // Push new hash → App.jsx hashchange listener picks it up
        const hash = tab.id === 'home' ? '#' : `#${tab.id}`;
        if (window.location.hash === hash && tab.id !== 'home') {
            // Already on this hash — force state update via custom event
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
            window.location.hash = hash;
        }
        // Also call direct callback if provided (avoids hashchange race)
        if (onNavigate) onNavigate(tab.id === 'home' ? 'home' : tab.id);
    };

    return (
        <div className="mobile-bottom-nav">
            <div className="nav-items-container">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                            aria-label={tab.label}
                        >
                            <div className="icon-wrapper">
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                                {tab.count > 0 && (
                                    <span className="nav-badge">{tab.count}</span>
                                )}
                            </div>
                            <span className="nav-label">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    className="active-dot"
                                    layoutId="active-nav"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
