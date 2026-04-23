import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck, ShieldCheck, Star } from 'lucide-react';
import { useCartStore } from '../context/cartStore';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

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

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, relatedRes] = await Promise.all([
          productsAPI.getById(id!),
          productsAPI.getAll({ category: product?.category, limit: 4 }),
        ]);
        setProduct(productRes.data.data);
        if (relatedRes.data.data) {
          setRelatedProducts(relatedRes.data.data.filter((p: Product) => p._id !== id));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (product?.category) {
        try {
          const res = await productsAPI.getAll({ category: product.category, limit: 4 });
          setRelatedProducts(res.data.data.filter((p: Product) => p._id !== id));
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      }
    };
    if (product) fetchRelated();
  }, [product, id]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addItem({
      _id: product._id,
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity,
      image: product.image,
      unit: product.unit,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23FFFBEB" width="400" height="400"/%3E%3Ctext fill="%23F59E0B" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EShree Krishna%3C/text%3E%3C/svg%3E';

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.image || defaultImage}
                alt={product.productName}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="text-primary font-medium">{product.category} • {product.subCategory}</span>
              <h1 className="font-heading text-3xl font-bold text-gray-800 mt-2">{product.productName}</h1>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-500 ml-2">(5.0)</span>
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              <span className="text-gray-500">/{product.unit}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 10 ? 'bg-green-100 text-green-700' :
                product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
              {product.isBestSeller && (
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                  Best Seller
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdding ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-600">Quality Guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
