import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminLayout } from './AdminDashboard';

interface Order {
  _id: string;
  customerName: string;
  phoneNumber: string;
  products: Array<{ productName: string; quantity: number; price: number }>;
  totalAmount: number;
  deliveryAddress: { fullAddress: string };
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-700' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  { value: 'preparing', label: 'Preparing', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder) {
        const updated = orders.find(o => o._id === orderId);
        if (updated) setSelectedOrder({ ...updated, orderStatus: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phoneNumber.includes(searchQuery) ||
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'preparing': return <Package className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Orders</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Products</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">#{order._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800 font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.phoneNumber}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.products.slice(0, 2).map((p, i) => (
                          <div key={i}>{p.productName} x{p.quantity}</div>
                        ))}
                        {order.products.length > 2 && <div className="text-gray-400">+{order.products.length - 2} more</div>}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusOptions.find(s => s.value === order.orderStatus)?.color}`}>
                          {getStatusIcon(order.orderStatus)}
                          {statusOptions.find(s => s.value === order.orderStatus)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b flex justify-between items-start">
                  <div>
                    <h2 className="font-heading text-xl font-semibold">Order #{selectedOrder._id.slice(-8)}</h2>
                    <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Customer Details</h3>
                    <p className="text-gray-600">{selectedOrder.customerName}</p>
                    <p className="text-gray-600">{selectedOrder.phoneNumber}</p>
                    <p className="text-gray-600">{selectedOrder.deliveryAddress?.fullAddress}</p>
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Products</h3>
                    <div className="space-y-2">
                      {selectedOrder.products.map((product, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{product.productName} x {product.quantity}</span>
                          <span className="font-medium">₹{product.price * product.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary text-xl">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          onClick={() => handleStatusUpdate(selectedOrder._id, status.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedOrder.orderStatus === status.value
                              ? status.color + ' ring-2 ring-offset-2 ring-primary'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
