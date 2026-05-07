import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Home, LogOut, CheckCircle, ShoppingCart } from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';
import { ref, set, get, child, onValue } from 'firebase/database';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import './UserProfile.css';

const ADMIN_EMAIL = 'admin@noorbee.com';

const UserProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [userOrders, setUserOrders] = useState([]);
  const { cartItems } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    place: '',
    pincode: ''
  });

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price.replace(/[₹$,]/g, '')) || 0;
    return 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If user is Admin, treat them as "Logged Out" for the user profile page
      if (user && user.email !== ADMIN_EMAIL) {
        setIsLoggedIn(true);
        
        // Fetch existing data from database
        const dbRef = ref(db);
        try {
          const snapshot = await get(child(dbRef, `users/${user.uid}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            setFormData(prev => ({
              ...prev,
              name: data.name || user.displayName || '',
              email: user.email || '',
              phone: data.phone || '',
              address: data.address || '',
              place: data.place || '',
              pincode: data.pincode || ''
            }));
          } else {
            // New user detected - Auto-register them in the database
            await set(ref(db, 'users/' + user.uid), {
              name: user.displayName || 'New Customer',
              email: user.email,
              createdAt: new Date().toISOString(),
              phone: '',
              address: '',
              place: '',
              pincode: ''
            });
            
            setFormData(prev => ({
              ...prev,
              name: user.displayName || '',
              email: user.email || ''
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch orders for the logged-in user
  useEffect(() => {
    if (!isLoggedIn || !auth.currentUser) {
      setUserOrders([]);
      return;
    }
    
    const currentUserEmail = auth.currentUser.email?.trim().toLowerCase();
    const currentUserUid = auth.currentUser.uid;
    
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .filter(order => {
            if (!order) return false;
            
            const orderEmail = order.userEmail?.trim().toLowerCase();
            // SMART RESCUE: Match if UID matches OR if Email matches (even for guest orders)
            const matchEmail = orderEmail && orderEmail === currentUserEmail;
            const matchUid = order.userUid && order.userUid === currentUserUid;
            
            // Also check if the order might have been placed with this email but marked as 'Guest'
            const isGuestMatch = (order.userEmail === 'Guest' || !order.userUid || order.userUid === 'guest_id') && 
                                (order.userEmail?.trim().toLowerCase() === currentUserEmail);

            return matchEmail || matchUid || isGuestMatch;
          });
        
        // Sort by date newest first
        list.sort((a, b) => {
          const dateA = new Date(b.createdAt || 0);
          const dateB = new Date(a.createdAt || 0);
          return dateA - dateB;
        });
        setUserOrders(list);
      } else {
        setUserOrders([]);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
    });

    return () => unsubscribe();
  }, [isLoggedIn, auth.currentUser?.uid]); // Use uid as stable dependency

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setIsLoggedIn(true);
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));

      // AUTO-SAVE customer to database if they don't exist
      try {
        const snapshot = await get(child(ref(db), 'users/' + user.uid));
        if (!snapshot.exists()) {
          await set(ref(db, 'users/' + user.uid), {
            name: user.displayName || 'New Customer',
            email: user.email,
            createdAt: new Date().toISOString(),
            phone: '',
            address: '',
            place: '',
            pincode: ''
          });
        }
      } catch (dbErr) {
        console.error("Error auto-registering user:", dbErr);
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
      alert("There was an error signing in. Please ensure Firebase is configured.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await set(ref(db, 'users/' + auth.currentUser.uid), {
        name: formData.name,
        email: formData.email, // Kept for reference
        phone: formData.phone,
        address: formData.address,
        place: formData.place,
        pincode: formData.pincode,
        updatedAt: new Date().toISOString()
      });
      
      setIsSaved(true);
      
      // Redirect to shop section after a brief delay to show success message
      setTimeout(() => {
        setIsSaved(false);
        window.location.hash = '#shop';
      }, 1500);

    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save. Please check database rules.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setFormData({
        name: '', email: '', phone: '', address: '', place: '', pincode: ''
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return <div className="auth-container"><p>Loading...</p></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <motion.div 
          className="auth-card glass-panel"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="auth-brand">
            <img src="/images/logo/logo.png" alt="Noor Bee" className="auth-logo" />
          </div>
          
          <div className="auth-header">
            <h2>Sign In</h2>
            <p>Access your orders and fast checkout</p>
          </div>
          
          <div className="auth-divider">
            <span>Secure Access</span>
          </div>
          
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src="/images/others/google/google-logo.svg" alt="Google" className="google-icon" />
            Continue with Google
          </button>
          
          <div className="auth-footer-text">
            If you don't have an account, one will be created automatically.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <div className="avatar-circle">{(formData.name || 'U').charAt(0).toUpperCase()}</div>
          <h3>{formData.name || 'User'}</h3>
          <p>{formData.email || 'No email'}</p>
        </div>
        <nav className="profile-nav">
          <button 
            className={`nav-item ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <User size={18} /> Personal Info
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <CheckCircle size={18} /> My Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            <ShoppingCart size={18} /> My Cart
          </button>
          <button className="nav-item logout" onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Personal Information</h2>
              <p>Update your shipping and contact details for faster checkout.</p>
            </div>

            <form className="profile-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Delivery Address</label>
                <div className="input-wrapper">
                  <Home size={18} className="input-icon" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House/Flat No., Street Name" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City / Place</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input type="text" name="place" value={formData.place} onChange={handleChange} placeholder="City Name" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 560001" required />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={isSaved}>
                  {isSaved ? <><CheckCircle size={18} /> Saved successfully</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Order History</h2>
              <p>Track your delivered honey and pending orders.</p>
            </div>

            {userOrders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-orders-icon">📦</div>
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => window.location.hash = '#shop'} className="save-btn" style={{ marginTop: '20px' }}>Shop Now</button>
              </div>
            ) : (
              <div className="user-orders-list">
                {userOrders.map(order => (
                  <div key={order.id} className={`user-order-card ${order.status || 'pending'}`}>
                    <div className="order-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f1f1f1' }}>
                      <span className="order-date" style={{ fontSize: '13px', color: '#666' }}>{formatDate(order.createdAt)}</span>
                      <span className={`order-status-badge ${order.status || 'pending'}`} style={{ 
                        fontSize: '11px', 
                        padding: '3px 10px', 
                        borderRadius: '20px', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: order.status === 'success' ? '#dcfce7' : '#fef9c3',
                        color: order.status === 'success' ? '#166534' : '#854d0e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {order.status === 'success' ? (
                          <><CheckCircle size={12} /> Delivered</>
                        ) : (
                          'Pending Arrival'
                        )}
                      </span>
                    </div>
                    <div className="order-items">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="order-item-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>
                          <span style={{ fontSize: '14px' }}>{item.quantity || 1}x {item.title || 'Product'}</span>
                          <span style={{ fontWeight: '500' }}>₹{(parsePrice(item.price) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '10px', borderTop: '2px solid #f1f1f1' }}>
                      <strong>Total Paid</strong>
                      <strong style={{ color: 'var(--color-gold-dark)' }}>₹{parsePrice(order.totalAmount).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>My Cart Items</h2>
              <p>Items you have added to your cart ready for checkout.</p>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="empty-orders">
                <p>Your cart is currently empty.</p>
                <button className="save-btn" onClick={() => window.location.hash = '#shop'} style={{ marginTop: '20px' }}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item" style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                    <img src={item.image || '/images/products/product1.png'} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--color-charcoal-dark)' }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                        {item.size || 'Standard'} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--color-gold-dark)' }}>
                      ₹{(parsePrice(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="save-btn" onClick={() => window.location.hash = '#shop'}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
