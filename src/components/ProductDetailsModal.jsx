import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
    const { addToCart, setIsCartOpen } = useCart();

    const colors = [
        { name: 'Golden', hex: '#FFD700' },
        { name: 'Amber', hex: '#FFBF00' },
        { name: 'Dark', hex: '#8B6914' }
    ];

    const sizes = useMemo(() => product?.sizes || ['250g', '500g', '1kg', '2kg', '5kg'], [product]);

    const reviews = {
        rating: 4.5,
        count: 42,
        reviews: [
            'Excellent quality honey',
            'Perfect for daily use',
            'Authentic and pure',
            'Great taste'
        ]
    };

    const productImages = useMemo(() => {
        if (!product) {
            return [];
        }

        return product.images ?? [product.image, product.image, product.image, product.image];
    }, [product]);

    useEffect(() => {
        setSelectedColor(0);
        setSelectedSize(sizes[0] || '');
        setSelectedImage(0);
        setIsImageZoomOpen(false);
    }, [product, sizes]);

    const handleAddToCart = () => {
        if (!auth.currentUser) {
            alert("Please login first to add items to your cart.");
            window.location.hash = "profile";
            onClose();
            return;
        }

        addToCart(product, {
            color: colors[selectedColor].name,
            size: selectedSize,
            quantity: 1
        });
        onClose();
        setIsCartOpen(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="product-details-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Close Button */}
                        <button className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="modal-content">
                            {/* Left: Image Section */}
                            <div className="modal-left">
                                <button
                                    type="button"
                                    className="main-image-container"
                                    onClick={() => setIsImageZoomOpen(true)}
                                >
                                    <img
                                        src={productImages[selectedImage]}
                                        alt={product.title}
                                        className="main-product-image"
                                    />
                                </button>

                                {/* Thumbnail Gallery */}
                                <div className="thumbnail-gallery">
                                    {productImages.slice(0, 4).map((image, index) => (
                                        <button
                                            key={`${product.id}-thumb-${index}`}
                                            type="button"
                                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={image} alt={`${product.title} view ${index + 1}`} />
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className="thumbnail more"
                                        onClick={() => setIsImageZoomOpen(true)}
                                    >
                                        <span>View full</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right: Details Section */}
                            <div className="modal-right">
                                {/* Brand */}
                                <div className="brand-section">
                                    <div className="brand-badge">
                                        <span className="brand-icon">🍯</span>
                                        <span className="brand-name">Noor Bee Honey</span>
                                    </div>
                                    <span className="sku">HNY-PURE-001</span>
                                </div>

                                {/* Title */}
                                <h1 className="product-title">{product.title}</h1>

                                {/* Rating */}
                                <div className="rating-section">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={i < Math.floor(reviews.rating) ? 'star-filled' : 'star-empty'}
                                                fill={i < Math.floor(reviews.rating) ? '#FFD700' : 'none'}
                                            />
                                        ))}
                                    </div>
                                    <span className="review-count">{reviews.count} reviews</span>
                                </div>

                                {/* Price */}
                                <div className="price-section">
                                    <span className="price">₹{parseFloat(product.price || 0).toFixed(2)}</span>
                                </div>

                                {/* Color Selection */}
                                <div className="option-section">
                                    <label>Color</label>
                                    <div className="color-options">
                                        {colors.map((color, idx) => (
                                            <button
                                                key={idx}
                                                className={`color-option ${selectedColor === idx ? 'selected' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                                onClick={() => setSelectedColor(idx)}
                                                title={color.name}
                                            >
                                                {selectedColor === idx && <span className="checkmark">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div className="option-section">
                                    <label>Size</label>
                                    <div className="size-options">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="size-guide">
                                        <a href="#size-guide">Size guide</a>
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="action-buttons">
                                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                        <span>🛒</span> Add to cart
                                    </button>
                                    <button className="wishlist-btn">❤️</button>
                                </div>

                                {/* Delivery Info */}
                                <div className="delivery-info-section">
                                    <div className="delivery-row">
                                        <Truck size={20} className="delivery-icon" />
                                        <span className="delivery-text">Free delivery on orders over ₹500.00</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="description-section">
                                    <h3>About this product</h3>
                                    <p>
                                        {product.description || `Pure, raw, unfiltered honey sourced from pristine forests. Rich in antioxidants and natural enzymes. 
                                        Perfect for daily wellness, baking, or as a natural sweetener. No additives or preservatives.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {isImageZoomOpen && (
                            <motion.div
                                className="image-zoom-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsImageZoomOpen(false)}
                            >
                                <button
                                    type="button"
                                    className="image-zoom-close"
                                    onClick={() => setIsImageZoomOpen(false)}
                                >
                                    <X size={24} />
                                </button>
                                <motion.img
                                    initial={{ scale: 0.94, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.98, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    src={productImages[selectedImage]}
                                    alt={product.title}
                                    className="image-zoom-preview"
                                    onClick={(event) => event.stopPropagation()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailsModal;
