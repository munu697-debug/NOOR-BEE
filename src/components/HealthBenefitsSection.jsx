// src/components/HealthBenefitsSection.jsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Activity, Shield, Sparkles, Leaf, Droplets } from 'lucide-react';
import './HealthBenefitsSection.css';

const HealthBenefitsSection = () => {
    const sectionRef = useRef(null);

    // Deep scroll tracking to make the page much longer
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Translate the timeline horizontally as you scroll vertically
    const xTimeline = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    
    // Draw the path linearly connected to the user's scroll depth
    const pathDraw = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

    const benefits = [
        { id: 1, title: "Sugar Replacement", icon: <Leaf size={28} strokeWidth={1.5} />, desc: "Natural replacement for sugar with no side effects.", top: true },
        { id: 2, title: "Heart Health", icon: <Heart size={28} strokeWidth={1.5} />, desc: "Improves digestion and heart health.", top: false },
        { id: 3, title: "Rich Antioxidants", icon: <Sparkles size={28} strokeWidth={1.5} />, desc: "Rich in vitamins, minerals, and antioxidants.", top: true },
        { id: 4, title: "Immunity Boost", icon: <Shield size={28} strokeWidth={1.5} />, desc: "Boosts energy and strengthens immunity.", top: false },
        { id: 5, title: "Throat Soother", icon: <Droplets size={28} strokeWidth={1.5} />, desc: "Soothes coughs and throat irritation effectively.", top: true },
        { id: 6, title: "Taste & Nutrition", icon: <Activity size={28} strokeWidth={1.5} />, desc: "A perfect blend of taste and nutrition.", top: false },
    ];

    const positions = [8.33, 25, 41.66, 58.33, 75, 91.66]; // For 200% width

    return (
        <section className="health-timeline-section" ref={sectionRef}>
            <div className="ht-sticky-view">
                <div className="ht-header">
                    <h2>Process <span>Health Benefits.</span></h2>
                </div>
                
                {/* Horizontal Scrolling Timeline Container */}
                <motion.div className="ht-viewport" style={{ x: xTimeline }}>
                    <div className="ht-container">
                        
                        {/* SVG Super Curve covering double the screen width (2000px virtual width) */}
                        <div className="ht-svg-wrapper">
                            <svg viewBox="0 0 2000 200" preserveAspectRatio="none">
                                <motion.path 
                                    d="M 0,100 C 83,0 250,0 333,100 C 416,200 583,200 666,100 C 750,0 916,0 1000,100 C 1083,200 1250,200 1333,100 C 1416,0 1583,0 1666,100 C 1750,200 1916,200 2000,100" 
                                    fill="none" 
                                    stroke="#cca43b" /* NOOR BEE Premium Gold */
                                    strokeWidth="4" 
                                    style={{ pathLength: pathDraw }}
                                />
                            </svg>
                        </div>

                        <div className="ht-nodes-row">
                            {benefits.map((b, i) => (
                                <motion.div 
                                    key={b.id} 
                                    className={`ht-node`}
                                    style={{ left: `${positions[i]}%`, x: '-50%' }}
                                    initial={{ opacity: 0, y: b.top ? -40 : 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "200% 0%" }} // trigger dynamically inside overflow
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="ht-watermark">{b.id}</div>
                                    
                                    <div className={`ht-icon-wrapper ${b.top ? 'icon-top' : 'icon-bottom'}`}>
                                        <div className="ht-icon">{b.icon}</div>
                                    </div>

                                    <div className={`ht-text-wrapper ${b.top ? 'text-top' : 'text-bottom'}`}>
                                        <h3>{b.title}</h3>
                                        <p>{b.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HealthBenefitsSection;
