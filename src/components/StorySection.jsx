import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './StorySection.css';

const StorySection = () => {
    const { scrollYProgress } = useScroll();
    const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section className="story-section" id="story">
            <div className="story-container">

                <motion.div className="story-image-wrapper" style={{ y: yImage }}>
                    <img src="/roasted_almonds.png" alt="Premium Roasted Almonds" className="story-image" />
                </motion.div>

                <div className="story-content">
                    <motion.div
                        className="story-block"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-20%" }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h2 className="story-heading">A Legacy of Purity.</h2>
                        <p className="story-text">
                            Sourced directly from the untouched peaks of pristine mountains and sun-drenched orchards.
                            Every jar and every harvest is a testament to nature's unyielding perfection.
                        </p>
                    </motion.div>

                    <motion.div
                        className="story-block"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-20%" }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        <h2 className="story-heading">Uncompromised Quality.</h2>
                        <p className="story-text">
                            We bypass the ordinary to bring you the extraordinary.
                            No additives. No shortcuts. Just the raw, powerful essence of earth's finest ingredients, beautifully preserved.
                        </p>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default StorySection;
