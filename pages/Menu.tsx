import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Menu = () => {
  const { products, addToCart } = useApp();
  const [searchParams] = useSearchParams();
  
  // Initialize from URL param or default to 'All'
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state if URL param changes (e.g., clicking nav links)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
  }, [searchParams]);

  // Fixed categories as requested
  const categories = ['All', 'Bread', 'Cakes', 'Coffee', 'Milk'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
        const pCat = product.category.toLowerCase();
        
        if (selectedCategory === 'Cakes') {
            matchesCategory = pCat.includes('cake') || pCat.includes('cupcake') || pCat.includes('tiramisu') || pCat.includes('pastry');
        } else if (selectedCategory === 'Bread') {
             matchesCategory = pCat.includes('bread') || pCat.includes('baguette') || pCat.includes('toast') || pCat.includes('loaf');
        } else if (selectedCategory === 'Coffee') {
             matchesCategory = pCat.includes('coffee');
        } else if (selectedCategory === 'Milk') {
             matchesCategory = pCat.includes('milk') || pCat.includes('tea');
        } else {
             matchesCategory = product.category === selectedCategory;
        }
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-tlj-cream">
      {/* Menu Header */}
      <div className="bg-[#FDFBF0] pt-16 pb-12 border-b border-[#E5E0D0]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-tlj-green font-script text-3xl mb-3 block">Our Collection</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-tlj-charcoal mb-6 tracking-tight">The Menu</h1>
          <p className="text-gray-500 font-light max-w-2xl mx-auto leading-relaxed font-serif italic text-lg">
            "Taste the passion in every slice, sip, and bite."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Redesigned Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16 border-b border-tlj-green/10 pb-8">
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm md:text-base font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                  selectedCategory === cat 
                    ? 'text-tlj-green' 
                    : 'text-gray-400 hover:text-tlj-charcoal'
                }`}
              >
                {cat}
                {/* Underline animation */}
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-tlj-green transform origin-left transition-transform duration-300 ${
                    selectedCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                }`}></span>
              </button>
            ))}
          </div>

          {/* Separator for desktop */}
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>

          {/* Search Inline */}
          <div className="relative group w-full md:w-64">
            <input 
              type="text" 
              placeholder="SEARCH ITEMS" 
              className="w-full bg-transparent border-b border-gray-300 focus:border-tlj-green py-2 pl-0 pr-8 text-xs font-bold uppercase tracking-widest text-tlj-charcoal placeholder-gray-400 outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={16} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col items-center">
              {/* Image with Zoom Effect */}
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-6 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow duration-500">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-tlj-charcoal text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Quick Add Overlay (Desktop) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 bg-gradient-to-t from-black/20 to-transparent">
                   <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-white text-tlj-green hover:bg-tlj-green hover:text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                   >
                     Add to Cart
                   </button>
                </div>
              </div>

              {/* Info */}
              <div className="text-center w-full px-2">
                <h3 className="font-serif text-lg text-tlj-charcoal mb-2 leading-tight group-hover:text-tlj-green transition-colors">
                  {product.name}
                </h3>
                <div className="w-8 h-px bg-tlj-green/30 mx-auto mb-3"></div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-sans font-bold text-tlj-charcoal text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                </div>
                
                {/* Mobile Add Button */}
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="md:hidden mt-4 text-[10px] font-bold uppercase tracking-widest text-tlj-green border border-tlj-green px-4 py-2 rounded-sm"
                >
                  Add +
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <h3 className="text-2xl font-serif text-gray-400 italic">No items found matching your criteria.</h3>
            <div className="mt-6">
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory('All')}} 
                  className="text-tlj-charcoal border-b border-tlj-charcoal pb-1 font-bold text-xs uppercase tracking-widest hover:text-tlj-green hover:border-tlj-green transition-all"
                >
                  Clear All Filters
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;