import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Milk, Cookie, Award, Truck, Clock, Heart, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import VisitOurShop from '../components/VisitOurShop';
import { productsAPI } from '../services/api';
import { mockProducts } from '../data/mockProducts';

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

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, bestSellerRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 4 }),
          productsAPI.getAll({ bestSeller: true, limit: 4 }),
        ]);
        setFeaturedProducts(featuredRes.data.data);
        setBestSellers(bestSellerRes.data.data);
      } catch (error) {
        console.log('Using mock data');
        // Fallback to mock data
        setFeaturedProducts(mockProducts.filter(p => p.isFeatured).slice(0, 4));
        setBestSellers(mockProducts.filter(p => p.isBestSeller).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Milk', icon: Milk, count: 2, color: 'bg-blue-100' },
    { name: 'Curd', icon: Milk, count: 1, color: 'bg-yellow-100' },
    { name: 'Ghee', icon: Cookie, count: 2, color: 'bg-orange-100' },
    { name: 'Paneer', icon: Cookie, count: 1, color: 'bg-green-100' },
    { name: 'Sweets', icon: Cookie, count: 10, color: 'bg-pink-100' },
  ];

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: '100% pure dairy products sourced from trusted farms',
    },
    {
      icon: Clock,
      title: 'Fresh Daily',
      description: 'Products delivered fresh every morning',
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹200',
    },
    {
      icon: Heart,
      title: 'Traditional Taste',
      description: 'Authentic recipes passed down generations',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      rating: 5,
      text: 'Best dairy products in Jaipur! The milk quality is excellent.',
    },
    {
      name: 'Priya Patel',
      rating: 5,
      text: 'Their gulab jamuns are amazing. Highly recommended!',
    },
    {
      name: 'Amit Gupta',
      rating: 5,
      text: 'Fresh products and timely delivery. Very satisfied!',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 bg-gradient-to-b from-cream-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Fresh Delivery Every Morning
              </span>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <div className="text-6xl md:text-7xl">श्री कृष्ण</div>
                <div className="text-primary text-6xl md:text-7xl">दुध भंडार</div>
              </h1>
              <p className="text-2xl text-gray-700 mb-2">Shree Krishna Dudh Bhandaar</p>
              <p className="text-xl text-gray-600 mb-8">
                Fresh Dairy Products & Traditional Sweets — crafted with pure
                ingredients, delivered with love. Taste the difference of authentic quality.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={`https://wa.me/919785077767?text=${encodeURIComponent('Hi, I want to place an order. Please send me your product list.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-cream-100 to-orange-100 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <Milk className="w-24 h-24 text-primary" />
                    </div>
                    <p className="font-heading text-2xl font-bold text-gray-800">Fresh Milk</p>
                    <p className="text-primary">₹54/liter</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600">Browse our wide range of dairy products and sweets</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.name === 'Sweets' ? 'Sweets' : 'Dairy'}`}
                  className="block bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 ${category.color} rounded-full flex items-center justify-center`}>
                    <category.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} Products</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fresh Today
            </h2>
            <p className="text-gray-600">Our freshest products picked just for you</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Best Sellers
            </h2>
            <p className="text-gray-600">Most loved products by our customers</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600">Join thousands of satisfied customers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream-50 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Award key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-800">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Our Shop (homepage bottom) */}
      <VisitOurShop />

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Browse our complete range of dairy products and sweets.
              Order now and get free delivery on your first order!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/919785077767?text=${encodeURIComponent('Hi, I want to place an order. Please send me your product list.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/919785077767?text=${encodeURIComponent('Hi, I want to place an order. Please send me your product list.')}`}
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
  );
};

export default HomePage;
