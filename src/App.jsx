import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Heart, User, PlusCircle, MapPin, 
  Car, Smartphone, Laptop, Home as HomeIcon, Briefcase, 
  ArrowLeft, Phone, MessageCircle, Trash2, X, Navigation, RefreshCw, Clock,
  Eye, Tag, QrCode, Bell, Send, Camera, Edit3
} from 'lucide-react';

const API_URL = 'http://187.52.117.122:5000/api';

function AppLogo({ size = "md" }) {
  const isLarge = size === "lg";
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <div style={{ 
        width: isLarge ? '56px' : '38px', 
        height: isLarge ? '56px' : '38px', 
        backgroundColor: '#d97706', 
        color: '#ffffff', 
        fontWeight: '900', 
        fontSize: isLarge ? '24px' : '16px',
        borderRadius: '14px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(217, 119, 6, 0.4)',
        border: '2px solid #fde68a'
      }}>
        ੴ
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: isLarge ? '22px' : '16px', fontWeight: '900', color: '#0f172a' }}>SAN</span>
          <span style={{ fontSize: isLarge ? '22px' : '16px', fontWeight: '900', color: '#d97706' }}>AGAT</span>
        </div>
        <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Marketplace</span>
      </div>
    </div>
  );
}

function getTimeRemaining(expiryTime) {
  if (!expiryTime) return '3d left';
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
  // 1. ALL STATES DECLARED AT TOP
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sanagat_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authError, setAuthError] = useState('');

  const [currentLocation, setCurrentLocation] = useState('Amritsar, PB');
  const [isLocating, setIsLocating] = useState(false);
  const [locationModal, setLocationModal] = useState(false);

  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [ads, setAds] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('sanagat_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState([]);
  const [notificationToast, setNotificationToast] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [offerModal, setOfferModal] = useState(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [newAd, setNewAd] = useState({
    title: '',
    price: '',
    category: 'Mobiles',
    location: currentLocation,
    description: '',
    images: []
  });

  // 2. EFFECTS
  useEffect(() => {
    fetchAds();
    const interval = setInterval(fetchAds, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('sanagat_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Chat polling & Notifications
  useEffect(() => {
    if (selectedProduct) {
      const checkNewMessages = async () => {
        try {
          const res = await fetch(`${API_URL}/chats/${selectedProduct.id}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            if (data.length > messages.length && messages.length > 0) {
              const latestMsg = data[data.length - 1];
              if (latestMsg.sender_phone !== user?.phone) {
                setNotificationToast(`New message from ${latestMsg.sender_name || 'User'}: ${latestMsg.message}`);
                setTimeout(() => setNotificationToast(null), 4000);
              }
            }
            setMessages(data);
          }
        } catch (err) {}
      };

      checkNewMessages();
      const interval = setInterval(checkNewMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedProduct, messages.length, user]);

  // 3. FUNCTIONS
  const fetchAds = async () => {
    try {
      const res = await fetch(`${API_URL}/ads`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const formattedAds = data.map(ad => {
          let parsedImages = ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'];
          try {
            if (ad.images) parsedImages = JSON.parse(ad.images);
          } catch (e) {}
          return { ...ad, images: parsedImages };
        });
        setAds(formattedAds);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
    }
  };

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
          const city = data.address.city || data.address.town || data.address.suburb || 'Amritsar';
          setCurrentLocation(city);
        } catch (err) {
          setCurrentLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        } finally {
          setIsLocating(false);
          setLocationModal(false);
        }
      },
      () => {
        setIsLocating(false);
        alert('Unable to fetch GPS location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 4) {
      setAuthError('Please enter a valid mobile number.');
      return;
    }
    const fullPhone = `${countryCode}${phoneNumber.trim()}`;
    setAuthError('');

    if (isSignUp) {
      if (!fullName.trim()) { setAuthError('Please enter your full name.'); return; }
      if (!email.trim() || !email.includes('@')) { setAuthError('Please enter a valid email.'); return; }
      if (!password || password.length < 6) { setAuthError('Password must be at least 6 chars.'); return; }

      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fullName.trim(), email: email.trim(), phone: fullPhone, password, location: currentLocation })
        });
        const data = await res.json();
        if (!res.ok) { setAuthError(data.error || 'Signup failed'); return; }
        alert('Registration successful! Please sign in.');
        setIsSignUp(false);
      } catch (err) {
        setAuthError('Server connection error.');
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: fullPhone, password })
        });
        const data = await res.json();
        if (!res.ok) { setAuthError(data.error || 'Invalid credentials'); return; }
        localStorage.setItem('sanagat_user', JSON.stringify(data.user));
        setUser(data.user);
      } catch (err) {
        setAuthError('Server connection error.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sanagat_user');
    setUser(null);
    setCurrentScreen('home');
  };

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const openAdDetail = (ad) => {
    setSelectedProduct(ad);
    setActiveImageIndex(0);
    setCurrentScreen('detail');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (newAd.images.length + files.length > 5) {
      alert('You can upload max 5 images.');
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAd(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setNewAd(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handlePublishAd = async (e) => {
    e.preventDefault();
    if (!newAd.title || !newAd.price) return;

    const finalImages = newAd.images.length > 0 ? newAd.images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'];
    const adPayload = {
      title: newAd.title,
      price: newAd.price,
      category: newAd.category,
      location: currentLocation,
      description: newAd.description || newAd.title,
      seller_name: user ? user.name : 'User',
      seller_phone: user ? user.phone : '+919876543210',
      images: JSON.stringify(finalImages)
    };

    try {
      const res = await fetch(`${API_URL}/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adPayload)
      });
      if (res.ok) {
        fetchAds();
        setCurrentScreen('home');
        setNewAd({ title: '', price: '', category: 'Mobiles', location: currentLocation, description: '', images: [] });
      }
    } catch (err) {
      console.error('Error posting ad:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProduct) return;

    try {
      await fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad_id: selectedProduct.id,
          sender_phone: user.phone,
          sender_name: user.name,
          message: newMessage.trim()
        })
      });
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!offeredPrice || Number(offeredPrice) <= 0) { alert('Enter valid offer price'); return; }
    try {
      await fetch(`${API_URL}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_id: selectedProduct.id, buyer_phone: user.phone, buyer_name: user.name, offered_price: offeredPrice })
      });
      alert(`Offer of ₹${offeredPrice} sent successfully to seller!`);
      setOfferModal(null);
      setOfferedPrice('');
    } catch (err) {
      alert('Failed to send offer.');
    }
  };

  const categories = [
    { name: 'Vehicles', icon: Car },
    { name: 'Properties', icon: HomeIcon },
    { name: 'Electronics', icon: Laptop },
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Furniture', icon: Briefcase },
  ];

  const filteredAds = ads.filter(ad => {
    const matchesCategory = selectedCategory === 'All' || ad.category === selectedCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const myAds = user ? ads.filter(a => a.seller_phone === user.phone) : [];

  // Background style with Gurudwara watermark background across all views
  const containerBgStyle = {
    backgroundColor: '#0f172a',
    backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)), url("https://images.unsplash.com/photo-1588598198321-8f85e494e8a8?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  };

  // LOGIN / REGISTER SCREEN
  if (!user) {
    return (
      <div style={containerBgStyle}>
        <div style={{ width: '100%', maxWidth: '400px', height: '850px', backgroundColor: '#FFFBEB', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', border: '8px solid #d97706', padding: '24px', justifyContent: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', marginBottom: '10px' }}><AppLogo size="lg" /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
            <p style={{ color: '#78350f', fontSize: '12px' }}>Sanagat Marketplace Hub</p>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isSignUp && (
              <>
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontSize: '13px' }} required />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontSize: '13px' }} required />
              </>
            )}

            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#78350f', display: 'block', marginBottom: '3px' }}>MOBILE NUMBER</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ borderRadius: '12px', padding: '10px', border: '1px solid #d97706', fontWeight: 'bold' }}>
                  <option value="+91">+91 (IN)</option>
                  <option value="+60">+60 (MY)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
                <input type="tel" placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontSize: '14px', fontWeight: 'bold' }} required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#78350f', display: 'block', marginBottom: '3px' }}>PASSWORD</label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontSize: '13px' }} required />
            </div>

            {authError && <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>{authError}</p>}

            <button type="submit" style={{ width: '100%', backgroundColor: '#d97706', color: '#ffffff', padding: '14px', borderRadius: '14px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '6px' }}>
              {isSignUp ? 'Register' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} style={{ background: 'none', border: 'none', color: '#d97706', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isSignUp ? 'Existing user? Sign In' : "New user? Create Account"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP SCREEN
  return (
    <div style={containerBgStyle}>
      <div style={{ width: '100%', maxWidth: '400px', height: '850px', backgroundColor: '#FFFBEB', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', border: '8px solid #d97706' }}>

        {/* LIVE NOTIFICATION TOAST */}
        {notificationToast && (
          <div style={{ position: 'absolute', top: '12px', left: '16px', right: '16px', backgroundColor: '#d97706', color: '#fff', padding: '10px 14px', borderRadius: '12px', zIndex: 90, fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} />
            <span style={{ flex: 1 }}>{notificationToast}</span>
          </div>
        )}

        {/* HOME FEED */}
        {currentScreen === 'home' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header style={{ backgroundColor: '#ffffff', padding: '16px', borderBottom: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <AppLogo size="sm" />
                <button onClick={() => setLocationModal(true)} style={{ display: 'flex', alignItems: 'center', fontSize: '11px', backgroundColor: '#fef3c7', color: '#d97706', padding: '6px 10px', borderRadius: '20px', fontWeight: '700', gap: '4px', border: 'none', cursor: 'pointer' }}>
                  <MapPin size={13} />
                  <span>{currentLocation}</span>
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
                <input type="text" placeholder="Search items, vehicles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 10px 10px 38px', borderRadius: '14px', fontSize: '13px', outline: 'none' }} />
              </div>
            </header>

            <main style={{ padding: '16px', flex: 1, overflowY: 'auto', paddingBottom: '90px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {categories.map((cat, idx) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button key={idx} onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '70px', height: '75px', borderRadius: '16px', border: isSelected ? 'none' : '1px solid #fef3c7', backgroundColor: isSelected ? '#d97706' : '#ffffff', color: isSelected ? '#ffffff' : '#475569', cursor: 'pointer' }}>
                      <IconComp size={20} style={{ marginBottom: '4px' }} />
                      <span style={{ fontSize: '11px', fontWeight: '600' }}>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {filteredAds.map((ad) => {
                  const timeStr = getTimeRemaining(ad.expiry_time);
                  const coverImage = ad.images && ad.images.length > 0 ? ad.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

                  return (
                    <div key={ad.id} onClick={() => openAdDetail(ad)} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #fef3c7', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: '130px', backgroundColor: '#e2e8f0' }}>
                        <img src={coverImage} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '6px', left: '6px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#ffffff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} />
                          <span>{timeStr}</span>
                        </div>
                        <button onClick={(e) => toggleWishlist(ad.id, e)} style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                          <Heart size={14} className={wishlist.includes(ad.id) ? "fill-red-500 text-red-500" : "text-slate-600"} />
                        </button>
                      </div>

                      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <div>
                          <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>₹{Number(ad.price).toLocaleString()}</h3>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.title}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        )}

        {/* PRODUCT DETAIL */}
        {currentScreen === 'detail' && selectedProduct && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ position: 'relative', height: '260px', backgroundColor: '#0f172a' }}>
              <img src={selectedProduct.images[activeImageIndex]} alt={selectedProduct.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setCurrentScreen('home')} style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>₹{Number(selectedProduct.price).toLocaleString()}</h1>
                <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#475569', marginBottom: '12px' }}>{selectedProduct.title}</h2>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>{selectedProduct.description}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Seller: {selectedProduct.seller_name} ({selectedProduct.seller_phone})</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '10px' }}>
                <button onClick={() => setOfferModal(true)} style={{ flex: 1, backgroundColor: '#e2e8f0', color: '#0f172a', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                  Make Offer
                </button>
                <button onClick={() => setCurrentScreen('chat')} style={{ flex: 1, backgroundColor: '#d97706', color: '#ffffff', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <MessageCircle size={16} /> Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OFFER MODAL */}
        {offerModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '320px', padding: '20px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Make an Offer</h3>
              <input type="number" placeholder="Enter offered price (₹)" value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '14px', fontSize: '14px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSendOffer} style={{ flex: 1, backgroundColor: '#d97706', color: '#fff', padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>Send Offer</button>
                <button onClick={() => setOfferModal(false)} style={{ flex: 1, backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* LOCATION MODAL */}
        {locationModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '320px', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Detect Location</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Use GPS to detect your area.</p>
              <button onClick={fetchGPSLocation} style={{ width: '100%', backgroundColor: '#d97706', color: '#fff', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginBottom: '10px' }}>
                {isLocating ? 'Detecting...' : 'Use GPS Location'}
              </button>
              <button onClick={() => setLocationModal(false)} style={{ width: '100%', backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>Close</button>
            </div>
          </div>
        )}

        {/* CHAT SCREEN */}
        {currentScreen === 'chat' && selectedProduct && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f8fafc', zIndex: 60, display: 'flex', flexDirection: 'column' }}>
            <header style={{ backgroundColor: '#ffffff', padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('detail')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>Chat: {selectedProduct.title}</h3>
            </header>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.sender_phone === user.phone ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', marginBottom: '2px', textAlign: msg.sender_phone === user.phone ? 'right' : 'left', padding: '0 4px' }}>
                    {msg.sender_phone === user.phone ? 'You' : (msg.sender_name || 'User')}
                  </span>
                  <div style={{ backgroundColor: msg.sender_phone === user.phone ? '#d97706' : '#ffffff', color: msg.sender_phone === user.phone ? '#ffffff' : '#0f172a', padding: '10px 14px', borderRadius: '16px', fontSize: '13px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ backgroundColor: '#ffffff', padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Type message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '14px', outline: 'none' }} required />
              <button type="submit" style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '14px', cursor: 'pointer' }}><Send size={16} /></button>
            </form>
          </div>
        )}

        {/* POST AD */}
        {currentScreen === 'sell' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
            <header style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
              <h1 style={{ fontSize: '15px', fontWeight: 'bold' }}>Post Listing (3-Day Expiry)</h1>
            </header>

            <form onSubmit={handlePublishAd} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Upload Photos (Max 5)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {newAd.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                      <img src={img} alt="preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                      <button type="button" onClick={() => handleRemoveImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                  {newAd.images.length < 5 && (
                    <label style={{ width: '70px', height: '70px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                      <Camera size={20} />
                      <span style={{ fontSize: '9px', marginTop: '2px' }}>Add</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>

              <select value={newAd.category} onChange={(e) => setNewAd({...newAd, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <option value="Mobiles">Mobiles</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
              </select>

              <input type="number" placeholder="Price in ₹" value={newAd.price} onChange={(e) => setNewAd({...newAd, price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0' }} required />
              
              <textarea rows="3" placeholder="Title & Description" value={newAd.title} onChange={(e) => setNewAd({...newAd, title: e.target.value, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0' }} required />

              <button type="submit" style={{ width: '100%', backgroundColor: '#d97706', color: '#ffffff', padding: '16px', borderRadius: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                Publish Listing
              </button>
            </form>
          </div>
        )}

        {/* PROFILE SCREEN */}
        {currentScreen === 'profile' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto', paddingBottom: '90px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '20px', border: '1px solid #fef3c7', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px' }}>{user.name}</h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>{user.email}</p>
              <p style={{ fontSize: '10px', color: '#94a3b8' }}>{user.phone}</p>
            </div>

            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>My Listings ({myAds.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {myAds.map(ad => (
                <div key={ad.id} style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '14px', border: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '13px' }}>₹{ad.price} | {ad.title}</h4>
                  <button onClick={() => setPaymentModal(ad)} style={{ backgroundColor: '#fef3c7', color: '#d97706', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Extend ₹199</button>
                </div>
              ))}
            </div>

            {/* PAYMENT MODAL */}
            {paymentModal && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', textAlign: 'center', width: '100%', maxWidth: '320px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>Pay ₹199 for Week Extension</h3>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '12px' }}>
                    <QrCode size={90} style={{ margin: '0 auto', color: '#0f172a' }} />
                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>Scan via Paytm / UPI to pay</p>
                  </div>
                  <button onClick={() => { alert('Payment submitted for admin verification!'); setPaymentModal(null); }} style={{ width: '100%', backgroundColor: '#d97706', color: '#fff', padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold', marginBottom: '8px' }}>I have paid</button>
                  <button onClick={() => setPaymentModal(null)} style={{ width: '100%', backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>Cancel</button>
                </div>
              </div>
            )}

            <button onClick={handleLogout} style={{ width: '100%', backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #fecaca', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: 'auto' }}>
              Logout
            </button>
          </div>
        )}

        {/* BOTTOM NAV */}
        {currentScreen !== 'detail' && currentScreen !== 'chat' && (
          <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '70px', padding: '0 8px', zIndex: 40 }}>
            <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: currentScreen === 'home' ? '#d97706' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <Home size={22} />
              <span style={{ fontSize: '10px' }}>Home</span>
            </button>
            <button onClick={() => setCurrentScreen('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: currentScreen === 'profile' ? '#d97706' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <Heart size={22} />
              <span style={{ fontSize: '10px' }}>My Ads</span>
            </button>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <button onClick={() => setCurrentScreen('sell')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '-24px', cursor: 'pointer', padding: 0 }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(217, 119, 6, 0.4)', border: '4px solid #FFFBEB' }}>
                  <PlusCircle size={26} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#d97706', marginTop: '2px' }}>Sell</span>
              </button>
            </div>
            <button onClick={() => setCurrentScreen('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: currentScreen === 'profile' ? '#d97706' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <User size={22} />
              <span style={{ fontSize: '10px' }}>Account</span>
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}
