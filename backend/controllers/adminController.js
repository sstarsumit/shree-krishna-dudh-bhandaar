import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      {
        $match: { orderStatus: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Get today's revenue
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    const todayRevenue = todayRevenueResult[0]?.totalRevenue || 0;

    // Get recent orders (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weeklyOrders = await Order.find({
      createdAt: { $gte: last7Days }
    }).sort({ createdAt: -1 });

    // Get best selling products
    const productSales = {};
    weeklyOrders.forEach(order => {
      order.products.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId] += item.quantity;
        } else {
          productSales[item.productId] = item.quantity;
        }
      });
    });

    // Sort and get top 5 products
    const topProducts = await Product.find({
      _id: { $in: Object.keys(productSales) }
    }).limit(5);

    const bestSellingProducts = topProducts.map(product => ({
      _id: product._id,
      productName: product.productName,
      category: product.category,
      totalSold: productSales[product._id.toString()] || 0
    })).sort((a, b) => b.totalSold - a.totalSold);

    // Get daily sales for last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: date, $lt: nextDate },
            orderStatus: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]);

      dailySales.push({
        date: date.toISOString().split('T')[0],
        orders: dayOrders[0]?.totalOrders || 0,
        revenue: dayOrders[0]?.totalRevenue || 0
      });
    }

    // Get order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('productName stock category')
      .limit(5);

    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalOrders,
        todayOrders,
        totalRevenue,
        todayRevenue,
        totalCustomers,
        totalProducts,
        bestSellingProducts,
        dailySales,
        statusDistribution,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Get order count and total spending for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ userId: user._id });
        const orderCount = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        return {
          ...user.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: usersWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    const orderCount = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      success: true,
      message: 'User fetched successfully',
      data: {
        ...user.toObject(),
        orderCount,
        totalSpent,
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getOrderAnalytics = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;

    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      orderStatus: { $ne: 'cancelled' }
    });

    // Calculate revenue by category
    const categoryRevenue = {};
    const productSales = {};

    orders.forEach(order => {
      order.products.forEach(item => {
        // We'll need to get product category from the product
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        } else {
          productSales[item.productId] = {
            quantity: item.quantity,
            revenue: item.price * item.quantity
          };
        }
      });
    });

    // Get product details for category mapping
    const productIds = Object.keys(productSales);
    const products = await Product.find({ _id: { $in: productIds } });

    products.forEach(product => {
      if (!categoryRevenue[product.category]) {
        categoryRevenue[product.category] = 0;
      }
      categoryRevenue[product.category] += productSales[product._id.toString()].revenue;
    });

    res.json({
      success: true,
      message: 'Analytics fetched successfully',
      data: {
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
        categoryRevenue,
        period
      }
    });
  } catch (error) {
    next(error);
  }
};
