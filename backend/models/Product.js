import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Dairy', 'Sweets']
  },
  subCategory: {
    type: String,
    required: [true, 'Please specify sub-category'],
    enum: ['Milk', 'Curd', 'Ghee', 'Paneer', 'Chaach', 'Maava', 'Cream', 'Butter', 'Milk Cake', 'Mishri Maava', 'Rasgulla', 'Rasmalai', 'Bengali Sweets', 'Khurmani', 'Barfi', 'Gulab Jamun', 'Laddu']
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    enum: ['kg', 'liter', 'piece', 'pack'],
    default: 'kg'
  },
  stock: {
    type: Number,
    required: [true, 'Please specify stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 100
  },
  image: {
    type: String,
    default: '/uploads/products/default.png'
  },
  weightOptions: [{
    weight: String,
    price: Number
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching
productSchema.index({ productName: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
