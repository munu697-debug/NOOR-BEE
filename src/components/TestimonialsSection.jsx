import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './TestimonialsSection.css';

const reviews = [
    {
        name: "Sarah Jenkins",
        text: "Nature's Gold honey is the best I've ever had! The taste is so pure and rich, and I love knowing that it's ethically sourced. I use it daily in my tea and even for skincare. Highly recommended!",
        image: "/roasted_almonds.png"
    },
    {
        name: "Michael Chen",
        text: "The Special Reserve is absolutely extraordinary. You can taste the complex floral notes from the wild harvesting. It pairs perfectly with aged cheeses and fine wines.",
        image: "/raw_honey_jar.png"
    },
    {
        name: "Elena Rodriguez",
        text: "I am amazed by the quality of the Organic Cashews and Honey pairing. They have clearly master-crafted their entire production process. Unbelievable texture and flavor profile.",
        image: "/organic_cashews.png"
    }
];

const TestimonialsSection = () => {
    const sectionRef = useRef(null);

    // Apple-style horizontal scroll tied to vertical scroll
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Translate the track horizontally across 3 slides (-66.66% for 3 items)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

    // Parallax the header elements
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 1]);
    const headerY = useTransform(scrollYProgress, [0, 0.1], [50, 0]);

    return (
        <section className="testimonials-scroll-container" ref={sectionRef}>
            <div className="testimonials-sticky">

                <motion.div className="testimonials-header" style={{ opacity: headerOpacity, y: headerY }}>
                    <h2>What people are <span>saying</span></h2>
                </motion.div>

                <div className="slider-mask">
                    <motion.div className="slider-track" style={{ x }}>
                        {reviews.map((review, i) => (
                            <div className="slide-item" key={i}>
                                <div className="testimonials-container">
                                    <div className="test-image-wrapper">
                                        <div className="yellow-shape"></div>
                                        <img src={review.image} alt={review.name} className="test-img" />
                                    </div>

                                    <div className="test-text-wrapper">
                                        <div className="quote-mark">“</div>
                                        <p className="quote-text">{review.text}</p>
                                        <div className="quote-author">
                                            <strong>- {review.name},</strong>
                                            <span> Happy customer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Progress Indicator */}
                <div className="slider-progress-bar-container">
                    <motion.div
                        className="slider-progress-bar"
                        style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
                    />
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
