import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShieldCheck, Target, Eye, User, ShoppingBag, HelpCircle, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsub();
    }, []);

    const handleNav = (id) => {
        // Pages that replace the whole screen
        const pages = ['profile', 'shop', 'contact'];
        if (pages.includes(id)) {
            if (onNavigate) onNavigate(id);
        } else {
            // Sections within the home page — scroll to them
            if (onNavigate) onNavigate('home');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
        onClose();
    };

    const handleSignOut = async () => {
        await signOut(auth);
        onClose();
    };

    const menuItems = [
        { icon: <ShieldCheck size={20} />, label: 'Health Benefits', id: 'health' },
        { icon: <Heart size={20} />,       label: 'Core Values',     id: 'values' },
        { icon: <Target size={20} />,      label: 'Mission',         id: 'mission' },
        { icon: <Eye size={20} />,         label: 'Vision',          id: 'vision' },
        { icon: <User size={20} />,        label: 'My Profile',      id: 'profile' },
        { icon: <ShoppingBag size={20} />, label: 'Shop',            id: 'shop' },
        { icon: <HelpCircle size={20} />,  label: 'Support',         id: 'contact' },
    ];

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="mobile-menu-overlay" onClick={onClose}>
                    <motion.div
                        className="mobile-menu-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="menu-header">
                            <img src="/images/logo/logo.png" alt="Noorbee" className="menu-logo" />
                            <button className="close-menu" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* User Brief */}
                        <div className="menu-user-brief">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="menu-avatar-img" />
                            ) : (
                                <div className="menu-avatar">{avatarLetter}</div>
                            )}
                            <div className="menu-user-info">
                                <h3>{displayName}</h3>
                                <p>{user ? 'Logged In' : 'Guest User'}</p>
                            </div>
                        </div>

                        {/* Nav Links */}
                        <nav className="menu-list">
                            {menuItems.map((item, idx) => (
                                <motion.button
                                    key={item.id}
                                    className="menu-item-row"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    onClick={() => handleNav(item.id)}
                                >
                                    <div className="menu-item-icon">{item.icon}</div>
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>

                        {/* Footer */}
                        <div className="menu-footer">
                            {user ? (
                                <button className="logout-menu" onClick={handleSignOut}>
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            ) : (
                                <button className="logout-menu" onClick={() => { handleNav('profile'); }}>
                                    <User size={16} />
                                    Sign In
                                </button>
                            )}
                            <p>Noorbee v2.0</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
