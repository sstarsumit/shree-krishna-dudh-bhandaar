import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, MessageCircle, Search } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useAuthStore } from '../context/authStore';
import { WHATSAPP_NUMBER } from '../data/mockProducts';

interface Order {
  _id: string;
  products: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
  deliveryAddress?: {
    fullAddress?: string;
  };
}

const MyOrdersPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders();
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  // Generate WhatsApp check order link
  const generateWhatsAppCheckLink = (orderId: string) => {
    const message = `🔍 *Check Order Status*

*Order ID:* #${orderId.slice(-8)}

Hi, I would like to check the status of my order. Please provide an update.

Thank you! 🙏`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // Filter orders by search
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchOrderId.toLowerCase()) ||
    order.products.some(p => p.productName.toLowerCase().includes(searchOrderId.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your orders</h2>
          <Link to="/login" className="text-primary hover:underline">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or product name..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">
              {searchOrderId ? 'Try a different search term' : 'Start shopping to see your orders here'}
            </p>
            <Link to="/products" className="inline-flex px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {getStatusSteps(order.orderStatus).map((step, index) => (
                      <div key={step.step} className="flex-1 flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          step.completed ? 'bg-primary' : 'bg-gray-200'
                        } ${step.current ? 'ring-2 ring-primary/30' : ''}`} />
                        <span className="text-xs mt-1 text-gray-500 capitalize hidden sm:block">
                          {step.step.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-1 bg-gray-100 rounded mt-2">
                    <div
                      className="h-full bg-primary rounded transition-all"
                      style={{
                        width: `${(getStatusSteps(order.orderStatus).filter(s => s.completed).length / 5) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2 mb-4">
                    {order.products.slice(0, 3).map((product, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{product.productName} x {product.quantity}</span>
                        <span className="font-medium">₹{product.price * product.quantity}</span>
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <p className="text-sm text-gray-500">+{order.products.length - 3} more items</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Payment:</span>
                      <span className="text-sm font-medium">{order.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <a
                      href={generateWhatsAppCheckLink(order._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Check via WhatsApp
                    </a>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {selectedOrder?._id === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t bg-gray-50 -mx-6 px-6 pb-6 rounded-b-xl"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3">Order Details</h4>

                    {/* All Products */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Products</h5>
                      <div className="space-y-2">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">{product.productName} x {product.quantity}</span>
                            <span className="font-medium">₹{product.price * product.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.deliveryAddress?.fullAddress && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Delivery Address</h5>
                        <p className="text-sm text-gray-700">{order.deliveryAddress.fullAddress}</p>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{order.totalAmount - 30}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Delivery</span>
                        <span>₹30</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">Chat with us on WhatsApp for order updates or any queries.</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
