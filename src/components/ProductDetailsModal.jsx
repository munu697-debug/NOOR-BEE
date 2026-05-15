import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Share2, Check, User, ShoppingBag, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import ReviewModal from './ReviewModal';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
    const { addToCart, setIsCartOpen } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [recommended, setRecommended] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [submittedReviews, setSubmittedReviews] = useState([]);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            document.body.style.overflow = 'hidden';
            
            // 1. Fetch recommendations
            const productsRef = ref(db, 'products');
            const unsubProducts = onValue(productsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                    setRecommended(list.filter(p => p.id !== product.id).slice(0, 4));
                }
            });

            // 2. Fetch reviews for this product
            const reviewsRef = ref(db, 'reviews');
            const unsubReviews = onValue(reviewsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const list = Object.entries(data)
                        .map(([id, val]) => ({ id, ...val }))
                        .filter(r => r.productId === product.id)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setSubmittedReviews(list);
                } else {
                    setSubmittedReviews([]);
                }
            });

            return () => {
                unsubProducts();
                unsubReviews();
                document.body.style.overflow = 'unset';
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, { quantity });
        setIsCartOpen(true);
    };

    const handleBuyNow = () => {
        const phoneNumber = "917025050209";
        const itemPrice = parseFloat(product.price) || 0;
        const itemTotal = (itemPrice * quantity).toFixed(2);
        
        let message = "Hello NOOR BEE, I would like to place an order immediately:\n\n";
        message += `Product: ${product.title}\n`;
        message += `Quantity: ${quantity}\n`;
        message += `Total Amount: ₹${itemTotal}\n\n`;
        message += `*My Details:*\n`;
        message += `Name: \n`;
        message += `Location/Address: \n`;
        message += `Pin Code: \n`;
        message += `Phone: \n\n`;
        message += "Please confirm my order.";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    const originalPrice = parseFloat(product.price) * 1.25; // Mock original price for sale effect

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="shopify-page-wrapper">
                    {/* Header inside modal to look like a full page */}
                    <header className="shopify-header">
                        <div className="shopify-logo">
                            {/* Logo removed as requested */}
                        </div>
                        <div className="shopify-header-icons right">
                            {/* Icons removed as requested */}
                        </div>
                        <button className="shopify-close" onClick={onClose}>
                            <X size={28} strokeWidth={1.5} />
                        </button>
                    </header>

                    <motion.div 
                        className="shopify-page-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Product Section */}
                        <div className="shopify-product-section">
                            <div className="shopify-product-image-container">
                                <div className="special-offer-tag">
                                    <img src="/images/elements/offer-tag.png" alt="Special Offer" onError={(e) => e.target.style.display='none'} />
                                    {/* Fallback CSS tag if image not found */}
                                    <div className="css-offer-tag">SPECIAL<br/>OFFER</div>
                                </div>
                                <img src={product.image} alt={product.title} className="shopify-main-image" />
                            </div>

                            <div className="shopify-product-details">
                                <h1 className="shopify-product-title">{product.title}</h1>
                                
                                <div className="shopify-price-row">
                                    <span className="shopify-old-price">Rs. {originalPrice.toFixed(0)}</span>
                                    <span className="shopify-new-price">Rs. {parseFloat(product.price).toFixed(0)}</span>
                                    <span className="shopify-sale-badge">Sale</span>
                                </div>
                                <p className="shopify-shipping-text"><u>Shipping</u> calculated at checkout.</p>

                                <div className="shopify-quantity-selector">
                                    <label>Quantity</label>
                                    <div className="quantity-controls">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                        <input type="text" value={quantity} readOnly />
                                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </div>
                                </div>

                                <div className="shopify-action-buttons">
                                    <button className="btn-add-cart" onClick={handleAddToCart}>Add to cart</button>
                                    <button className="btn-buy-now" onClick={handleBuyNow}>Buy it now</button>
                                </div>

                                <div className="shopify-description">
                                    <p>Discover the powerful synergy of tradition and health with our premium honey collection. Perfectly crafted for your daily wellness routine.</p>
                                    <br/>
                                    <ul className="shopify-features">
                                        <li><Check size={18} className="text-green" /> No added sugar</li>
                                        <li><Check size={18} className="text-green" /> No preservatives</li>
                                        <li><Check size={18} className="text-green" /> 100% natural ingredients</li>
                                    </ul>
                                    <br/>
                                    <p>Fuel your body. Nourish your soul. One spoon at a time.</p>
                                </div>

                                <div className="shopify-share">
                                    <Share2 size={16} /> <span>Share</span>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        {recommended.length > 0 && (
                            <div className="shopify-recommendations">
                                <h2>You may also like</h2>
                                <div className="shopify-grid">
                                    {recommended.map(rec => (
                                        <div key={rec.id} className="shopify-rec-card" onClick={() => {
                                            // Handle swap product logic if needed, for now just visual
                                        }}>
                                            <div className="rec-img-wrap">
                                                <img src={rec.image} alt={rec.title} />
                                                <span className="rec-sale">Sale</span>
                                            </div>
                                            <h4 className="rec-title">{rec.title}</h4>
                                            <div className="rec-price">
                                                <span className="old">Rs. {(parseFloat(rec.price) * 1.25).toFixed(0)}</span>
                                                <span className="new">From Rs. {parseFloat(rec.price).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Customer Reviews */}
                        <div className="shopify-reviews-section">
                            <h2>Customer Reviews</h2>
                            <div className="reviews-summary-box">
                                <div className="reviews-average">
                                    <div className="stars">
                                        <Star size={20} fill="#facc15" color="#facc15" />
                                        <Star size={20} fill="#facc15" color="#facc15" />
                                        <Star size={20} fill="#facc15" color="#facc15" />
                                        <Star size={20} fill="#facc15" color="#facc15" />
                                        <Star size={20} fill="#facc15" color="#facc15" />
                                    </div>
                                    <p>5.00 out of 5</p>
                                    <p className="based-on">Based on 2 reviews <Check size={14}/></p>
                                </div>
                                <div className="reviews-bars">
                                    {[5,4,3,2,1].map(num => (
                                        <div key={num} className="bar-row">
                                            <div className="stars-small">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < num ? "#facc15" : "none"} color="#facc15"/>)}
                                            </div>
                                            <div className="bar-bg">
                                                <div className="bar-fill" style={{width: num === 5 ? '100%' : '0%'}}></div>
                                            </div>
                                            <span className="count">{num === 5 ? '2' : '0'}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="reviews-action">
                                    <button className="write-review-btn" onClick={() => setIsReviewModalOpen(true)}>
                                        Write a review
                                    </button>
                                </div>
                            </div>

                            <div className="reviews-list">
                                {submittedReviews.map((rev, idx) => (
                                    <div key={`new-${idx}`} className="review-card">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < rev.rating ? "#facc15" : "none"} color={i < rev.rating ? "#facc15" : "#ddd"} />
                                            ))}
                                        </div>
                                        <div className="review-header">
                                            <div className="reviewer"><User size={16}/> {rev.name} <span className="verified-badge">Verified</span></div>
                                            <span className="date">{rev.date}</span>
                                        </div>
                                        <p className="review-text">{rev.content}</p>
                                    </div>
                                ))}

                                <div className="review-card">
                                    <div className="stars"><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /></div>
                                    <div className="review-header">
                                        <div className="reviewer"><User size={16}/> Anu prince <span className="verified-badge">Verified</span></div>
                                        <span className="date">01/24/2026</span>
                                    </div>
                                    <p className="review-text">Super and very tasty</p>
                                </div>
                                <div className="review-card">
                                    <div className="stars"><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /><Star size={14} fill="#facc15" color="#facc15" /></div>
                                    <div className="review-header">
                                        <div className="reviewer"><User size={16}/> Anonymous <span className="verified-badge">Verified</span></div>
                                        <span className="date">01/08/2026</span>
                                    </div>
                                    <p className="review-text">Great taste, good for health</p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                    
                    <ReviewModal 
                        isOpen={isReviewModalOpen} 
                        onClose={() => setIsReviewModalOpen(false)} 
                        product={product} 
                        onSubmitReview={async (review) => {
                            try {
                                await push(ref(db, 'reviews'), {
                                    ...review,
                                    productId: product.id,
                                    productTitle: product.title,
                                    createdAt: new Date().toISOString()
                                });
                            } catch (err) {
                                console.error("Review submission failed:", err);
                                alert("Failed to submit review. Check your connection.");
                            }
                        }}
                    />
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailsModal;
