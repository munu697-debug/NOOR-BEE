import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ArrowDown } from 'lucide-react';
import './CoreValuesSection.css';

const CoreValuesSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        setMousePosition({ x, y });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="core-values-section">
            
            {/* Minimal Premium Typography Layout */}
            <div className="vm-premium-fullwidth">
                <motion.div 
                    className="vm-text-block-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="vm-title">Our <span>Vision</span></h2>
                    <p>To inspire a healthier lifestyle by offering pure, natural, and nutritious honey-based products that enrich every occasion and every home.</p>
                </motion.div>

                <motion.div 
                    className="vm-divider-line-full" 
                    initial={{ width: 0 }}
                    whileInView={{ width: 120 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1, delay: 0.2 }}
                />

                <motion.div 
                    className="vm-text-block-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <h2 className="vm-title">Our <span>Mission</span></h2>
                    <p>Our mission is to deliver premium-quality honey blends infused with dry fruits, crafted from genuine sources. We aim to provide a natural alternative to sugar, promoting health, wellness, and happiness in every spoonful.</p>
                </motion.div>
            </div>

            <motion.div
                className="values-grid-wrapper"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
            >
                <h3 className="values-heading">Core <span>Values</span></h3>
                <div className="values-grid">
                    {[
                        { title: "Purity", desc: "100% genuine honey sourced from trusted beekeepers." },
                        { title: "Health First", desc: "Products designed to boost immunity and overall well-being." },
                        { title: "Transparency", desc: "Clear sourcing and honest ingredients with no hidden additives." },
                        { title: "Sustainability", desc: "Respecting nature while bringing its best to your table." },
                        { title: "Care & Celebration", desc: "Making every occasion healthier and more meaningful." }
                    ].map((val, idx) => (
                        <motion.div
                            className="value-card"
                            key={idx}
                            whileHover={{ y: -10, scale: 1.02 }}
                        >
                            <h4>{val.title}</h4>
                            <p>{val.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};
export default CoreValuesSection;
