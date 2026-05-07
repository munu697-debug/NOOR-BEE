import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// Reusing exact ProductsSection styles to make it identically Apple-like
import './ProductsSection.css';

const packages = [
    { id: 1, title: 'Marjan Honey Mix 1kg', subtitle: '1kg Honey', price: '₹999', image: '/raw_honey_jar.png' },
    { id: 2, title: 'Marjan Honey Mix 500g', subtitle: '500g Honey', price: '₹549', image: '/raw_honey_jar.png' },
    { id: 3, title: 'Marjan Honey Mix 250g', subtitle: '250g Honey', price: '₹399', image: '/raw_honey_jar.png' }
];

const PackagesSection = () => {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const headerOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
    const headerScale = useTransform(scrollYProgress, [0.05, 0.2], [0.8, 1]);

    const card1Y = useTransform(scrollYProgress, [0.1, 0.4], [250, 0]);
    const card2Y = useTransform(scrollYProgress, [0.15, 0.45], [300, 0]);
    const card3Y = useTransform(scrollYProgress, [0.2, 0.5], [350, 0]);

    const bentoOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
    const bentoScale = useTransform(scrollYProgress, [0.4, 0.55], [0.8, 1]);
    const bentoY = useTransform(scrollYProgress, [0.4, 0.55], [100, 0]);

    const cardYTransforms = [card1Y, card2Y, card3Y];

    return (
        <section className="products-section" id="packages" ref={sectionRef}>
            <div className="wavy-divider">
                <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#fcf8f2" />
                </svg>
            </div>

            <div className="products-container">
                <motion.div
                    className="products-header"
                    style={{ opacity: headerOpacity, scale: headerScale }}
                >
                    <h2 className="products-title" style={{ fontSize: '42px', lineHeight: 1.2 }}>
                        Special Festive & Bulk Packages<br />
                        <span style={{ fontSize: '20px', color: '#888', fontWeight: 500 }}>Available on Request</span>
                    </h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="products-grid-3">
                    {packages.map((p, index) => (
                        <motion.div
                            key={p.id}
                            className="prod-card"
                            style={{ y: cardYTransforms[index] }}
                        >
                            <div className="prod-img-wrapper">
                                <motion.img
                                    src={p.image}
                                    alt={p.title}
                                    whileHover={{ scale: 1.08 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                            <div className="prod-content">
                                <h3 className="prod-title">{p.title}</h3>
                                <p style={{ color: '#888', margin: 0, fontSize: '14px', marginBottom: '15px' }}>{p.subtitle}</p>
                                <div className="prod-bottom">
                                    <span className="prod-price">{p.price}</span>
                                    <button className="prod-add-btn">Add to Cart</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    style={{ 
                        opacity: bentoOpacity, scale: bentoScale, y: bentoY,
                        background: '#fcf8f2',
                        borderRadius: '24px',
                        padding: '60px 40px',
                        textAlign: 'center',
                        maxWidth: '900px',
                        margin: '80px auto 0',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        border: '1px solid #eedebe'
                    }}
                >
                    <h4 style={{ color: '#5a3737', fontSize: '40px', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Customization Available</h4>
                    <p style={{ color: 'var(--color-charcoal)', fontSize: '18px', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto 30px' }}>
                        We offer customized packs and gift jars of Marjan Honey Mix with Dry Fruits to suit personal, festive, and corporate gifting needs. Celebrate health with your loved ones in a truly unique way.
                    </p>
                    <a href="#contact" className="prod-add-btn" style={{ textDecoration: 'none', display: 'inline-block', padding: '16px 40px', fontSize: '16px' }}>Contact Us Now</a>
                </motion.div>

            </div>
        </section>
    );
};

export default PackagesSection;
