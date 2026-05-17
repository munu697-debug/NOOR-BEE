import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Grid, ShoppingCart, Clock, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './MobileBottomNav.css';

const MobileBottomNav = ({ activeTab, onTabChange }) => {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const tabs = [
        { id: 'home', icon: Home, label: 'Home', href: '#' },
        { id: 'shop', icon: Grid, label: 'Shop', href: '#shop' },
        { id: 'cart', icon: ShoppingCart, label: 'Cart', count: cartCount },
        { id: 'profile', icon: User, label: 'Profile', href: '#profile' },
        { id: 'contact', icon: Clock, label: 'Support', href: '#contact' }
    ];

    return (
        /* Use a plain div so no Framer Motion transform overrides the CSS margin:auto centering */
        <div className="mobile-bottom-nav">
            <div className="nav-items-container">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <a
                            key={tab.id}
                            href={tab.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={(e) => {
                                if (tab.id === 'cart') {
                                    e.preventDefault();
                                    document.querySelector('.cart-icon-wrapper')?.click();
                                }
                            }}
                        >
                            <div className="icon-wrapper">
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {tab.count > 0 && <span className="nav-badge">{tab.count}</span>}
                            </div>
                            <span className="nav-label">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    className="active-dot"
                                    layoutId="active-nav"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
