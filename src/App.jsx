import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Heart, User, PlusCircle, MapPin, 
  Car, Smartphone, Laptop, Home as HomeIcon, Briefcase, 
  ArrowLeft, Phone, MessageCircle, Trash2, X, Navigation, RefreshCw, Clock,
  Eye, Tag, QrCode, ShieldCheck, Bell, CheckCircle2, AlertCircle, Send, Camera
} from 'lucide-react';

function AppLogo({ size = "md" }) {
  const isLarge = size === "lg";
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <div style={{ 
        width: isLarge ? '56px' : '38px', 
        height: isLarge ? '56px' : '38px', 
        backgroundColor: '#f97316', 
        color: '#ffffff', 
        fontWeight: '900', 
        fontSize: isLarge ? '26px' : '18px',
        borderRadius: '14px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(249, 115, 22, 0.3)',
        border: '2px solid #fed7aa'
      }}>
        H
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: isLarge ? '22px' : '16px', fontWeight: '900', color: '#0f172a' }}>HNC</span>
          <span style={{ fontSize: isLarge ? '22px' : '16px', fontWeight: '900', color: '#f97316' }}>Hub</span>
        </div>
        <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Marketplace</span>
      </div>
    </div>
  );
}

function getTimeRemaining(expiryTime) {
  const total = new Date(expiryTime) - new Date();
  if (total <= 0) return 'Expired';
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export default function App() {
  // --- USER AUTH STATE ---
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authError, setAuthError] = useState('');

  // --- GPS LOCATION STATE ---
  const [currentLocation, setCurrentLocation] = useState('Jaipur, RJ');
  const [isLocating, setIsLocating] = useState(false);
  const [locationModal, setLocationModal] = useState(false);

  // --- MODALS & CHAT STATES ---
  const [paymentModal, setPaymentModal] = useState(null);
  const [offerModal, setOfferModal] = useState(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [txnId, setTxnId] = useState('');
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'seller', text: 'Hello! Is this item still available?', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to HNC Hub!', body: 'UI alignment fixed for bottom navigation.', time: 'Just now', read: false }
  ]);
  const [adminRequests, setAdminRequests] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('hnc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.suburb || data.address.state_district || 'Jaipur';
          const state = data.address.state ? data.address.state.slice(0, 2).toUpperCase() : '';
          const locName = `${city}${state ? ', ' + state : ''}`;
          
          setCurrentLocation(locName);
          if (user) {
            const updatedUser = { ...user, location: locName };
            setUser(updatedUser);
            localStorage.setItem('hnc_user', JSON.stringify(updatedUser));
          }
        } catch (err) {
          setCurrentLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        } finally {
          setIsLocating(false);
          setLocationModal(false);
        }
      },
      () => {
        setIsLocating(false);
        alert('Unable to fetch location. Please check GPS permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (isSignUp) {
      if (!fullName.trim()) { setAuthError('Please enter your full name.'); return; }
      if (!email.trim() || !email.includes('@')) { setAuthError('Please enter a valid email address.'); return; }
    }
    setAuthError('');

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    const userData = { 
      phone: fullPhone, 
      name: isSignUp ? fullName.trim() : ('User ' + phoneNumber.slice(-4)), 
      email: isSignUp ? email.trim() : (phoneNumber + '@hnchub.com'),
      location: currentLocation 
    };

    localStorage.setItem('hnc_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('hnc_user');
    setUser(null);
    setCurrentScreen('home');
  };

  // --- APP NAVIGATION & ADS STATE ---
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [ads, setAds] = useState([
    {
      id: 1,
      title: 'Toyota Corolla 2021',
      price: '1250000',
      category: 'Vehicles',
      location: 'Malviya Nagar, Jaipur',
      expiryTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 42,
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Well maintained family car, first owner, insurance valid till end of year.',
      seller: 'Rahul K.',
      sellerPhone: '+919876543210',
      sellerJoined: '2021'
    },
    {
      id: 2,
      title: 'iPhone 13 Pro (128GB)',
      price: '48000',
      category: 'Mobiles',
      location: 'Vaishali Nagar, Jaipur',
      expiryTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      views: 128,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Selling my well-maintained iPhone in mint condition. Includes original box and fast charger.',
      seller: 'Amit S.',
      sellerPhone: '+919123456789',
      sellerJoined: '2022'
    }
  ]);

  const [wishlist, setWishlist] = useState([2]);

  const [newAd, setNewAd] = useState({
    title: '',
    price: '',
    category: 'Mobiles',
    location: currentLocation,
    description: '',
    images: []
  });

  const categories = [
    { name: 'Vehicles', icon: Car },
    { name: 'Properties', icon: HomeIcon },
    { name: 'Electronics', icon: Laptop },
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Furniture', icon: Briefcase },
  ];

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const openAdDetail = (ad) => {
    const updatedAds = ads.map(item => item.id === ad.id ? { ...item, views: item.views + 1 } : item);
    setAds(updatedAds);
    setSelectedProduct({ ...ad, views: ad.views + 1 });
    setActiveImageIndex(0);
    setCurrentScreen('detail');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (newAd.images.length + files.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAd(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setNewAd(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handlePublishAd = (e) => {
    e.preventDefault();
    if (!newAd.title || !newAd.price) return;
    
    const finalImages = newAd.images.length > 0 ? newAd.images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'];
    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const createdAd = {
      id: Date.now(),
      title: newAd.title,
      price: newAd.price,
      category: newAd.category,
      location: currentLocation,
      expiryTime: threeDaysLater,
      views: 1,
      images: finalImages,
      description: newAd.description || newAd.title,
      seller: user ? user.name : 'Guest User',
      sellerPhone: user ? user.phone.replace(/\s+/g, '') : '+919876543210',
      sellerJoined: '2026'
    };

    setAds([createdAd, ...ads]);
    setCurrentScreen('home');
    setNewAd({ title: '', price: '', category: 'Mobiles', location: currentLocation, description: '', images: [] });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { id: Date.now(), sender: 'buyer', text: newMessage.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, userMsg]);
    setNewMessage('');

    setNotifications([
      {
        id: Date.now(),
        title: `New Message from ${user.name}`,
        body: `"${userMsg.text}" regarding your ad "${selectedProduct.title}"`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!txnId.trim()) { alert('Please enter Paytm Transaction ID / UTR number.'); return; }

    const newRequest = {
      id: Date.now(),
      adId: paymentModal.id,
      adTitle: paymentModal.title,
      userPhone: user.phone,
      userName: user.name,
      amount: '199',
      txnId: txnId.trim(),
      status: 'pending'
    };

    setAdminRequests([newRequest, ...adminRequests]);
    alert('Payment details submitted! Admin confirmation pending.');
    setPaymentModal(null);
    setTxnId('');
  };

  const handleAdminApprove = (reqId) => {
    const req = adminRequests.find(r => r.id === reqId);
    if (!req) return;

    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setAds(ads.map(ad => ad.id === req.adId ? { ...ad, expiryTime: newExpiry } : ad));
    setAdminRequests(adminRequests.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));

    setNotifications([
      {
        id: Date.now(),
        title: 'Payment Received & Ad Renewed! 🎉',
        body: `Payment of ₹199 for "${req.adTitle}" confirmed by Admin. Extended for 7 Days!`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
  };

  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!offeredPrice || Number(offeredPrice) <= 0) { alert('Please enter a valid offer amount.'); return; }

    setNotifications([
      {
        id: Date.now(),
        title: `New Price Offer: ₹${offeredPrice}`,
        body: `${user.name} offered ₹${offeredPrice} for "${offerModal.title}" (Original Price: ₹${offerModal.price}).`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);

    alert(`Offer of ₹${offeredPrice} sent successfully to seller!`);
    setOfferModal(null);
    setOfferedPrice('');
  };

  const filteredAds = ads.filter(ad => {
    const matchesCategory = selectedCategory === 'All' || ad.category === selectedCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // 1. MANDATORY LOGIN / SIGNUP SCREEN
  // ==========================================
  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
        <div style={{ width: '100%', maxWidth: '400px', height: '850px', backgroundColor: '#FFF9F5', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', border: '8px solid #1e293b', padding: '24px', justifyContent: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', marginBottom: '10px' }}>
              <AppLogo size="lg" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginTop: '6px' }}>
              {isSignUp ? 'Create New Account' : 'Welcome Back'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
              {isSignUp ? 'Register with details & mobile number' : 'Sign in to access your marketplace'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isSignUp && (
              <>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Rahul Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', outline: 'none' }}
                    required={isSignUp}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', outline: 'none' }}
                    required={isSignUp}
                  />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>Mobile Number (Mandatory)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 'bold', fontSize: '12px', borderRadius: '12px', padding: '10px 6px', outline: 'none' }}
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+971">+971 (UAE)</option>
                </select>

                <input 
                  type="tel" 
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhoneNumber(val);
                  }}
                  style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', outline: 'none' }}
                  maxLength={10}
                  required
                />
              </div>
              {authError && <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>{authError}</p>}
            </div>

            <button 
              type="submit"
              style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 12px -3px rgba(249, 115, 22, 0.3)', marginTop: '6px' }}
            >
              {isSignUp ? 'Register & Continue' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
              style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // 2. MAIN APP INTERFACE (Logged In)
  // ==========================================
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', height: '850px', backgroundColor: '#FFF9F5', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', border: '8px solid #1e293b' }}>

        {/* HOME FEED */}
        {currentScreen === 'home' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header style={{ backgroundColor: '#ffffff', padding: '16px', borderBottom: '1px solid #ffedd5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <AppLogo size="sm" />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => setCurrentScreen('notifications')}
                    style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    <Bell size={16} className="text-slate-700" />
                    {notifications.some(n => !n.read) && (
                      <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                    )}
                  </button>

                  <button 
                    onClick={() => setLocationModal(true)}
                    style={{ display: 'flex', alignItems: 'center', fontSize: '11px', backgroundColor: '#ffedd5', color: '#f97316', padding: '6px 10px', borderRadius: '20px', fontWeight: '700', gap: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    <MapPin size={13} />
                    <span>{currentLocation}</span>
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
                <input 
                  type="text"
                  placeholder="Search Cars, Mobiles, Electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 10px 10px 38px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </header>

            <main style={{ padding: '16px', flex: 1, overflowY: 'auto', paddingBottom: '90px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {categories.map((cat, idx) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button 
                      key={idx}
                      onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '70px', height: '75px', borderRadius: '16px', border: isSelected ? 'none' : '1px solid #ffedd5', backgroundColor: isSelected ? '#f97316' : '#ffffff', color: isSelected ? '#ffffff' : '#475569', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <IconComp size={20} style={{ marginBottom: '4px' }} />
                      <span style={{ fontSize: '11px', fontWeight: '600' }}>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {filteredAds.map((ad) => {
                  const timeRemaining = getTimeRemaining(ad.expiryTime);
                  const isExpired = timeRemaining === 'Expired';
                  const coverImage = ad.images && ad.images.length > 0 ? ad.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

                  return (
                    <div 
                      key={ad.id}
                      onClick={() => openAdDetail(ad)}
                      style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #ffedd5', cursor: 'pointer', display: 'flex', flexDirection: 'column', opacity: isExpired ? 0.65 : 1 }}
                    >
                      <div style={{ position: 'relative', height: '130px', backgroundColor: '#e2e8f0' }}>
                        <img src={coverImage} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        <div style={{ position: 'absolute', bottom: '6px', left: '6px', backgroundColor: isExpired ? '#ef4444' : 'rgba(15, 23, 42, 0.85)', color: '#ffffff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} />
                          <span>{timeRemaining}</span>
                        </div>

                        <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Eye size={10} />
                          <span>{ad.views}</span>
                        </div>

                        <button 
                          onClick={(e) => toggleWishlist(ad.id, e)}
                          style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                        >
                          <Heart size={14} className={wishlist.includes(ad.id) ? "fill-red-500 text-red-500" : "text-slate-600"} />
                        </button>
                      </div>

                      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <div>
                          <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>₹{Number(ad.price).toLocaleString()}</h3>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.title}</p>
                        </div>

                        {isExpired && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setPaymentModal(ad); }}
                            style={{ backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '4px', fontSize: '10px', fontWeight: 'bold', marginTop: '6px', cursor: 'pointer' }}
                          >
                            Renew ₹199 / Week
                          </button>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '10px', color: '#94a3b8' }}>
                          <MapPin size={10} />
                          <span>{ad.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        )}

        {/* PRODUCT DETAIL SCREEN */}
        {currentScreen === 'detail' && selectedProduct && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ position: 'relative', height: '260px', backgroundColor: '#0f172a' }}>
              <img 
                src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[activeImageIndex] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'} 
                alt={selectedProduct.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button 
                onClick={() => setCurrentScreen('home')}
                style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={18} />
              </button>

              <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} /> {selectedProduct.views} Views
              </div>

              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  {selectedProduct.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', border: activeImageIndex === idx ? '2px solid #f97316' : '2px solid white', padding: 0, cursor: 'pointer' }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>₹{Number(selectedProduct.price).toLocaleString()}</h1>
                  <span style={{ backgroundColor: '#fff7ed', color: '#f97316', border: '1px solid #ffedd5', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {getTimeRemaining(selectedProduct.expiryTime)}
                  </span>
                </div>

                <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#475569', marginBottom: '16px' }}>{selectedProduct.title}</h2>

                <button 
                  onClick={() => setOfferModal(selectedProduct)}
                  style={{ width: '100%', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', padding: '10px', borderRadius: '14px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}
                >
                  <Tag size={14} /> Make an Offer / Counter Price
                </button>

                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Description</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{selectedProduct.description}</p>
                </div>

                <div style={{ backgroundColor: '#fff7ed', padding: '12px', borderRadius: '16px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f97316', color: '#ffffff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedProduct.seller[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>Seller: {selectedProduct.seller}</h4>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Phone: {selectedProduct.sellerPhone}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '10px' }}>
                <a 
                  href={`tel:${selectedProduct.sellerPhone}`}
                  style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Phone size={16} /> Call Seller
                </a>
                <button 
                  onClick={() => setCurrentScreen('chat')}
                  style={{ flex: 1, backgroundColor: '#f97316', color: '#ffffff', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <MessageCircle size={16} /> In-App Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IN-APP CHAT SCREEN */}
        {currentScreen === 'chat' && selectedProduct && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f8fafc', zIndex: 60, display: 'flex', flexDirection: 'column' }}>
            <header style={{ backgroundColor: '#ffffff', padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('detail')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Chat with {selectedProduct.seller}</h3>
                <p style={{ fontSize: '10px', color: '#64748b' }}>Regarding: {selectedProduct.title}</p>
              </div>
            </header>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.sender === 'buyer' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  <div style={{ backgroundColor: msg.sender === 'buyer' ? '#f97316' : '#ffffff', color: msg.sender === 'buyer' ? '#ffffff' : '#0f172a', padding: '10px 14px', borderRadius: '16px', fontSize: '13px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: msg.sender === 'seller' ? '1px solid #e2e8f0' : 'none' }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', textAlign: msg.sender === 'buyer' ? 'right' : 'left', marginTop: '2px' }}>{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ backgroundColor: '#ffffff', padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input 
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                required
              />
              <button type="submit" style={{ backgroundColor: '#f97316', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* POST AD */}
        {currentScreen === 'sell' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
            <header style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Post Ad (Upto 5 Photos)</h1>
            </header>

            <form onSubmit={handlePublishAd} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Upload Photos (Max 5)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {newAd.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                      <img src={img} alt="preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {newAd.images.length < 5 && (
                    <label style={{ width: '70px', height: '70px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                      <Camera size={20} />
                      <span style={{ fontSize: '9px', marginTop: '2px' }}>Add Photo</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{newAd.images.length}/5 photos selected</span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Category</label>
                <select 
                  value={newAd.category}
                  onChange={(e) => setNewAd({...newAd, category: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                >
                  <option value="Mobiles">Mobiles</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Location (Auto-detected)</label>
                <input 
                  type="text" 
                  value={currentLocation}
                  disabled
                  style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold', color: '#475569' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="Set Price in ₹" 
                  value={newAd.price}
                  onChange={(e) => setNewAd({...newAd, price: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Title & Description</label>
                <textarea 
                  rows="3"
                  placeholder="What are you selling?" 
                  value={newAd.title}
                  onChange={(e) => setNewAd({...newAd, title: e.target.value, description: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                Publish Free Ad
              </button>
            </form>
          </div>
        )}

        {/* NOTIFICATIONS SCREEN */}
        {currentScreen === 'notifications' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto', paddingBottom: '90px' }}>
            <header style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Push Notifications</h1>
            </header>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f97316', fontWeight: 'bold', fontSize: '13px' }}>
                    <Bell size={14} />
                    <span>{n.title}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{n.body}</p>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '6px' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN PANEL SCREEN */}
        {currentScreen === 'admin' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto', paddingBottom: '90px' }}>
            <header style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Admin Panel — Payments</h1>
            </header>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Pending Renewal Payments (₹199)</h3>
              
              {adminRequests.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>No pending approval requests.</p>
              ) : (
                adminRequests.map(req => (
                  <div key={req.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '14px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>Ad: {req.adTitle}</h4>
                    <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>User: {req.userName} ({req.userPhone})</p>
                    <p style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', marginTop: '2px' }}>Txn ID: {req.txnId} (Amount: ₹{req.amount})</p>
                    
                    {req.status === 'pending' ? (
                      <button 
                        onClick={() => handleAdminApprove(req.id)}
                        style={{ width: '100%', backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}
                      >
                        Approve & Extend 7 Days
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#059669', display: 'block', marginTop: '6px' }}>✓ Approved & Extended</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PROFILE SCREEN */}
        {currentScreen === 'profile' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto', paddingBottom: '90px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '20px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', backgroundColor: '#f97316', color: '#ffffff', fontWeight: 'bold', fontSize: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user.name[0]}
                </div>
                <div>
                  <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px' }}>{user.name}</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{user.email}</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8' }}>{user.phone}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('admin')}
              style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '14px', fontWeight: 'bold', fontSize: '12px', marginBottom: '20px', cursor: 'pointer' }}
            >
              👑 Switch to Admin Approval Dashboard
            </button>

            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>My Listings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {ads.map(ad => (
                <div key={ad.id} style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '14px', border: '1px solid #ffedd5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={ad.images && ad.images.length > 0 ? ad.images[0] : ''} alt={ad.title} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '13px' }}>₹{ad.price} | {ad.title}</h4>
                        <p style={{ fontSize: '10px', color: '#f97316', fontWeight: 'bold' }}>{getTimeRemaining(ad.expiryTime)} • {ad.views} Views</p>
                      </div>
                    </div>
                    <button onClick={() => setAds(ads.filter(a => a.id !== ad.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => setPaymentModal(ad)}
                    style={{ width: '100%', backgroundColor: '#ffedd5', color: '#c2410c', border: 'none', padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginTop: '8px', cursor: 'pointer' }}
                  >
                    Extend Validity (₹199 / Week)
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleLogout}
              style={{ width: '100%', backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #fecaca', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: 'auto' }}
            >
              Logout / Switch Account
            </button>
          </div>
        )}

        {/* PAYTM QR PAYMENT MODAL */}
        {paymentModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: '24px', padding: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>Renew Ad (₹199 / Week)</h3>
                <button onClick={() => setPaymentModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <QrCode size={120} className="text-slate-800" />
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284c7', marginTop: '8px' }}>Scan with Paytm / Google Pay / PhonePe</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>UPI ID: paytmqr.hnchub@paytm</span>
              </div>

              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Paytm Txn ID / UTR No." 
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '13px', outline: 'none' }}
                  required
                />
                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', padding: '12px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Submit Payment for Admin Approval
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MAKE AN OFFER MODAL */}
        {offerModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>Make an Offer</h3>
                <button onClick={() => setOfferModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                Seller Price: <strong>₹{Number(offerModal.price).toLocaleString()}</strong>
              </p>

              <form onSubmit={handleSendOffer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Your Offer Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 13000" 
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', outline: 'none' }}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Send Price Offer to Seller
                </button>
              </form>
            </div>
          </div>
        )}

        {/* GPS LOCATION MODAL */}
        {locationModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: '24px', padding: '20px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#ffedd5', color: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <Navigation size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>Location Settings</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', marginBottom: '16px' }}>Current: <strong>{currentLocation}</strong></p>

              <button 
                onClick={fetchGPSLocation}
                disabled={isLocating}
                style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '12px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}
              >
                <RefreshCw size={14} className={isLocating ? "animate-spin" : ""} />
                {isLocating ? 'Detecting GPS...' : 'Auto-Detect My Location'}
              </button>

              <button 
                onClick={() => setLocationModal(false)}
                style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#64748b', padding: '12px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* PERFECTLY ALIGNED BOTTOM NAVIGATION BAR */}
        {currentScreen !== 'detail' && currentScreen !== 'chat' && (
          <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #ffedd5', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '70px', padding: '0 8px', zIndex: 40 }}>
            <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', color: currentScreen === 'home' ? '#f97316' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <Home size={22} />
              <span style={{ fontSize: '10px', fontWeight: currentScreen === 'home' ? 'bold' : 'normal', lineHeight: '1' }}>Home</span>
            </button>

            <button onClick={() => setCurrentScreen('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', color: currentScreen === 'profile' ? '#f97316' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <Heart size={22} />
              <span style={{ fontSize: '10px', fontWeight: currentScreen === 'profile' ? 'bold' : 'normal', lineHeight: '1' }}>My Ads</span>
            </button>

            {/* Central Floating Sell Button */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <button 
                onClick={() => setCurrentScreen('sell')} 
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '-24px', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f97316', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(249, 115, 22, 0.4)', border: '4px solid #FFF9F5' }}>
                  <PlusCircle size={26} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#f97316', marginTop: '2px', lineHeight: '1' }}>Sell</span>
              </button>
            </div>

            <button onClick={() => setCurrentScreen('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', color: currentScreen === 'profile' ? '#f97316' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <User size={22} />
              <span style={{ fontSize: '10px', fontWeight: currentScreen === 'profile' ? 'bold' : 'normal', lineHeight: '1' }}>Account</span>
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}
