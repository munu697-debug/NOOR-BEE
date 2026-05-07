import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { ref, push, get, child } from 'firebase/database';
import './CartModal.css';

const CartModal = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems, isCartOpen, setIsCartOpen } = useCart();

    const total = getTotalPrice();
    const itemCount = getTotalItems();

    const parsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') return parseFloat(price.replace(/[₹$,]/g, '')) || 0;
        return 0;
    };

    const handleCheckout = async () => {
        const phoneNumber = "917025050209"; // User's WhatsApp number
        
        // 0. Fetch User Details if logged in
        let userProfile = {};
        if (auth.currentUser) {
            try {
                const snapshot = await get(child(ref(db), `users/${auth.currentUser.uid}`));
                if (snapshot.exists()) {
                    userProfile = snapshot.val();
                }
            } catch (err) {
                console.error("Error fetching user profile for checkout:", err);
            }
        }

        // 1. Prepare Order Data for Database
        const orderData = {
            items: cartItems.map(item => ({
                title: item.title,
                price: parsePrice(item.price),
                quantity: item.quantity,
                variant: `${item.size || ''} ${item.color || ''}`.trim()
            })),
            totalAmount: total,
            itemCount: itemCount,
            userEmail: auth.currentUser?.email || 'Guest',
            userUid: auth.currentUser?.uid || 'guest_id',
            // Include shipping info
            customerName: userProfile.name || auth.currentUser?.displayName || 'Guest',
            customerPhone: userProfile.phone || '',
            customerAddress: userProfile.address || '',
            customerPlace: userProfile.place || '',
            customerPincode: userProfile.pincode || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // 2. Save to Firebase
        try {
            await push(ref(db, 'orders'), orderData);
            clearCart(); // Empty the cart after saving order
        } catch (err) {
            console.error("Error saving order:", err);
        }

        // 3. Prepare WhatsApp Message
        let message = "Hello NOOR BEE, I would like to place an order:\n\n";
        
        cartItems.forEach((item, index) => {
            const itemPrice = parsePrice(item.price);
            const itemTotal = (itemPrice * item.quantity).toFixed(2);
            message += `${index + 1}. ${item.title}\n`;
            if (item.size || item.color) {
                message += `   Details: ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `| Color: ${item.color}` : ''}\n`;
            }
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ₹${itemTotal}\n\n`;
        });
        
        message += `*Total Amount: ₹${total.toFixed(2)}*\n\n`;
        
        if (orderData.customerPhone) message += `📞 Phone: ${orderData.customerPhone}\n`;
        if (orderData.customerAddress) message += `📍 Address: ${orderData.customerAddress}\n\n`;
        
        message += "Please confirm my order.";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Cart Sidebar */}
                    <motion.div
                        className="cart-modal"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="cart-header">
                            <h2>Shopping Cart</h2>
                            <button className="cart-close" onClick={() => setIsCartOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="cart-items-container">
                            {cartItems.length === 0 ? (
                                <div className="empty-cart">
                                    <div className="empty-icon">🛒</div>
                                    <p>Your cart is empty</p>
                                    <p className="empty-subtext">Add some products to get started!</p>
                                </div>
                            ) : (
                                <div className="cart-items-list">
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.cartItemId}
                                            className="cart-item"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            {/* Item Image */}
                                            <div className="cart-item-image">
                                                <img src={item.image} alt={item.title} />
                                            </div>

                                            {/* Item Details */}
                                            <div className="cart-item-details">
                                                <h4 className="cart-item-title">{item.title}</h4>
                                                <p className="cart-item-variant">
                                                    {item.color} • {item.size}
                                                </p>
                                                <p className="cart-item-price">₹{parsePrice(item.price).toFixed(2)}</p>

                                                {/* Quantity Controls */}
                                                <div className="quantity-controls">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="qty-display">{item.quantity}</span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Item Price & Remove */}
                                            <div className="cart-item-actions">
                                                <p className="item-total">
                                                    ₹{(parsePrice(item.price) * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                {/* Summary */}
                                <div className="cart-summary">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span className="free-shipping">FREE</span>
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="summary-row total-row">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button className="checkout-btn" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </button>

                                {/* Continue Shopping */}
                                <button
                                    className="continue-shopping-btn"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartModal;
