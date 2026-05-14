import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const Preloader = ({ isLoading }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <div className="preloader-content">
            <motion.div 
              className="loader-logo-wrapper"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/images/logo/logo.png" alt="Noor Bee" className="loader-logo" />
            </motion.div>
            
            <div className="loader-bar-container">
              <motion.div 
                className="loader-bar-fill"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
            
            <motion.p 
              className="loader-text"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Extracting Nature's Sweetness...
            </motion.p>
          </div>
          
          <div className="honey-drips">
            <div className="drip"></div>
            <div className="drip"></div>
            <div className="drip"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
