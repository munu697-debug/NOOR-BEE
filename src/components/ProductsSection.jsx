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

                <div className="products-grid-mobile">
                    {products.map((p, index) => (
                        <motion.div
                            key={p.id}
                            className="prod-card-app"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => setSelectedProduct(p)}
                        >
                            <div className="prod-img-wrap-app">
                                <img src={p.image} alt={p.title} className="prod-img-app" />
                                <button 
                                    className={`prod-fav-app ${isInWishlist(p.id) ? 'active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                                >
                                    <Heart size={18} fill={isInWishlist(p.id) ? "currentColor" : "none"} />
                                </button>
                                {p.badge && <span className="prod-badge-app">{p.badge}</span>}
                            </div>
                            <div className="prod-info-app">
                                <h3 className="prod-name-app">{p.title}</h3>
                                <div className="prod-meta-app">
                                    <span className="prod-price-app">₹{parseFloat(p.price || 0).toFixed(0)}</span>
                                    <button className="prod-add-app" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}>
                                        Add
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
