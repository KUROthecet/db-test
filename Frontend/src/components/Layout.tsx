
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { Role } from '../types';
import { ShoppingBag, LogOut, User as UserIcon, UserPlus, Search, Menu as MenuIcon, X, ChevronRight, Minus, Plus, Trash2, ChevronDown, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProductSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (productSearch.trim()) {
      navigate(`/menu?search=${encodeURIComponent(productSearch.trim())}`);
      setProductSearch('');
    }
  };

  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderSearch.trim()) {
      navigate(`/track/${encodeURIComponent(orderSearch.trim())}`);
      setOrderSearch('');
    }
  };

  const isActive = (path: string) => location.pathname === path 
    ? 'text-white font-bold border-b-2 border-white' 
    : 'text-white/80 hover:text-white transition-colors';

  const isMenuActive = location.pathname === '/menu';

  return (
    <header className="w-full flex flex-col z-50">
      <div className="bg-tlj-cream py-4 border-b border-tlj-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex-shrink-0 group">
               <div className="flex flex-col items-center">
                  <div className="bg-white p-2 rounded-full border-2 border-tlj-green mb-1 group-hover:shadow-md transition-all">
                      <span className="font-script text-tlj-green text-2xl px-1">Pane e</span>
                  </div>
                  <h1 className="font-serif text-xl font-bold text-tlj-green tracking-tight leading-none uppercase">
                    AMORE
                  </h1>
               </div>
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl flex-1 px-0 lg:px-12">
               <form onSubmit={handleProductSearch} className="relative w-full">
                 <input 
                    type="text" 
                    placeholder="Find your cake..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-white border border-tlj-green/20 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:border-tlj-green focus:ring-1 focus:ring-tlj-green transition-all shadow-sm text-tlj-charcoal"
                 />
                 <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tlj-green/60 hover:text-tlj-green">
                    <Search size={18} />
                 </button>
               </form>

               <form onSubmit={handleOrderSearch} className="relative w-full">
                 <input 
                    type="text" 
                    placeholder="Track Order ID" 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-white border border-tlj-green/20 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:border-tlj-green focus:ring-1 focus:ring-tlj-green transition-all shadow-sm text-tlj-charcoal"
                 />
                 <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tlj-green/60 hover:text-tlj-green">
                    <Search size={18} />
                 </button>
               </form>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              {!currentUser ? (
                <div className="flex items-center gap-6">
                  <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-tlj-charcoal hover:text-tlj-green transition-colors">
                    <UserIcon size={18} /> Sign in
                  </Link>
                  <Link to="/signup" className="flex items-center gap-2 text-sm font-medium text-tlj-charcoal hover:text-tlj-green transition-colors">
                    <UserPlus size={18} /> Sign up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                   <div className="text-right hidden sm:block">
                     <p className="text-xs text-gray-500">Welcome,</p>
                     <p className="text-sm font-bold text-tlj-green">{currentUser.fullName}</p>
                   </div>
                   <button onClick={handleLogout} title="Logout" className="text-gray-400 hover:text-red-500">
                     <LogOut size={20} />
                   </button>
                </div>
              )}

              {(currentUser?.role === Role.CUSTOMER || !currentUser) && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 bg-white rounded-full border border-tlj-green/20 text-tlj-green hover:bg-tlj-green hover:text-white transition-all shadow-sm group"
                >
                  <ShoppingBag size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-tlj-cream">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className={`bg-tlj-green text-white shadow-md sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
         <div className="max-w-7xl mx-auto px-4 flex items-center justify-between md:justify-center">
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon size={24} />
            </button>

            <div className="hidden md:flex items-center space-x-12">
              <Link to="/" className={`uppercase text-sm tracking-widest ${isActive('/')}`}>Home</Link>
              
              <div className="relative group">
                <Link to="/menu" className={`flex items-center gap-1 uppercase text-sm tracking-widest ${isMenuActive ? 'text-white font-bold' : 'text-white/80 hover:text-white'} transition-colors py-2`}>
                  Menu <ChevronDown size={14} className="mt-[-2px]" />
                </Link>
                
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                      <Link to="/menu?category=Bread" className="px-6 py-3 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green hover:font-bold transition-colors text-left font-serif border-b border-gray-50">Bread</Link>
                      <Link to="/menu?category=Cakes" className="px-6 py-3 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green hover:font-bold transition-colors text-left font-serif border-b border-gray-50">Cakes</Link>
                      <Link to="/menu?category=Coffee" className="px-6 py-3 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green hover:font-bold transition-colors text-left font-serif border-b border-gray-50">Coffee</Link>
                      <Link to="/menu?category=Milk" className="px-6 py-3 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green hover:font-bold transition-colors text-left font-serif">Milk</Link>
                   </div>
                </div>
              </div>

              <Link to="/about" className={`uppercase text-sm tracking-widest ${isActive('/about')}`}>About Us</Link>
              <Link to="/contact" className={`uppercase text-sm tracking-widest ${isActive('/contact')}`}>Contact</Link>
              
              {currentUser?.role === Role.CUSTOMER && (
                 <Link to="/history" className={`uppercase text-sm tracking-widest ${isActive('/history')}`}>Orders</Link>
              )}
              {currentUser?.role === Role.EMPLOYEE && (
                <Link to="/employee" className={`uppercase text-sm tracking-widest ${isActive('/employee')}`}>Workspace</Link>
              )}
              {currentUser?.role === Role.MANAGER && (
                <Link to="/admin" className={`uppercase text-sm tracking-widest ${isActive('/admin')}`}>Admin</Link>
              )}
            </div>
             <div className="md:hidden w-6"></div> 
         </div>
      </nav>
      
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-tlj-green/95 backdrop-blur-md flex flex-col justify-center items-center text-white transition-opacity duration-300">
           <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-white/80 hover:text-white">
             <X size={32} />
           </button>
           <nav className="flex flex-col space-y-6 text-center w-full px-8">
             <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Home</Link>
             
             <div className="w-full border-b border-white/20 pb-4">
                <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif block mb-4">Menu</Link>
                <div className="flex flex-col gap-3 text-white/70">
                   <Link to="/menu?category=Bread" onClick={() => setMobileMenuOpen(false)} className="text-lg">Bread</Link>
                   <Link to="/menu?category=Cakes" onClick={() => setMobileMenuOpen(false)} className="text-lg">Cakes</Link>
                   <Link to="/menu?category=Coffee" onClick={() => setMobileMenuOpen(false)} className="text-lg">Coffee</Link>
                   <Link to="/menu?category=Milk" onClick={() => setMobileMenuOpen(false)} className="text-lg">Milk</Link>
                </div>
             </div>

             <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">About Us</Link>
             <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Contact</Link>
             
             {currentUser ? (
               <>
                 {currentUser.role === Role.CUSTOMER && <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">My Orders</Link>}
                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-xl font-sans uppercase tracking-widest mt-8 border px-8 py-2 border-white/30">Logout</button>
               </>
             ) : (
               <div className="flex flex-col gap-4">
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif">Sign In</Link>
                 <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif">Create Account</Link>
               </div>
             )}
           </nav>
        </div>
      )}
    </header>
  );
};

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
      setIsCartOpen(false);
      if (!currentUser) {
          navigate('/login', { state: { from: { pathname: '/checkout' } } });
      } else {
          navigate('/checkout');
      }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-tlj-cream shadow-2xl flex flex-col transform transition-transform animate-slide-in">
          
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
            <h2 className="text-lg font-serif font-bold text-tlj-green">Your Basket ({cart.length})</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-tlj-charcoal">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Your basket is empty</p>
                <button onClick={() => setIsCartOpen(false)} className="text-tlj-green font-semibold hover:underline">Continue Shopping</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-tlj-charcoal font-medium leading-tight mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-tlj-green font-bold text-sm">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-gray-200 rounded-full bg-white">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-tlj-green"><Minus size={14} /></button>
                          <span className="text-xs w-6 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-tlj-green"><Plus size={14} /></button>
                       </div>
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="text-2xl font-serif font-bold text-tlj-charcoal">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-tlj-green text-white font-sans uppercase tracking-widest text-sm font-semibold hover:bg-tlj-charcoal transition-colors flex items-center justify-center gap-2"
              >
                Checkout <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Footer = () => (
  <footer className="bg-tlj-green text-white pt-16 pb-8 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
        <div className="md:col-span-4 lg:col-span-4 space-y-8">
           <Link to="/" className="inline-block group">
               <div className="flex flex-col">
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-white group-hover:text-tlj-cream transition-colors">PANE E AMORE</h2>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-tlj-cream mt-1">Artisan Baking Since 2009</p>
               </div>
           </Link>
           <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-tlj-green transition-all"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-tlj-green transition-all"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-tlj-green transition-all"><Linkedin size={20} /></a>
           </div>
           
           <div className="text-xs text-white/50 font-light space-y-1">
             <p>No 1 Dai Co Viet, Hai Ba Trung, Ha Noi</p>
             <p>+84 123456789</p>
           </div>
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="font-sans font-bold text-tlj-cream uppercase tracking-[0.15em] text-sm mb-6">Bakery</h4>
          <ul className="space-y-4 text-base text-white/80 font-light">
             <li><Link to="/menu?category=Bread" className="hover:text-white hover:translate-x-1 transition-all inline-block">Bread</Link></li>
             <li><Link to="/menu?category=Cakes" className="hover:text-white hover:translate-x-1 transition-all inline-block">Cakes</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="font-sans font-bold text-tlj-cream uppercase tracking-[0.15em] text-sm mb-6">Beverages</h4>
          <ul className="space-y-4 text-base text-white/80 font-light">
             <li><Link to="/menu?category=Coffee" className="hover:text-white hover:translate-x-1 transition-all inline-block">Coffee</Link></li>
             <li><Link to="/menu?category=Milk" className="hover:text-white hover:translate-x-1 transition-all inline-block">Milk</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 lg:col-span-4">
          <h4 className="font-sans font-bold text-tlj-cream uppercase tracking-[0.15em] text-sm mb-6">Company</h4>
          <ul className="space-y-4 text-base text-white/80 font-light">
             <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Home</Link></li>
             <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
             <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
             <li><Link to="/faq" className="hover:text-white hover:translate-x-1 transition-all inline-block">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/40 uppercase tracking-wider">
        <p>© 2024 Pane e Amore. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="min-h-screen flex flex-col bg-tlj-cream">
    <Navbar />
    <CartDrawer />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);
