import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShieldCheck, Target, Eye, User, FileText, Settings, HelpCircle } from 'lucide-react';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose }) => {
    const menuItems = [
        { icon: <ShieldCheck size={20} />, label: 'Health Benefits', id: 'health' },
        { icon: <Heart size={20} />, label: 'Core Values', id: 'values' },
        { icon: <Target size={20} />, label: 'Mission', id: 'mission' },
        { icon: <Eye size={20} />, label: 'Vision', id: 'vision' },
        { icon: <User size={20} />, label: 'My Profile', id: 'profile' },
        { icon: <FileText size={20} />, label: 'Orders', id: 'orders' },
        { icon: <Settings size={20} />, label: 'Settings', id: 'settings' },
        { icon: <HelpCircle size={20} />, label: 'Help Center', id: 'help' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="mobile-menu-overlay">
                    <motion.div 
                        className="mobile-menu-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="menu-header">
                            <img src="/images/logo/logo.png" alt="Noorbee" className="menu-logo" />
                            <button className="close-menu" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="menu-user-brief">
                            <div className="menu-avatar">A</div>
                            <div className="menu-user-info">
                                <h3>Alex Polly</h3>
                                <p>Premium Member</p>
                            </div>
                        </div>

                        <nav className="menu-list">
                            {menuItems.map((item, idx) => (
                                <motion.button 
                                    key={item.id} 
                                    className="menu-item-row"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => {
                                        window.location.hash = `#${item.id}`;
                                        onClose();
                                    }}
                                >
                                    <div className="menu-item-icon">{item.icon}</div>
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>

                        <div className="menu-footer">
                            <button className="logout-menu">Sign Out</button>
                            <p>Version 2.0.4</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
