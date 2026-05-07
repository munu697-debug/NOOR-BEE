import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQSection.css';

const faqs = [
    { q: "Is your honey raw and filtered?", a: "Yes! Our honey is 100% raw and unfiltered, preserving all the natural enzymes, antioxidants, and nutrients." },
    { q: "Can honey help with allergies?", a: "Local raw honey is believed by many to help with local pollen allergies by exposing you to trace amounts." },
    { q: "Does your honey ever expire?", a: "No, properly stored pure honey never expires! It may crystallize, but it's completely safe and natural." },
    { q: "How should I store my honey?", a: "Store it at room temperature in a dry place. Do not refrigerate, as it accelerates crystallization." },
    { q: "What kind of payment do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay." },
    { q: "View more the FAQ page", a: "Click here to navigate to our fully dedicated help center and knowledge base." }
];

const FAQSection = () => {
    const [openIdx, setOpenIdx] = useState(0);

    return (
        <section className="faq-section dark-section">
            <div className="faq-container-centered">
                <motion.div
                    className="faq-header-centered"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                >
                    <h2>Frequently <span>Asked</span> Question</h2>
                </motion.div>

                <div className="faq-list-centered">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            className={`faq-card ${openIdx === idx ? 'open' : ''}`}
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                        >
                            <div className="faq-card-q">
                                <h4>{faq.q}</h4>
                                {openIdx === idx ? <ChevronUp size={20} className="faq-icon-svg" /> : <ChevronDown size={20} className="faq-icon-svg" />}
                            </div>

                            <div className={`faq-card-a-wrapper ${openIdx === idx ? 'expanded' : ''}`}>
                                <div className="faq-card-a">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
