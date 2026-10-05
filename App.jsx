import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Heart, User, ShoppingCart, Star, 
  MapPin, ShieldCheck, Truck, RefreshCw, ChevronRight, 
  Percent, ArrowRight, X, Plus, Minus, Trash2, Check, 
  ChevronDown, Filter, SlidersHorizontal, Package, Clock, 
  CheckCircle2, CreditCard, Wallet, QrCode, Building, Download, 
  Globe, AlertCircle, FileText, ChevronLeft, Bell, Settings, Lock
} from 'lucide-react';

// --- MOCK DATABASE & SEED DATA ---
const CATEGORIES = [
  { id: 'electronics', name: { en: 'Electronics', hi: 'इलेक्ट्रॉनिक्स' }, icon: '📱' },
  { id: 'fashion', name: { en: 'Fashion', hi: 'फैशन' }, icon: '👕' },
  { id: 'home', name: { en: 'Home & Kitchen', hi: 'होम और किचन' }, icon: '🏠' },
  { id: 'beauty', name: { en: 'Beauty & Care', hi: 'ब्यूटी और केयर' }, icon: '💄' },
  { id: 'grocery', name: { en: 'Grocery', hi: 'किराना' }, icon: '🛒' },
  { id: 'sports', name: { en: 'Sports & Fitness', hi: 'खेल और फिटनेस' }, icon: '⚽' },
  { id: 'appliances', name: { en: 'Appliances', hi: 'उपकरण' }, icon: '🔌' },
  { id: 'toys', name: { en: 'Toys & Baby', hi: 'खिलौने और बेबी' }, icon: '🧸' }
];

const PRODUCTS = [
  {
    id: 'prod-1',
    name: { en: 'boAt Airdopes 141 Bluetooth TWS Earbuds', hi: 'boAt एयर्डोप्स 141 ब्लूटूथ ईयरबड्स' },
    category: 'electronics',
    price: 999,
    mrp: 4490,
    rating: 4.3,
    reviewsCount: 18450,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    description: {
      en: '42H Playtime, Low Latency Mode for Gaming, ENx Tech, IWP, IPX4 Water Resistance.',
      hi: '42 घंटे का प्लेटाइम, गेमिंग के लिए लो लेटेंसी मोड, ENx तकनीक, IPX4 वॉटर रेसिस्टेंट।'
    },
    inStock: true,
    isFlashSale: true,
    variants: ['Bold Black', 'Cider Red', 'Pure White'],
    pincodes: ['110001', '400001', '560001', '700001']
  },
  {
    id: 'prod-2',
    name: { en: 'Men Solid Cotton Blend Straight Kurta', hi: 'पुरुषों का कॉटन ब्लेंड कुर्ता' },
    category: 'fashion',
    price: 499,
    mrp: 1999,
    rating: 4.1,
    reviewsCount: 3200,
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=500&q=80',
    description: {
      en: 'Traditional ethnic wear crafted from soft cotton blend fabric for ultimate comfort.',
      hi: 'आरामदायक कॉटन ब्लेंड कपड़े से बना पारंपरिक एथनिक कुर्ता।'
    },
    inStock: true,
    isFlashSale: false,
    variants: ['M', 'L', 'XL', 'XXL'],
    pincodes: ['110001', '400001', '560001']
  },
  {
    id: 'prod-3',
    name: { en: 'Prestige Iris 750W Mixer Grinder', hi: 'प्रेस्टीज आइरिस 750W मिक्सर ग्राइंडर' },
    category: 'appliances',
    price: 2899,
    mrp: 6295,
    rating: 4.4,
    reviewsCount: 9410,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80',
    description: {
      en: '750 Watts powerful motor with 3 stainless steel jars & 1 juicer jar.',
      hi: '750 वाट की शक्तिशाली मोटर, 3 स्टेनलेस स्टील जार और 1 जूसर जार के साथ।'
    },
    inStock: true,
    isFlashSale: true,
    variants: ['White/Blue'],
    pincodes: ['110001', '400001', '560001', '700001']
  },
  {
    id: 'prod-4',
    name: { en: 'Organic Whole Wheat Atta 5kg', hi: 'ऑर्गेनिक संपूर्ण गेहूं का आटा 5 किग्रा' },
    category: 'grocery',
    price: 265,
    mrp: 320,
    rating: 4.6,
    reviewsCount: 5120,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80',
    description: {
      en: '100% pure whole wheat flour processed with zero additives or preservatives.',
      hi: '100% शुद्ध संपूर्ण गेहूं का आटा, बिना किसी मिलावट के।'
    },
    inStock: true,
    isFlashSale: false,
    variants: ['5kg', '10kg'],
    pincodes: ['110001', '400001', '560001', '700001']
  }
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentView, setCurrentView] = useState('home'); // home, catalog, product, cart, checkout, orders, account, wishlist
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // App States
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'BB-2026-40411',
      date: '2026-10-04',
      items: [PRODUCTS[0]],
      totalAmount: 949,
      status: 'Shipped',
      paymentMethod: 'UPI',
      address: 'House #42, Connaught Place, New Delhi - 110001'
    }
  ]);

  // Account State
  const [userProfile, setUserProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    walletBalance: 1250,
    addresses: [
      { id: 'addr-1', tag: 'Home', text: 'House #42, Connaught Place, New Delhi - 110001', isDefault: true },
      { id: 'addr-2', tag: 'Work', text: 'Plot 12, Sector 44, Gurugram, Haryana - 122003', isDefault: false }
    ]
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');

  // Cart Helper Math
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const cartMrpTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0), [cart]);
  const discountAmount = appliedCoupon === 'BHARAT50' ? 50 : (appliedCoupon === 'FESTIVE100' ? 100 : 0);
  const deliveryFee = cartSubtotal > 500 || cart.length === 0 ? 0 : 40;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Cart Actions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16 md:pb-0">
      
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="cursor-pointer flex items-center gap-2 font-bold text-2xl tracking-wide"
          >
            <ShoppingBag className="w-8 h-8 text-yellow-400" />
            <span>Bharat<span className="text-yellow-400">Bazaar</span></span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <input 
              type="text"
              placeholder={lang === 'en' ? "Search for products, brands and more..." : "उत्पाद, ब्रांड और अन्य खोजें..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setCurrentView('catalog')}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 bg-white outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Controls & Nav Options */}
          <div className="flex items-center gap-6">
            
            {/* Language Switcher */}
            <button 
              onClick={() => setLang(prev => prev === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-md text-sm font-medium transition"
            >
              <Globe className="w-4 h-4 text-yellow-400" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Account */}
            <button 
              onClick={() => setCurrentView('account')}
              className="flex flex-col items-center hover:text-yellow-400 transition"
            >
              <User className="w-6 h-6" />
              <span className="text-xs hidden md:inline">{userProfile.name.split(' ')[0]}</span>
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => setCurrentView('wishlist')}
              className="relative flex flex-col items-center hover:text-yellow-400 transition"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-yellow-400 text-indigo-900 font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
              <span className="text-xs hidden md:inline">{lang === 'en' ? 'Wishlist' : 'विशलिस्ट'}</span>
            </button>

            {/* Cart */}
            <button 
              onClick={() => setCurrentView('cart')}
              className="relative flex flex-col items-center hover:text-yellow-400 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-yellow-400 text-indigo-900 font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
              <span className="text-xs hidden md:inline">{lang === 'en' ? 'Cart' : 'कार्ट'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CATEGORY STRIP --- */}
      <nav className="bg-white border-b shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentView('catalog'); }}
              className={`flex items-center gap-2 hover:text-indigo-600 transition ${selectedCategory === cat.id ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name[lang]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Hero Carousel Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-4 max-w-xl">
                <span className="bg-yellow-400 text-indigo-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {lang === 'en' ? 'Grand Festival Sale' : 'महा उत्सव सेल'}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                  {lang === 'en' ? 'Up to 80% Off on Top Electronics & Fashion' : 'इलेक्ट्रॉनिक्स और फैशन पर 80% तक की छूट'}
                </h1>
                <p className="text-indigo-100 text-sm md:text-base">
                  {lang === 'en' ? 'Get extra ₹50 off on first order with code BHARAT50' : 'कोड BHARAT50 के साथ पहले ऑर्डर पर ₹50 की अतिरिक्त छूट पाएं'}
                </p>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="bg-yellow-400 text-indigo-900 hover:bg-yellow-300 font-bold px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2"
                >
                  <span>{lang === 'en' ? 'Shop Now' : 'अभी खरीदारी करें'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80" 
                alt="Banner" 
                className="w-full md:w-80 h-56 object-cover rounded-xl shadow-lg border-2 border-white/20"
              />
            </div>

            {/* Flash Sale Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-red-500">⚡</span>
                  <span>{lang === 'en' ? 'Flash Deals' : 'फ्लैश डील्स'}</span>
                </h2>
                <button onClick={() => setCurrentView('catalog')} className="text-indigo-600 font-medium hover:underline text-sm">
                  {lang === 'en' ? 'View All' : 'सभी देखें'} →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {PRODUCTS.map(product => (
                  <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
                    <div>
                      <div className="relative mb-3">
                        <img src={product.image} alt={product.name[lang]} className="w-full h-48 object-cover rounded-lg" />
                        <button 
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white shadow"
                        >
                          <Heart className={`w-4 h-4 ${wishlist.some(w => w.id === product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">{product.name[lang]}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                        <span className="text-xs text-green-600 font-bold">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); setCurrentView('product'); }}
                      className="w-full bg-indigo-50 text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-100 transition text-sm"
                    >
                      {lang === 'en' ? 'View Details' : 'विवरण देखें'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CATALOG VIEW */}
        {currentView === 'catalog' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {lang === 'en' ? 'All Products' : 'सभी उत्पाद'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {PRODUCTS.filter(p => !selectedCategory || p.category === selectedCategory).map(product => (
                <div key={product.id} className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
                  <img src={product.image} alt={product.name[lang]} className="w-full h-48 object-cover rounded-lg mb-3" />
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name[lang]}</h3>
                  <div className="text-lg font-bold text-gray-900 mb-3">₹{product.price}</div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
                  >
                    {lang === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CART VIEW */}
        {currentView === 'cart' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{lang === 'en' ? 'Your Shopping Cart' : 'आपकी शॉपिंग कार्ट'}</h2>
            {cart.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-xl border">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">{lang === 'en' ? 'Your cart is empty!' : 'आपकी कार्ट खाली है!'}</p>
                <button onClick={() => setCurrentView('catalog')} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
                  {lang === 'en' ? 'Start Shopping' : 'खरीदारी शुरू करें'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4 items-center">
                      <img src={item.image} alt={item.name[lang]} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name[lang]}</h4>
                        <div className="text-indigo-600 font-bold mt-1">₹{item.price}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white p-6 rounded-xl border space-y-4 h-fit">
                  <h3 className="font-bold border-b pb-2">{lang === 'en' ? 'Price Details' : 'मूल्य विवरण'}</h3>
                  <div className="flex justify-between text-sm">
                    <span>{lang === 'en' ? 'Subtotal' : 'सबटोटल'}</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{lang === 'en' ? 'Discount' : 'छूट'}</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2 text-base">
                    <span>{lang === 'en' ? 'Total Amount' : 'कुल राशि'}</span>
                    <span>₹{grandTotal}</span>
                  </div>
    
