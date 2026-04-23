import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Wallet, CheckCircle, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import { ordersAPI } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phoneNumber: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    orderNotes: '',
    paymentMethod: 'COD',
  });

  const totalPrice = getTotalPrice();
  const deliveryCharge = totalPrice > 200 ? 0 : 30;
  const finalTotal = totalPrice + deliveryCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        products: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          image: item.image,
        })),
        totalAmount: finalTotal,
        deliveryAddress: {
          fullAddress: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        phoneNumber: formData.phoneNumber,
        customerName: formData.customerName,
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes,
      };

      const response = await ordersAPI.create(orderPayload);
      setOrderData(response.data.data);
      setError('');
      clearCart();
      setOrderPlaced(true);
    } catch (error: any) {
      console.error('Error placing order:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to place order. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Generate WhatsApp link for order confirmation
  const generateWhatsAppLink = () => {
    if (!orderData) return '';

    const orderSummary = `🆕 *NEW ORDER - Shree Krishna Dudh Bhandaar*

*📋 Order ID:* #${orderData._id.slice(-8)}
*📅 Date:* ${new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

*👤 Customer Details:*
*Name:* ${orderData.customerName}
*Phone:* ${orderData.phoneNumber}

*🛒 Products Ordered:*
${orderData.products.map((item: any) => `▸ ${item.productName} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

*💰 Payment Details:*
Subtotal: ₹${totalPrice}
Delivery: ₹${deliveryCharge}
*Total: ₹${finalTotal}*
Payment Method: ${orderData.paymentMethod}

*📍 Delivery Address:*
${orderData.deliveryAddress?.fullAddress || 'Not provided'}

${orderData.orderNotes ? `*📝 Notes:* ${orderData.orderNotes}` : ''}`;

    return `https://wa.me/919876543210?text=${encodeURIComponent(orderSummary)}`;
  };

  useEffect(() => {
    if (orderPlaced && orderData) {
      setWhatsappLink(generateWhatsAppLink());
    }
  }, [orderPlaced, orderData]);

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <Link to="/products" className="text-primary hover:underline">Shop Now</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced && orderData) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Order Placed Successfully!</h2>
              <p className="text-green-100">Thank you for ordering from Shree Krishna Dudh Bhandaar</p>
            </div>

            {/* Order Details */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-bold text-gray-800">#{orderData._id.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Order Date</span>
                  <span className="text-gray-800">{new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-800">{orderData.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{orderData.totalAmount}</span>
                </div>
              </div>

              {/* Products Ordered */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Products Ordered</h3>
                <div className="space-y-2">
                  {orderData.products.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.productName} x {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span>{orderData.deliveryAddress?.fullAddress || 'Not provided'}</span>
                </div>
              </div>

              {/* WhatsApp Notification Button */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Notify via WhatsApp</h3>
                    <p className="text-sm text-gray-600">Send order details to shop owner</p>
                  </div>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Send Order via WhatsApp
                </a>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/products"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/myorders"
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  View My Orders
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500 mb-2">Need help with your order?</p>
                <div className="flex items-center justify-center gap-4">
                  <a href="tel:+919876543210" className="flex items-center gap-1 text-primary hover:underline">
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:underline">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Shop Timings: 6:00 AM – 10:00 PM
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4">Delivery Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                  formData.paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary"
                  />
                  <Wallet className="w-5 h-5 ml-3 text-gray-600" />
                  <span className="ml-2 font-medium">Cash on Delivery</span>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                  formData.paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary"
                  />
                  <CreditCard className="w-5 h-5 ml-3 text-gray-600" />
                  <span className="ml-2 font-medium">UPI / Card Payment</span>
                  <span className="ml-auto text-sm text-gray-500">(Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.productName} x {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-primary text-xl">₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Place Order & Notify via WhatsApp
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Order details will be sent to shop owner via WhatsApp
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
