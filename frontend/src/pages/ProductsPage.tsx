import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, Grid, List, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';
import { mockProducts, generateWhatsAppDirectOrder } from '../data/mockProducts';

interface Product {
  _id: string;
  productName: string;
  category: string;
  subCategory: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  isBestSeller: boolean;
  isFeatured: boolean;
}

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [usingMockData, setUsingMockData] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: searchParams.get('subCategory') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
  });

  const categories = [
    { name: 'All', value: '' },
    { name: 'Dairy', value: 'Dairy' },
    { name: 'Sweets', value: 'Sweets' },
  ];

  const subCategories: Record<string, string[]> = {
    Dairy: ['Milk', 'Curd', 'Ghee', 'Paneer', 'Chaach', 'Cream', 'Butter'],
    Sweets: ['Maava', 'Milk Cake', 'Mishri Maava', 'Rasgulla', 'Gulab Jamun', 'Laddu', 'Barfi', 'Rasmalai', 'Bengali Sweets', 'Khurmani'],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.category) params.category = filters.category;
        if (filters.subCategory) params.subCategory = filters.subCategory;
        if (filters.search) params.search = filters.search;

        const response = await productsAPI.getAll(params);
        setProducts(response.data.data);
        setUsingMockData(false);
      } catch (error) {
        console.log('API not available, using mock data');
        // Filter mock data based on filters
        let filteredProducts = [...mockProducts];

        if (filters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }
        if (filters.subCategory) {
          filteredProducts = filteredProducts.filter(p => p.subCategory === filters.subCategory);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(p =>
            p.productName.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
          );
        }

        setProducts(filteredProducts);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      search: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const hasActiveFilters = filters.category || filters.subCategory || filters.search;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600">Fresh dairy products and traditional sweets</p>

          {/* Demo Mode Banner */}
          {usingMockData && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">DEMO MODE</span>
                  <p className="text-sm text-yellow-800">
                    Showing sample products. Connect backend for full functionality.
                  </p>
                </div>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent('Hi, I want to place an order. Please send me your product list.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.value}
                        onChange={() => handleFilterChange('category', cat.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {filters.category && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Type</h4>
                  <div className="space-y-2">
                    {subCategories[filters.category]?.map((sub) => (
                      <label key={sub} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="subCategory"
                          checked={filters.subCategory === sub}
                          onChange={() => handleFilterChange('subCategory', sub)}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="ml-2 text-gray-600">{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">No products found</p>
                <button onClick={clearFilters} className="text-primary hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.name} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-category"
                          checked={filters.category === cat.value}
                          onChange={() => handleFilterChange('category', cat.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-gray-600">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-primary text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Order Button - Fixed Position */}
        <a
          href={`https://wa.me/919876543210?text=${encodeURIComponent('Hi, I want to place an order. Please send me your product list.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105 z-40"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="font-semibold">Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default ProductsPage;
