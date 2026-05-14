import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './HeroSection.css';

const MAX_FRAMES = 240;

const HeroSection = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, MAX_FRAMES]);

    useEffect(() => {
        // Preload all frames for smooth canvas drawing without React state updates during scroll
        const preloadImages = () => {
            for (let i = 1; i <= MAX_FRAMES; i++) {
                const img = new Image();
                img.src = `/images/herosection/ezgif-frame-${String(i).padStart(3, '0')}.webp`;
                imagesRef.current[i] = img;
            }
        };
        preloadImages();

        // Draw frame 1 on mount
        const firstImg = new Image();
        firstImg.src = `/images/herosection/ezgif-frame-001.webp`;
        firstImg.onload = () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(firstImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        };

        // --- NEW: Cinematic Automatic Auto-Scroll ---
        let animationFrameId;
        const timer = setTimeout(() => {
            // Only auto-scroll if the user is at the very top of the page
            if (window.scrollY < 100 && containerRef.current) {
                const startY = window.scrollY;
                // Target: The exact bottom of the Hero container (where ProductsSection begins)
                const endY = containerRef.current.getBoundingClientRect().bottom + window.scrollY;
                const distance = endY - startY;
                const duration = 5000; // 5 seconds is perfect for 240 frames (roughly 50fps perceived)
                let startTime = null;
                let userInterrupted = false;

                // Stop auto-scroll if the user manually tries to scroll
                const abortScroll = () => { userInterrupted = true; };
                window.addEventListener('wheel', abortScroll, { once: true });
                window.addEventListener('touchstart', abortScroll, { once: true });

                const smoothScroll = (currentTime) => {
                    if (userInterrupted) return;
                    if (!startTime) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);

                    // InOutQuad easing for ultra-smooth velocity
                    const ease = progress < 0.5
                        ? 2 * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                    window.scrollTo(0, startY + distance * ease);

                    if (timeElapsed < duration) {
                        animationFrameId = requestAnimationFrame(smoothScroll);
                    } else {
                        window.removeEventListener('wheel', abortScroll);
                        window.removeEventListener('touchstart', abortScroll);
                    }
                };

                animationFrameId = requestAnimationFrame(smoothScroll);
            }
        }, 1500); // Give the user 1.5 seconds to look at the first frame before moving

        return () => {
            clearTimeout(timer);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        const frame = Math.round(latest);
        const img = imagesRef.current[frame];

        if (img && img.complete && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            // Draw image to canvas for extreme performance (no React re-renders)
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    });

    // Feature 1: NOOR BEE (Top Left)
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.28], [1, 1, 0, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -20]);

    // Feature 2: Purest Elements (Bottom Right)
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [20, 0, 0, -20]);

    // Feature 3: Masterfully Crafted (Bottom Left)
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [20, 0, 0, -20]);

    // Feature 4: Defy Expectation (Top Right)
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 0]);
    const y4 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [20, 0, 0, -20]);

    return (
        <section className="hero-scroll-container" ref={containerRef}>
            <div className="hero-sticky-view">
                <div className="hero-image-sequence">
                    <canvas
                        ref={canvasRef}
                        className="sequence-canvas"
                        width={1920}
                        height={1080}
                    />
                </div>

                <div className="hero-text-overlay">
                    <motion.div className="feature-block pos-top-left" style={{ opacity: opacity1, y: y1 }}>
                        <h1 className="hero-title">NOOR BEE</h1>
                        <p className="hero-subtitle">Nature's absolute finest.</p>
                    </motion.div>

                    <motion.div className="feature-block pos-bottom-right" style={{ opacity: opacity2, y: y2 }}>
                        <h2 className="feature-title">The Purest Elements.</h2>
                        <p className="feature-desc">Uncompromised quality sourced from the wildest terrains.</p>
                    </motion.div>

                    <motion.div className="feature-block pos-bottom-left" style={{ opacity: opacity3, y: y3 }}>
                        <h2 className="feature-title">Masterfully Crafted.</h2>
                        <p className="feature-desc">Preserving the raw integrity of nature in every drop.</p>
                    </motion.div>

                    <motion.div className="feature-block pos-top-right" style={{ opacity: opacity4, y: y4 }}>
                        <h2 className="feature-title">Defy Expectation.</h2>
                        <p className="feature-desc">Scroll to explore the collection.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
