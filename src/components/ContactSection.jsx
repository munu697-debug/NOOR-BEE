import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ContactSection.css';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !message) return;

        let waMessage = `Hello NOOR BEE, I have a message for you:\n\n`;
        waMessage += `*Name:* ${name}\n`;
        if (phone) waMessage += `*Phone Number:* ${phone}\n`;
        waMessage += `*Message:*\n${message}`;

        const encodedMessage = encodeURIComponent(waMessage);
        const whatsappUrl = `https://wa.me/917025050209?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Optional: clear form
        setName('');
        setPhone('');
        setMessage('');
    };
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
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input 
                                    type="number" 
                                    placeholder="Your Phone Number" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea 
                                    rows="4" 
                                    placeholder="How can we help?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
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
