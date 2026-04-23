import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart3, Settings, LogOut, TrendingUp, DollarSign, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import { adminAPI } from '../../services/api';

interface Stats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  bestSellingProducts: Array<{ productName: string; totalSold: number }>;
  dailySales: Array<{ date: string; orders: number; revenue: number }>;
}

const AdminLayout = ({ children, activePage = '' }: { children: React.ReactNode; activePage?: string }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Customers', path: '/admin/customers', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="Shree Krishna Logo" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="font-heading font-bold text-gray-800">Admin</h1>
              <p className="text-xs text-gray-500">Shree Krishna</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activePage === item.name.toLowerCase()
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: "Today's Orders", value: stats?.todayOrders || 0, icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-primary' },
    { title: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout activePage="dashboard">
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">{stat.title}</span>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Best Selling Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4">Best Selling Products</h2>
                <div className="space-y-4">
                  {stats?.bestSellingProducts?.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-800">{product.productName}</span>
                      </div>
                      <span className="text-gray-500">{product.totalSold} sold</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4">Daily Sales (Last 7 Days)</h2>
                <div className="space-y-4">
                  {stats?.dailySales?.map((day, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                        <span className="font-medium">₹{day.revenue}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((day.revenue / (stats?.dailySales?.[0]?.revenue || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
export { AdminLayout };
