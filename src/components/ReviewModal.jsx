import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, UploadCloud, ArrowLeft } from 'lucide-react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, product, onSubmitReview }) => {
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    if (!isOpen || !product) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        if (onSubmitReview) {
            onSubmitReview({
                rating,
                content,
                name: isAnonymous ? 'Anonymous' : name,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
            });
        }
        setStep(4);
    };

    const resetAndClose = () => {
        setStep(1);
        setRating(0);
        setContent('');
        setEmail('');
        setName('');
        setIsAnonymous(false);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="review-modal-overlay">
                <motion.div 
                    className="review-modal-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <button className="review-close-btn" onClick={resetAndClose}>
                        <X size={24} />
                    </button>

                    {/* Step 1: Rating */}
                    {step === 1 && (
                        <div className="review-step step-1">
                            <h2>How would you rate this product?</h2>
                            <p className="subtitle">We would love it if you would share a bit about your experience.</p>
                            
                            <img src={product.image} alt={product.title} className="review-product-img" />
                            <h3 className="review-product-title">{product.title}</h3>

                            <div className="rating-selector">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className="star-btn"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => {
                                            setRating(star);
                                            handleNext();
                                        }}
                                    >
                                        <Star 
                                            size={48} 
                                            fill={(hoverRating || rating) >= star ? "#0f766e" : "none"} 
                                            color="#0f766e" 
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                ))}
                                <div className="rating-labels">
                                    <span>Poor</span>
                                    <span>Great</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Content */}
                    {step === 2 && (
                        <div className="review-step step-2">
                            <h3 className="review-product-title">{product.title}</h3>
                            <div className="selected-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        size={40} 
                                        fill={rating >= star ? "#0f766e" : "none"} 
                                        color="#0f766e" 
                                    />
                                ))}
                                <div className="rating-labels-small">
                                    <span>Poor</span>
                                    <span>Great</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Review content (Required)</label>
                                <textarea 
                                    placeholder="Start writing here..." 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={6}
                                />
                            </div>

                            <p className="terms-text">
                                We'll only contact you about your review if necessary. By submitting your review, you agree to our <u>terms and conditions</u> and <u>privacy policy</u>.
                            </p>

                            <div className="review-actions">
                                <button className="btn-back" onClick={handleBack}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button 
                                    className="btn-next" 
                                    onClick={handleNext}
                                    disabled={!content.trim()}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: About you */}
                    {step === 3 && (
                        <div className="review-step step-3">
                            <h2>About you</h2>
                            <p className="subtitle">Please tell us more about you.</p>

                            <div className="form-group mt-4">
                                <label>Email address (Required)</label>
                                <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span className="hint">We respect your privacy.</span>
                            </div>

                            <div className="form-group">
                                <label>Display name (Required)</label>
                                <input 
                                    type="text" 
                                    placeholder="Display name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                Post review as anonymous
                            </label>

                            <div className="review-actions">
                                <button className="btn-back" onClick={handleBack}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button 
                                    className="btn-next" 
                                    onClick={handleSubmit}
                                    disabled={!email || !name}
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Thanks */}
                    {step === 4 && (
                        <div className="review-step step-5">
                            <h2>Thanks for your review!</h2>
                            <p className="subtitle">We are processing it and it will appear on the store soon.</p>
                            
                            <p className="confirm-text">
                                Please confirm your email by clicking the link we just sent you. This helps us keep reviews authentic.
                            </p>

                            <div className="review-actions center">
                                <button className="btn-next" onClick={resetAndClose}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewModal;
