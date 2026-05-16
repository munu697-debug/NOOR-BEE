import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
// Reusing exact ProductsSection styles to make it identically Apple-like
import './ProductsSection.css';

const PackagesSection = () => {
    const [festiveEnabled, setFestiveEnabled] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const sectionRef = useRef(null);

    useEffect(() => {
        // 1. Listen for Settings
        const settingsRef = ref(db, 'settings/festiveSectionEnabled');
        const unsubSettings = onValue(settingsRef, (snapshot) => {
            setFestiveEnabled(!!snapshot.val()); // Use !! to ensure boolean even if null
        });

        // 2. Listen for Products
        const productsRef = ref(db, 'products');
        const unsubProducts = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                setAllProducts(list);
            } else {
                setAllProducts([]);
            }
        });

        return () => {
            unsubSettings();
            unsubProducts();
        };
    }, []);

    useEffect(() => {
        if (festiveEnabled) {
            // Show Festive Products
            const festive = allProducts.filter(p => p.isFestive);
            setDisplayProducts(festive);
        } else {
            // Show 3 regular products (relevant)
            const regular = allProducts.filter(p => !p.isFestive).slice(0, 3);
            setDisplayProducts(regular);
        }
    }, [festiveEnabled, allProducts]);

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
                        {festiveEnabled ? "Special Festive & Bulk Packages" : "Our Best Sellers"}
                        <br />
                        <span style={{ fontSize: '20px', color: '#888', fontWeight: 500 }}>
                            {festiveEnabled ? "Available on Request" : "Premium Quality Guaranteed"}
                        </span>
                    </h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="products-grid-mobile">
                    {displayProducts.map((p, index) => (
                        <motion.div
                            key={p.id}
                            className="prod-card-app"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="prod-img-wrap-app">
                                <img src={p.image} alt={p.title} className="prod-img-app" />
                                {p.isFestive && <span className="prod-badge-app">Festive</span>}
                            </div>
                            <div className="prod-info-app">
                                <h3 className="prod-name-app">{p.title}</h3>
                                <div className="prod-meta-app">
                                    <span className="prod-price-app">₹{p.price}</span>
                                    <button className="prod-add-app">Add</button>
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
