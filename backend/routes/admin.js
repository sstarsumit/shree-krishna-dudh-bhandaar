import express from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getDashboardStats, getAllUsers, getUserById, deleteUser, getOrderAnalytics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Analytics
router.get('/analytics', getOrderAnalytics);

export default router;
