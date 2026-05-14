import React from 'react';
import { X, HeartCrack, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './WishlistModal.css';

const WishlistModal = () => {
    const { 
        wishlistItems, 
        toggleWishlist, 
        isWishlistOpen, 
        setIsWishlistOpen,
        addToCart
    } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        toggleWishlist(product); // Remove from wishlist when added to cart
    };

    return (
        <AnimatePresence>
            {isWishlistOpen && (
                <>
                    <motion.div 
                        className="wishlist-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsWishlistOpen(false)}
                    />
                    <motion.div 
                        className="wishlist-modal"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="wishlist-header">
                            <h2>Your Favorites</h2>
                            <button className="close-btn" onClick={() => setIsWishlistOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="wishlist-body">
                            {wishlistItems.length === 0 ? (
                                <div className="empty-wishlist">
                                    <HeartCrack size={48} className="empty-icon" />
                                    <p>You haven't favorited any products yet.</p>
                                    <button 
                                        className="shop-now-btn"
                                        onClick={() => {
                                            setIsWishlistOpen(false);
                                            window.location.hash = '#shop';
                                        }}
                                    >
                                        Discover Honey
                                    </button>
                                </div>
                            ) : (
                                <div className="wishlist-items-list">
                                    {wishlistItems.map((item) => (
                                        <div key={item.id} className="wishlist-item">
                                            <img src={item.image} alt={item.title} className="wishlist-item-img" />
                                            <div className="wishlist-item-info">
                                                <h4>{item.title}</h4>
                                                <span className="wishlist-item-price">₹{parseFloat(item.price || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="wishlist-item-actions">
                                                <button 
                                                    className="wishlist-add-cart"
                                                    onClick={() => handleAddToCart(item)}
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingCart size={18} />
                                                </button>
                                                <button 
                                                    className="wishlist-remove"
                                                    onClick={() => toggleWishlist(item)}
                                                    title="Remove"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WishlistModal;
