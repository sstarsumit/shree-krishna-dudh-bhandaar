import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, ShoppingCart, DollarSign } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminLayout } from './AdminDashboard';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: { city: string; state: string };
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Customers</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Customers Table */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </span>
                        {customer.address?.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {customer.address.city}, {customer.address.state}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">Orders</span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">{customer.orderCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Spent</span>
                      </div>
                      <p className="text-xl font-bold text-primary">₹{customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
