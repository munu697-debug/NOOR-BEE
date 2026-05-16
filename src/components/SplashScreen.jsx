import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // 'logo' -> 'onboarding'
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Logo splash phase
        const timer = setTimeout(() => {
            setPhase('onboarding');
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        setIsVisible(false);
        setTimeout(onComplete, 800); // Allow exit animation to finish
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && phase === 'logo' && (
                <motion.div 
                    key="logo-phase"
                    className="splash-screen-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="splash-content-logo">
                        <motion.div className="logo-glow" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                        <img src="/images/logo/logo.png" alt="Noorbee" className="splash-logo-img" />
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            NOOR BEE
                        </motion.h1>
                    </div>
                </motion.div>
            )}

            {isVisible && phase === 'onboarding' && (
                <motion.div 
                    key="onboarding-phase"
                    className="onboarding-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="onboarding-content">
                        <motion.div 
                            className="onboarding-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="onboarding-title">Natural Honey,<br />Just a Tap Away.</h1>
                            <p className="onboarding-subtitle">Fresh, tasty honey at great prices.</p>
                        </motion.div>

                        <div className="infographics-area">
                            <motion.div className="info-bubble calories" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                                <span className="label">Calories</span>
                                <span className="value">320 Kcal</span>
                            </motion.div>
                            <motion.div className="info-bubble protein" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}>
                                <span className="label">Protein</span>
                                <span className="value">85 gram</span>
                            </motion.div>
                            <motion.div className="info-bubble fat" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }}>
                                <span className="label">Fat</span>
                                <span className="value">45 gram</span>
                            </motion.div>

                            <div className="onboarding-hero">
                                <motion.img 
                                    src="/images/logo/logo.png" 
                                    alt="Honey Jar" 
                                    className="hero-honey-jar"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                />
                                <motion.div 
                                    className="offer-badge-onboarding"
                                    initial={{ rotate: -20, scale: 0 }}
                                    animate={{ rotate: 10, scale: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <span className="badge-text">SPECIAL OFFER</span>
                                    <span className="badge-value">50%</span>
                                </motion.div>
                            </div>
                        </div>

                        <div className="onboarding-footer">
                            <div className="pagination-dots">
                                <span className="dot"></span>
                                <span className="dot active"></span>
                            </div>
                            <img src="/images/logo/logo.png" alt="Bee" className="footer-bee-mini" />
                            <motion.button 
                                className="taste-now-btn"
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStart}
                            >
                                Taste Now
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
