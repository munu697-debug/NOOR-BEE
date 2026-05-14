import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (e) {
                console.error('Error loading cart:', e);
                return [];
            }
        }
        return [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Wishlist State
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try { return JSON.parse(savedWishlist); } 
            catch (e) { return []; }
        }
        return [];
    });
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToCart = (product, options = {}) => {
        const { color = 'Golden', size = '500g', quantity = 1 } = options;
        
        const cartItemId = `${product.id}-${color}-${size}`;
        
        const existingItem = cartItems.find(item => item.cartItemId === cartItemId);
        
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.cartItemId === cartItemId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCartItems([...cartItems, {
                cartItemId,
                ...product,
                color,
                size,
                quantity
            }]);
        }
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId);
        } else {
            setCartItems(cartItems.map(item =>
                item.cartItemId === cartItemId
                    ? { ...item, quantity }
                    : item
            ));
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            let price = 0;
            if (typeof item.price === 'number') {
                price = item.price;
            } else if (typeof item.price === 'string') {
                price = parseFloat(item.price.replace(/[₹$,]/g, '')) || 0;
            }
            return total + (price * item.quantity);
        }, 0);
    };

    // Wishlist functions
    const toggleWishlist = (product) => {
        if (wishlistItems.find(item => item.id === product.id)) {
            setWishlistItems(wishlistItems.filter(item => item.id !== product.id));
        } else {
            setWishlistItems([...wishlistItems, product]);
        }
    };

    const isInWishlist = (productId) => {
        return !!wishlistItems.find(item => item.id === productId);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
                isCartOpen,
                setIsCartOpen,
                wishlistItems,
                toggleWishlist,
                isInWishlist,
                isWishlistOpen,
                setIsWishlistOpen
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
