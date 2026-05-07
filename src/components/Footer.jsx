import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, Share2, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="noorbee-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/images/logo/logo.png" alt="Noor Bee" className="footer-logo" />
            <p className="footer-desc">
              Bringing you the purest raw honey and premium dry fruits directly from nature's heart to your home.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link"><MessageCircle size={20} /></a>
              <a href="#" className="social-link"><Share2 size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#shop">Shop Now</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Get in Touch</h4>
            <div className="contact-item">
              <Phone size={18} />
              <span>+91 70250 50209</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>noorbeehoneynuts@gmail.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Naduvannur, Kozhikode, Kerala</span>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Join our community for honey tips and exclusive offers.</p>
            <div className="newsletter-box">
              <input type="email" placeholder="Your email address" />
              <button><ArrowRight size={20} /></button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NOOR BEE. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
