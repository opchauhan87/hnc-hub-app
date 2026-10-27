// App.jsx ke andar kahin bhi yeh component rakh lein
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

import React, { useState } from 'react';
import { 
  Home, Search, Heart, User, PlusCircle, MapPin, 
  Car, Smartphone, Laptop, Home as HomeIcon, Briefcase, 
  ArrowLeft, Phone, MessageCircle, Trash2, Edit3, Share2, 
  ChevronDown, Camera, X, Lock, Mail, UserCheck
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [user, setUser] = useState({ name: 'Rahul K.', email: 'rahul@example.com', location: 'Jaipur' });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  const [ads, setAds] = useState([
    {
      id: 1,
      title: 'Toyota Corolla 2021',
      price: '12,500',
      category: 'Vehicles',
      location: 'Jaipur',
      time: '2 days ago',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
      description: 'Well maintained family car, first owner, insurance valid till end of year.',
      seller: 'Rahul K.',
      sellerJoined: '2021'
    },
    {
      id: 2,
      title: 'iPhone 13 Pro (128GB)',
      price: '650',
      category: 'Mobiles',
      location: 'Jaipur',
      time: '1 day ago',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      description: 'Selling my well-maintained iPhone in mint condition. Includes original box and fast charger.',
      seller: 'Rahul K.',
      sellerJoined: '2021'
    },
    {
      id: 3,
      title: 'Modern Wooden Sofa Set',
      price: '320',
      category: 'Furniture',
      location: 'Jaipur',
      time: '2 days ago',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      description: '5-seater comfortable wooden sofa set with premium cushions.',
      seller: 'Rahul K.',
      sellerJoined: '2021'
    }
  ]);

  const [wishlist, setWishlist] = useState([2]);

  const [newAd, setNewAd] = useState({
    title: '',
    price: '',
    category: 'Mobiles',
    location: 'Jaipur',
    description: '',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
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

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authModal === 'signup') {
      setUser({ name: authForm.name || 'New User', email: authForm.email, location: 'Jaipur' });
    }
    setAuthModal(null);
    setCurrentScreen('home');
  };

  const handlePublishAd = (e) => {
    e.preventDefault();
    if (!newAd.title || !newAd.price) return;
    
    const createdAd = {
      id: Date.now(),
      ...newAd,
      time: 'Just now',
      seller: user.name,
      sellerJoined: '2026'
    };

    setAds([createdAd, ...ads]);
    setCurrentScreen('home');
    setNewAd({ title: '', price: '', category: 'Mobiles', location: 'Jaipur', description: '', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80' });
  };

  const filteredAds = ads.filter(ad => {
    const matchesCategory = selectedCategory === 'All' || ad.category === selectedCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
      
      {/* Exact Mobile App Device Frame */}
      <div style={{ width: '100%', maxWidth: '400px', height: '850px', backgroundColor: '#FFF9F5', borderRadius: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', border: '8px solid #1e293b' }}>

        {/* 1. WELCOME SCREEN */}
        {currentScreen === 'welcome' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', textAlign: 'center' }}>
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#f97316', color: '#ffffff', fontWeight: 'bold', padding: '6px 12px', borderRadius: '12px', fontSize: '20px' }}>H</div>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b' }}>HNC Hub</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '30px 20px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #ffedd5', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '70px', backgroundColor: '#ffedd5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', marginBottom: '15px' }}>
                  <Home size={32} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>Welcome to HNC Hub!</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Buy. Sell. Connect.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <button 
                onClick={() => setAuthModal('signup')}
                style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)' }}
              >
                Get Started (Sign Up)
              </button>
              <button 
                onClick={() => setAuthModal('login')}
                style={{ width: '100%', backgroundColor: '#ffffff', color: '#334155', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '15px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentScreen('home')}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' }}
              >
                Skip & Browse Marketplace
              </button>
            </div>
          </div>
        )}

        {/* 2. HOME FEED */}
        {currentScreen === 'home' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header style={{ backgroundColor: '#ffffff', padding: '16px', borderBottom: '1px solid #ffedd5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ backgroundColor: '#f97316', color: '#ffffff', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', fontSize: '14px' }}>H</div>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#1e293b' }}>HNC Hub</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', backgroundColor: '#ffedd5', color: '#f97316', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', gap: '4px', marginLeft: 'auto' }}>
                  <MapPin size={14} />
                  <span>{user.location}</span>
                  <ChevronDown size={12} />
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

            <main style={{ padding: '16px', flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
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
                {filteredAds.map((ad) => (
                  <div 
                    key={ad.id}
                    onClick={() => { setSelectedProduct(ad); setCurrentScreen('detail'); }}
                    style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #ffedd5', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ position: 'relative', height: '130px', backgroundColor: '#e2e8f0' }}>
                      <img src={ad.image} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={(e) => toggleWishlist(ad.id, e)}
                        style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                      >
                        <Heart size={14} className={wishlist.includes(ad.id) ? "fill-red-500 text-red-500" : "text-slate-600"} />
                      </button>
                    </div>
                    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                      <div>
                        <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px', marginBottom: '2px' }}>${ad.price}</h3>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.title}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '10px', color: '#94a3b8' }}>
                        <MapPin size={10} />
                        <span>{ad.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        )}

        {/* 3. PRODUCT DETAIL */}
        {currentScreen === 'detail' && selectedProduct && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ position: 'relative', height: '250px', backgroundColor: '#0f172a' }}>
              <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setCurrentScreen('home')}
                style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>${selectedProduct.price}</h1>
                <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#475569', marginBottom: '16px' }}>{selectedProduct.title}</h2>

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
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Member since {selectedProduct.sellerJoined}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '10px' }}>
                <button style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Phone size={16} /> Call
                </button>
                <button style={{ flex: 1, backgroundColor: '#f97316', color: '#ffffff', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <MessageCircle size={16} /> Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. POST AD */}
        {currentScreen === 'sell' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
            <header style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Post Your Ad</h1>
            </header>

            <form onSubmit={handlePublishAd} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '80px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Step 1: Category</label>
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
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Step 2: Price ($)</label>
                <input 
                  type="number" 
                  placeholder="Set Price" 
                  value={newAd.price}
                  onChange={(e) => setNewAd({...newAd, price: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Step 3: Title & Description</label>
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
                style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '10px' }}
              >
                Publish Ad
              </button>
            </form>
          </div>
        )}

        {/* 5. PROFILE */}
        {currentScreen === 'profile' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto', paddingBottom: '80px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '20px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', backgroundColor: '#f97316', color: '#ffffff', fontWeight: 'bold', fontSize: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user.name[0]}
                </div>
                <div>
                  <h3 style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px' }}>{user.name}</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{user.email}</p>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>My Active Listings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {ads.slice(0, 2).map(ad => (
                <div key={ad.id} style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ffedd5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={ad.image} alt={ad.title} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '13px' }}>${ad.price} | {ad.title}</h4>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>{ad.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setAds(ads.filter(a => a.id !== ad.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setCurrentScreen('welcome')}
              style={{ width: '100%', backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #fecaca', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: 'auto' }}
            >
              Logout
            </button>
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        {currentScreen !== 'welcome' && currentScreen !== 'detail' && (
          <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #ffedd5', display: 'flex', justifyContent: 'around', alignItems: 'center', height: '65px', padding: '0 10px', zIndex: 40 }}>
            <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentScreen === 'home' ? '#f97316' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <Home size={20} />
              <span style={{ fontSize: '10px', fontWeight: currentScreen === 'home' ? 'bold' : 'normal' }}>Home</span>
            </button>

            <button onClick={() => setCurrentScreen('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentScreen === 'profile' ? '#f97316' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <Heart size={20} />
              <span style={{ fontSize: '10px', fontWeight: currentScreen === 'profile' ? 'bold' : 'normal' }}>My Ads</span>
            </button>

            <button onClick={() => setCurrentScreen('sell')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', top: '-12px', cursor: 'pointer', flex: 1 }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f97316', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.4)', border: '4px solid #FFF9F5' }}>
                <PlusCircle size={24} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#f97316' }}>Sell</span>
            </button>

            <button onClick={() => setCurrentScreen('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentScreen === 'profile' ? '#f97316' : '#94a3b8', cursor: 'pointer', flex: 1 }}>
              <User size={20} />
              <span style={{ fontSize: '10px', fontWeight: currentScreen === 'profile' ? 'bold' : 'normal' }}>Account</span>
            </button>
          </nav>
        )}

        {/* AUTH MODAL */}
        {authModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '24px', position: 'relative' }}>
              <button onClick={() => setAuthModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>
                {authModal === 'login' ? 'Sign In to HNC Hub' : 'Create an Account'}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Enter your credentials to continue</p>

              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {authModal === 'signup' && (
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                    required
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                  required
                />
                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#f97316', color: '#ffffff', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '10px' }}
                >
                  {authModal === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
