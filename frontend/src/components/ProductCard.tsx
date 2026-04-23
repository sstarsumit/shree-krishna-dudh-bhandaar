import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCartStore } from '../context/cartStore';

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
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    addItem({
      _id: product._id,
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity: 1,
      image: product.image,
      unit: product.unit,
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23FFFBEB" width="400" height="400"/%3E%3Ctext fill="%23F59E0B" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EShree Krishna%3C/text%3E%3C/svg%3E';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/products/${product._id}`}>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-cream-50">
            <img
              src={product.image || defaultImage}
              alt={product.productName}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isBestSeller && (
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                  Best Seller
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-orange-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Fresh
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to={`/products/${product._id}`}
                className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-primary font-medium">
                {product.category}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                {product.subCategory}
              </span>
            </div>

            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
              {product.productName}
            </h3>

            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(5.0)</span>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  ₹{product.price}
                </span>
                <span className="text-gray-500 text-sm">/{product.unit}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isAdding ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
