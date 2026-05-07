import React from 'react';
import { motion } from 'framer-motion';
import './ContactSection.css';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
    return (
        <section className="contact-section" id="contact">
            <div className="contact-container">
                <motion.div
                    className="contact-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="contact-title">Get in Touch</h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="contact-grid">
                    <motion.div
                        className="contact-info glass-card"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3>We're Here for You</h3>
                        <p className="contact-desc">
                            Have questions about our premium selections or need help with a bulk order? Reach out directly.
                        </p>

                        <div className="info-items">
                            <div className="info-item">
                                <div className="info-icon"><MapPin size={20} className="text-gold" /></div>
                                <p>Naduvannur, Kozhikode, Kerala</p>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Phone size={20} className="text-gold" /></div>
                                <p>+91 70250 50209</p>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Mail size={20} className="text-gold" /></div>
                                <p>noorbeehoneynuts@gmail.com</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="contact-form-container glass-card"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <form className="contact-form" onSubmit={e => e.preventDefault()}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="your@email.com" />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea rows="4" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="submit-btn" type="submit">Send Message</button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
