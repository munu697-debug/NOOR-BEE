import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Users, Settings, LogOut,
  Plus, Edit2, Trash2, X, Save, TrendingUp, ShoppingCart,
  Star, RefreshCw, Lock, Eye, EyeOff, CheckCircle
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, onValue, set, remove, push, update } from 'firebase/database';
import './AdminPanel.css';

// ─── ADMIN CREDENTIALS (change these) ────────────────────────────────────────
const ADMIN_EMAILS = ['noorbeehoneynuts@gmail.com', 'munavvirmekd@gmail.com'];
// ─── CLOUDINARY CONFIG ───────────────────────────────────────────────────────
const CLOUD_NAME = 'dwu0obvje';     // 🔴 Cloudinary Cloud Name updated
const UPLOAD_PRESET = 'my_unsigned_upload';
const CLOUDINARY_FOLDER = 'products';
// ─────────────────────────────────────────────────────────────────────────────

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data from Firebase
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [festiveSectionEnabled, setFestiveSectionEnabled] = useState(false);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', price: '', description: '', category: '', stock: '', badge: '', sizes: '', image: '', isFestive: false
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Change password form
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [showPwFields, setShowPwFields] = useState({ current: false, newPass: false, confirm: false });

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // Load Settings
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const settingsRef = ref(db, 'settings/festiveSectionEnabled');
    const unsub = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setFestiveSectionEnabled(snapshot.val());
      }
    });
    return () => unsub();
  }, [isAdminLoggedIn]);

  // Load products from Firebase
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const productsRef = ref(db, 'products');
    const unsub = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setProducts(list);
      } else {
        setProducts([]);
      }
    });
    return () => unsub();
  }, [isAdminLoggedIn]);

  // Load customers from Firebase
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setCustomers(list);
      } else {
        setCustomers([]);
      }
    });
    return () => unsub();
  }, [isAdminLoggedIn]);

  // Load orders from Firebase
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const ordersRef = ref(db, 'orders');
    const unsub = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        // Sort by date (newest first)
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(list);
      } else {
        setOrders([]);
      }
    });
    return () => unsub();
  }, [isAdminLoggedIn]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'success' : 'pending';
    try {
      await update(ref(db, `orders/${orderId}`), { status: nextStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      await remove(ref(db, `orders/${orderId}`));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      if (!result.user.email || !ADMIN_EMAILS.includes(result.user.email)) {
        await signOut(auth);
        setLoginError('You do not have admin privileges.');
      }
    } catch (err) {
      setLoginError('Invalid email or password. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleAdminLogout = async () => {
    await signOut(auth);
    setIsAdminLoggedIn(false);
  };

  // ── Products CRUD ──────────────────────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ title: '', price: '', description: '', category: '', stock: '', badge: '', sizes: '', image: '', isFestive: false });
    setImagePreview('');
    setShowProductForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || '',
      stock: product.stock || '',
      badge: product.badge || '',
      sizes: (product.sizes || []).join(', '),
      image: product.image || '',
      isFestive: !!product.isFestive
    });
    setImagePreview(product.image || '');
    setShowProductForm(true);
  };

  // ── Cloudinary Image Upload ─────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setProductForm(prev => ({ ...prev, image: data.secure_url }));
        setImagePreview(data.secure_url);
      } else {
        alert('Upload failed. Check your Cloudinary config.');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    }
    setImageUploading(false);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    };

    if (editingProduct) {
      await set(ref(db, `products/${editingProduct.id}`), payload);
    } else {
      payload.createdAt = new Date().toISOString();
      await push(ref(db, 'products'), payload);
    }
    setShowProductForm(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await remove(ref(db, `products/${id}`));
    }
  };

  // ── Render: Login Gate ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="admin-loading">
        <RefreshCw size={32} className="spinning" />
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <Lock size={32} className="admin-lock-icon" />
            <h2>Admin Access</h2>
            <p>Noor Bee CMS — Restricted Area</p>
          </div>

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@noorbee.com"
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>
              <div className="admin-pass-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && <div className="admin-login-error">{loginError}</div>}

            <button type="submit" className="admin-login-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <a href="/" className="admin-back-link">← Back to Store</a>
        </div>
      </div>
    );
  }

  // ── Dashboard Stats ────────────────────────────────────────────────────────
  const renderDashboard = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Calculate Unique Customer Count (from users list + any unique emails in orders)
    const registeredEmails = new Set(customers.map(c => c.email?.toLowerCase()));
    const orderEmails = new Set(orders.map(o => o.userEmail?.toLowerCase()).filter(e => e && e !== 'Guest' && e !== 'guest'));
    const uniqueCustomerCount = new Set([...registeredEmails, ...orderEmails]).size;

    return (
      <div className="cms-dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products"><Package size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customers"><Users size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{uniqueCustomerCount}</span>
              <span className="stat-label">Customers</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orders"><ShoppingCart size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{orders.length}</span>
              <span className="stat-label">Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue"><TrendingUp size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">₹{totalRevenue.toFixed(2)}</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </div>

        <div className="dashboard-flex">
          <div className="recent-section">
            <h3>Recent Customers</h3>
            {customers.length === 0 ? (
              <p className="empty-msg">No customers yet.</p>
            ) : (
              <div className="customer-list">
                {customers.slice(0, 5).map(c => (
                  <div key={c.id} className="customer-row">
                    <div className="customer-avatar">{(c.name || 'U').charAt(0).toUpperCase()}</div>
                    <div className="customer-info">
                      <strong>{c.name || 'Unknown'}</strong>
                      <span>{c.email || 'No email'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="recent-section">
            <h3>Recent Orders</h3>
            {orders.length === 0 ? (
              <p className="empty-msg">No orders yet.</p>
            ) : (
              <div className="order-list">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="order-row">
                    <div className="order-main">
                      <div className="order-top-info">
                        <strong>₹{o.totalAmount?.toFixed(2)}</strong>
                        <div className="order-actions-inline">
                          <span 
                            className={`order-status-badge ${o.status} clickable`}
                            onClick={() => handleUpdateStatus(o.id, o.status)}
                            title="Click to toggle status"
                          >
                            {o.status === 'success' ? (
                              <><CheckCircle size={14} /> Delivered</>
                            ) : (
                              'Mark as Delivered'
                            )}
                          </span>
                          <button className="order-del-btn" onClick={() => handleDeleteOrder(o.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="order-customer-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{o.customerName || 'Guest'}</span>
                        <span>{o.userEmail}</span>
                        {o.customerPhone && <span style={{ color: 'var(--color-gold-dark)', fontWeight: '500' }}>📞 {o.customerPhone}</span>}
                        {o.customerAddress && <span style={{ fontSize: '12px', color: '#64748b' }}>📍 {o.customerAddress}</span>}
                      </div>
                      <div className="order-items-summary">
                        {o.items?.map((item, idx) => (
                          <span key={idx} className="order-item-tag">
                            {item.quantity}x {item.title}
                          </span>
                        ))}
                      </div>
                      <div className="order-date">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Products Tab ───────────────────────────────────────────────────────────
  const renderProducts = () => (
    <div className="cms-products">
      <div className="cms-header-bar">
        <h2>Products <span className="count-badge">{products.length}</span></h2>
        <button className="cms-add-btn" onClick={openAddProduct}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="cms-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="product-name-cell">
                    <strong>{p.title}</strong>
                    <span>{p.description?.slice(0, 40)}...</span>
                  </td>
                  <td><span className="category-tag">{p.category || '—'}</span></td>
                  <td className="price-cell">₹{parseFloat(p.price || 0).toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${p.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                      {p.stock > 0 ? `${p.stock} left` : 'Out of Stock'}
                    </span>
                  </td>
                  <td>{p.badge ? <span className="badge-tag">{p.badge}</span> : '—'}</td>
                  <td className="action-cell">
                    <button className="act-btn edit" onClick={() => openEditProduct(p)}><Edit2 size={15} /></button>
                    <button className="act-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ── Customers Tab ──────────────────────────────────────────────────────────
  const renderCustomers = () => {
    // 1. Get existing registered customers
    const regMap = new Map();
    customers.forEach(c => {
      if (c.email) {
        const email = c.email.toLowerCase();
        // Check if profile is empty, if so, look for latest order info
        let phone = c.phone;
        let address = c.address;
        let place = c.place;
        let pincode = c.pincode;

        if (!phone || !address) {
          const userLatestOrder = [...orders]
            .filter(o => o.userEmail?.toLowerCase() === email)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          
          if (userLatestOrder) {
            phone = phone || userLatestOrder.customerPhone;
            address = address || userLatestOrder.customerAddress;
            place = place || userLatestOrder.customerPlace;
            pincode = pincode || userLatestOrder.customerPincode;
          }
        }

        regMap.set(email, { ...c, phone, address, place, pincode, isRegistered: true });
      }
    });

    // 2. Add emails from orders that aren't registered yet
    orders.forEach(o => {
      if (o.userEmail && o.userEmail !== 'Guest' && o.userEmail !== 'guest') {
        const email = o.userEmail.toLowerCase();
        if (!regMap.has(email)) {
          regMap.set(email, {
            id: `temp_${email}`,
            name: o.customerName || 'Customer (From Order)',
            email: o.userEmail,
            phone: o.customerPhone || '—',
            address: o.customerAddress || '—',
            place: o.customerPlace || '—',
            pincode: o.customerPincode || '—',
            isRegistered: false
          });
        }
      }
    });

    const combinedList = Array.from(regMap.values());

    return (
      <div className="cms-customers">
        <div className="cms-header-bar">
          <h2>Customers <span className="count-badge">{combinedList.length}</span></h2>
        </div>
        {combinedList.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>No registered customers yet.</p>
          </div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Place</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {combinedList.map(c => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name || '—'}</strong>
                      {!c.isRegistered && <span className="new-tag" style={{ fontSize: '10px', marginLeft: '6px', padding: '2px 4px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px' }}>New</span>}
                    </td>
                    <td>{c.email || '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.address || '—'}</td>
                    <td>{c.place || '—'}</td>
                    <td>{c.pincode || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ── Product Form Modal ─────────────────────────────────────────────────────
  const renderProductForm = () => (
    <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close" onClick={() => setShowProductForm(false)}><X size={20} /></button>
        </div>

        <form onSubmit={handleSaveProduct} className="product-form">
          <div className="form-row-2">
            <div className="cms-form-group">
              <label>Product Name *</label>
              <input value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} required placeholder="e.g. Raw Forest Honey" />
            </div>
            <div className="cms-form-group">
              <label>Price (₹) *</label>
              <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required placeholder="e.g. 299" />
            </div>
          </div>

          <div className="form-row-2">
            <div className="cms-form-group">
              <label>Category</label>
              <input value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} placeholder="e.g. Honey, Nuts" />
            </div>
            <div className="cms-form-group">
              <label>Stock Quantity</label>
              <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} placeholder="e.g. 50" />
            </div>
          </div>

          <div className="cms-form-group">
            <label>Description</label>
            <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={3} placeholder="Short product description..." />
          </div>

          <div className="form-row-2">
            <div className="cms-form-group">
              <label>Badge Label</label>
              <input value={productForm.badge} onChange={e => setProductForm({...productForm, badge: e.target.value})} placeholder="e.g. Bestseller, New" />
            </div>
            <div className="cms-form-group">
              <label>Sizes (comma separated)</label>
              <input value={productForm.sizes} onChange={e => setProductForm({...productForm, sizes: e.target.value})} placeholder="e.g. 250g, 500g, 1kg" />
            </div>
          </div>

          <div className="cms-form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={productForm.isFestive} 
                onChange={e => setProductForm({...productForm, isFestive: e.target.checked})} 
              />
              <span>Mark as Festive / Bulk Package Product</span>
            </label>
          </div>

          {/* ── Cloudinary Image Upload ── */}
          <div className="cms-form-group">
            <label>Product Image</label>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview-wrap">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button type="button" className="image-remove-btn"
                    onClick={() => { setImagePreview(''); setProductForm(p => ({ ...p, image: '' })); }}>
                    <X size={16} /> Remove
                  </button>
                </div>
              ) : (
                <label htmlFor="img-upload" className="image-upload-label">
                  {imageUploading ? (
                    <><RefreshCw size={20} className="spinning" /> Uploading...</>
                  ) : (
                    <><span className="upload-icon">📷</span> Click to upload image<br/><small>JPG, PNG, WEBP</small></>
                  )}
                  <input
                    id="img-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                </label>
              )}
            </div>
            {productForm.image && (
              <p className="image-url-text">✅ Cloudinary URL saved</p>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowProductForm(false)}>Cancel</button>
            <button type="submit" className="btn-save" disabled={imageUploading}>
              <Save size={16} /> {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ── Settings / Change Password ─────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (pwForm.newPass !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPass.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }

    setPwLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, pwForm.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, pwForm.newPass);
      setPwSuccess(true);
      setPwForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setPwError('Current password is incorrect.');
      } else {
        setPwError('Failed to update password. Please try again.');
      }
    }
    setPwLoading(false);
  };

  const renderSettings = () => (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-card-header">
          <Lock size={22} className="settings-icon" />
          <div>
            <h3>Change Password</h3>
            <p>Update your admin account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="settings-form">
          {/* Current Password */}
          <div className="cms-form-group">
            <label>Current Password</label>
            <div className="admin-pass-wrapper">
              <input
                type={showPwFields.current ? 'text' : 'password'}
                value={pwForm.current}
                onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                placeholder="Enter current password"
                required
              />
              <button type="button" className="toggle-pass-light"
                onClick={() => setShowPwFields(p => ({ ...p, current: !p.current }))}>
                {showPwFields.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="cms-form-group">
            <label>New Password</label>
            <div className="admin-pass-wrapper">
              <input
                type={showPwFields.newPass ? 'text' : 'password'}
                value={pwForm.newPass}
                onChange={e => setPwForm({ ...pwForm, newPass: e.target.value })}
                placeholder="Min. 6 characters"
                required
              />
              <button type="button" className="toggle-pass-light"
                onClick={() => setShowPwFields(p => ({ ...p, newPass: !p.newPass }))}>
                {showPwFields.newPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="cms-form-group">
            <label>Confirm New Password</label>
            <div className="admin-pass-wrapper">
              <input
                type={showPwFields.confirm ? 'text' : 'password'}
                value={pwForm.confirm}
                onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                placeholder="Re-enter new password"
                required
              />
              <button type="button" className="toggle-pass-light"
                onClick={() => setShowPwFields(p => ({ ...p, confirm: !p.confirm }))}>
                {showPwFields.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {pwError && <div className="settings-error">{pwError}</div>}
          {pwSuccess && <div className="settings-success">✅ Password updated successfully!</div>}

          <button type="submit" className="btn-save" disabled={pwLoading}>
            <Save size={16} /> {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Admin Info Card */}
      </div>

      {/* Website Controls */}
      <div className="settings-card">
        <div className="settings-card-header">
          <RefreshCw size={22} className="settings-icon" />
          <div>
            <h3>Website Sections</h3>
            <p>Toggle visibility of special sections</p>
          </div>
        </div>
        <div className="settings-info-row">
          <span>Show Festive & Bulk Packages Section</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={festiveSectionEnabled} 
              onChange={async (e) => {
                const val = e.target.checked;
                setFestiveSectionEnabled(val);
                await set(ref(db, 'settings/festiveSectionEnabled'), val);
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );

  // ── Main Layout ────────────────────────────────────────────────────────────
  return (
    <div className="admin-cms-container">
      {showProductForm && renderProductForm()}

      {/* Sidebar */}
      <aside className="cms-sidebar">
        <div className="cms-brand">
          <img src="/images/logo/logo.png" alt="Noor Bee" className="cms-logo" />
          <span>Admin CMS</span>
        </div>

        <nav className="cms-nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`cms-nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button className="cms-logout" onClick={handleAdminLogout}>
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="cms-main">
        <header className="cms-topbar">
          <div>
            <h1 className="cms-page-title">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="cms-breadcrumb">Noor Bee / {activeTab}</p>
          </div>
          <div className="cms-admin-info">
            <div className="cms-admin-dot"></div>
            <span>Admin</span>
          </div>
        </header>

        <div className="cms-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'customers' && renderCustomers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
