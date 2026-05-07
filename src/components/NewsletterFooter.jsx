import React from 'react';
import './NewsletterFooter.css';
import { Mail, Phone, MapPin } from 'lucide-react';

const NewsletterFooter = () => {
    return (
        <div className="newsletter-footer-wrapper">
            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="newsletter-box">
                    <h3>Subscribe to Our Newsletter to Get Updates on Our Latest Collection</h3>
                    <p>Get 20% off on your first order just by subscribing to our newsletter.</p>
                    <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <div className="input-wrapper">
                            <Mail size={20} className="mail-icon" />
                            <input type="email" placeholder="Enter Email Address" />
                        </div>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="advanced-footer">
                <div className="footer-top">
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <img src="/images/logo/logo.png" alt="Noor Bee Logo" className="footer-logo-img" />
                        </div>
                        <p className="footer-desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="social-links">
                            <a href="#!">FB</a>
                            <a href="#!">X</a>
                            <a href="#!">IG</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#!">About Us</a></li>
                            <li><a href="#!">Blog</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                            <li><a href="#!">Career</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Customer Services</h4>
                        <ul>
                            <li><a href="#!">My Account</a></li>
                            <li><a href="#!">Track Your Order</a></li>
                            <li><a href="#!">Return</a></li>
                            <li><a href="#!">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Our Information</h4>
                        <ul>
                            <li><a href="#!">Privacy</a></li>
                            <li><a href="#!">User Terms & Conditions</a></li>
                            <li><a href="#!">Return Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-col contact-col-info">
                        <h4>Contact Info</h4>
                        <p>+1 (800) 123-4567</p>
                        <p>hello@noorbee.com</p>
                        <p>123 Honeycomb Lane, CA 90210</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Copyright © 2026 NOOR BEE, All Rights Reserved.</p>
                    <div className="footer-lang">English | USD</div>
                </div>
            </footer>
        </div>
    );
};

export default NewsletterFooter;
