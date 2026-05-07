import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './CraftsmanshipSection.css';

const CraftsmanshipSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Apple-style sequenced typography engine over 400vh
    const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.35], [0, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.35, 0.55, 0.7], [0, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);

    const y1 = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
    const y2 = useTransform(scrollYProgress, [0.35, 0.55], [40, 0]);
    const y3 = useTransform(scrollYProgress, [0.7, 0.85], [40, 0]);

    const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

    return (
        <section className="craft-wrapper" ref={sectionRef}>
            <div className="craft-sticky">
                {/* Abstract dynamic background to give it that intense cinematic feel */}
                <motion.div
                    className="craft-bg"
                    style={{ scale: scaleBg }}
                />
                <div className="craft-overlay"></div>

                <div className="craft-text-container">
                    <motion.h2 className="craft-huge-text" style={{ opacity: opacity1, y: y1 }}>
                        Born in the <span>Wild.</span>
                    </motion.h2>
                    <motion.h2 className="craft-huge-text" style={{ opacity: opacity2, y: y2 }}>
                        Refined by <span>Time.</span>
                    </motion.h2>
                    <motion.div className="craft-huge-text final-text" style={{ opacity: opacity3, y: y3 }}>
                        <h2>Crafted for <span>You.</span></h2>
                        <span className="craft-subtext">The ultimate purity standard in every single drop.</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
export default CraftsmanshipSection;
