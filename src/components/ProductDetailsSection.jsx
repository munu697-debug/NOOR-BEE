import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ProductDetailsSection.css';

const ProductDetailsSection = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Animations mapped to the scroll progress of this container
    // Title fades out quickly
    const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    // Image comes up and scales
    const imageY = useTransform(scrollYProgress, [0.1, 0.4, 0.8], [200, 0, 0]);
    const imageScale = useTransform(scrollYProgress, [0.1, 0.4, 0.8, 1], [0.8, 1, 1.2, 1.2]);
    const imageOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.9, 1], [0, 1, 1, 0]);

    // Detail 1 (e.g. Pure & Unfiltered)
    const detail1Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 0]);
    const detail1X = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [-50, 0, -50]);

    // Detail 2 (e.g. Sourced Sustainably)
    const detail2Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
    const detail2X = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [50, 0, 50]);

    // Pricing Reveal (Final chunk)
    const priceOpacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
    const priceY = useTransform(scrollYProgress, [0.75, 0.85], [50, 0]);

    return (
        <section className="apple-details-container" ref={containerRef} id="shop">
            <div className="apple-details-sticky">

                {/* Intro Title */}
                <motion.div className="details-intro" style={{ opacity: titleOpacity, y: titleY }}>
                    <h2 className="section-title">Precision in Every Drop.</h2>
                    <p className="section-subtitle">A closer look at perfection.</p>
                </motion.div>

                {/* Central Product Image */}
                <motion.div
                    className="details-product-center"
                    style={{ y: imageY, scale: imageScale, opacity: imageOpacity }}
                >
                    <img src="/raw_honey_jar.png" alt="Raw Honey Detail" />
                </motion.div>

                {/* Detail 1 - Left Side */}
                <motion.div
                    className="detail-feature detail-left"
                    style={{ opacity: detail1Opacity, x: detail1X }}
                >
                    <h3>100% Unfiltered</h3>
                    <p>Retaining all natural enzymes and pollens just as nature intended.</p>
                </motion.div>

                {/* Detail 2 - Right Side */}
                <motion.div
                    className="detail-feature detail-right"
                    style={{ opacity: detail2Opacity, x: detail2X }}
                >
                    <h3>Sustainably Harvested</h3>
                    <p>Ethical beekeeping practices ensuring harmony with the environment.</p>
                </motion.div>

                {/* Final Price & CTA */}
                <motion.div
                    className="detail-price-reveal"
                    style={{ opacity: priceOpacity, y: priceY }}
                >
                    <div className="glass price-glass-card">
                        <h3>Raw Forest Honey</h3>
                        <span className="price-tag">$24.99</span>
                        <p className="price-sub">500g Premium Glass Jar</p>
                        <button className="buy-btn">Add to Cart</button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ProductDetailsSection;
