import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductsSection.css';
import ProductDetailsModal from './ProductDetailsModal';

const ProductsSection = () => {
    const { toggleWishlist, isInWishlist } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const unsub = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                setProducts(list);
            } else {
                setProducts([]);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);
    return (
        <section className="products-section" id="products" style={{ paddingTop: '50px' }}>
            <div className="products-container">
                <motion.div
                    className="products-header"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="products-title">Our Products</h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="products-grid-3">
                    {products.map((p, index) => (
                        <motion.div
                            key={p.id}
                            className="prod-card"
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-5%" }}
                            transition={{ duration: 0.6, delay: 0.1 + (index * 0.15) }}
                        >
                            <div className="prod-img-wrapper">
                                <button 
                                    className={`prod-fav-btn ${isInWishlist(p.id) ? 'active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                                    aria-label="Add to Wishlist"
                                >
                                    <Heart size={20} fill={isInWishlist(p.id) ? "currentColor" : "none"} />
                                </button>
                                <motion.img
                                    src={p.image}
                                    alt={p.title}
                                    whileHover={{ scale: 1.08 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                            <div className="prod-content">
                                <h3 className="prod-title">{p.title}</h3>
                                <div className="prod-bottom">
                                    <span className="prod-price">₹{parseFloat(p.price || 0).toFixed(2)}</span>
                                    <button 
                                        className="prod-add-btn"
                                        onClick={() => setSelectedProduct(p)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>



            </div>

            {/* Product Details Modal */}
            <ProductDetailsModal 
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    );
};

export default ProductsSection;
