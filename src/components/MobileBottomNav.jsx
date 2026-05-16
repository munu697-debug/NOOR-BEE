import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.div 
            className="mobile-bottom-nav"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
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
                                    // Handle cart open elsewhere or via context
                                    document.querySelector('.cart-icon-wrapper')?.click();
                                }
                            }}
                        >
                            <div className="icon-wrapper">
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {tab.count > 0 && <span className="nav-badge">{tab.count}</span>}
                                {isActive && (
                                    <motion.div 
                                        className="active-indicator"
                                        layoutId="active-nav"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                            <span className="nav-label">{tab.label}</span>
                        </a>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MobileBottomNav;
