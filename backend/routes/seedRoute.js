import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

const BASE = 'https://raw.githubusercontent.com/sstarsumit/shree-krishna-dudh-bhandaar/master/imgs';

const products = [
  { productName: 'Buffalo Milk', category: 'Dairy', subCategory: 'Milk', description: 'Pure and fresh buffalo milk delivered daily. Rich in calcium and nutrients. Perfect for making paneer, curd, and ghee.', price: 64, unit: 'liter', stock: 500, image: `${BASE}/amul-buffalo-milk-pouch-india.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Fresh Cow Milk', category: 'Dairy', subCategory: 'Milk', description: 'Pure and fresh cow milk delivered daily from local farms. Rich in calcium and nutrients. Easy to digest.', price: 54, unit: 'liter', stock: 500, image: `${BASE}/fresh-a2-cow-milk-glass-bottle-india.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Buffalo Desi Ghee', category: 'Dairy', subCategory: 'Ghee', description: 'Pure desi buffalo ghee made from buffalo milk using traditional bilona method. Rich aroma and golden color.', price: 740, unit: 'kg', stock: 100, image: `${BASE}/pure-desi-cow-ghee-traditional-bilona-jar.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Cow Desi Ghee', category: 'Dairy', subCategory: 'Ghee', description: 'Pure desi cow ghee made from cow milk using traditional bilona method. Rich aroma and taste. Premium quality.', price: 760, unit: 'kg', stock: 100, image: `${BASE}/pure-desi-gir-cow-ghee-traditional-indian-dairy.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Fresh Paneer', category: 'Dairy', subCategory: 'Paneer', description: 'Soft and fresh paneer made from pure buffalo milk. Perfect for curries, snacks, and grilling.', price: 300, unit: 'kg', stock: 150, image: `${BASE}/fresh-paneer-cubes-dairy-shop.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Fresh Cream', category: 'Dairy', subCategory: 'Cream', description: 'Fresh white cream separated from pure milk. Perfect for desserts, coffee, and cooking.', price: 300, unit: 'kg', stock: 100, image: `${BASE}/amul-fresh-cream-dairy-india.jpg`, isAvailable: true, isFeatured: false, isBestSeller: false },
  { productName: 'White Butter (Makhan)', category: 'Dairy', subCategory: 'Butter', description: 'Fresh homemade white butter (makhan) made from pure curd. Traditional taste with no additives.', price: 640, unit: 'kg', stock: 100, image: `${BASE}/homemade-white-butter-makhan-dairy.jpg`, isAvailable: true, isFeatured: true, isBestSeller: false },
  { productName: 'Fresh Curd (Dahi)', category: 'Dairy', subCategory: 'Curd', description: 'Thick and creamy homemade curd set fresh every morning. Made from pure buffalo milk.', price: 92, unit: 'kg', stock: 200, image: `${BASE}/fresh-curd-dahi-traditional-clay-pot-india.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Chaach (Buttermilk)', category: 'Dairy', subCategory: 'Chaach', description: 'Refreshing traditional buttermilk (chaach). Perfect for hot summer days. aids digestion.', price: 24, unit: 'liter', stock: 300, image: `${BASE}/refreshing-indian-chaach-buttermilk-drink.jpg`, isAvailable: true, isFeatured: false, isBestSeller: false },
  { productName: 'Special Milk Cake', category: 'Sweets', subCategory: 'Milk Cake', description: 'Our signature milk cake made with fresh mawa and premium ingredients. Rich, creamy, and delicious.', price: 360, unit: 'kg', stock: 80, image: `${BASE}/indian-milk-cake-mithai-sweet-shop.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Maava', category: 'Sweets', subCategory: 'Maava', description: 'Traditional Indian sweet made from fresh chhena (cottage cheese). Soft, melt-in-mouth texture.', price: 280, unit: 'kg', stock: 100, image: `${BASE}/maava-mithai-traditional-indian-sweets.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Mishri Mawa', category: 'Sweets', subCategory: 'Mishri Maava', description: 'Sweet mishri mawa topped with crystal sugar (rock candy). Traditional festive sweet from Rajasthan.', price: 340, unit: 'kg', stock: 80, image: `${BASE}/mishri-mawa-indian-sweet-mithai.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Spongy Rasgulla', category: 'Sweets', subCategory: 'Rasgulla', description: 'Soft and spongy rasgullas soaked in light sugar syrup. Classic Bengali sweet made fresh daily.', price: 260, unit: 'kg', stock: 120, image: `${BASE}/spongy-rasgulla-bengali-sweet-india.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Rasmalai', category: 'Sweets', subCategory: 'Rasmalai', description: 'Creamy Bengali rasmalai with soft chhena patties soaked in saffron-flavored milk.', price: 360, unit: 'kg', stock: 80, image: `${BASE}/creamy-rasmalai-indian-sweet-dessert.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Bengali Sweets', category: 'Sweets', subCategory: 'Bengali Sweets', description: 'Assorted Bengali sweets including sandesh, chhena payesh, and rasgulla. Traditional flavors.', price: 340, unit: 'kg', stock: 80, image: `${BASE}/rasmalai-bengali-sweet-indian-creamy-dessert.jpg`, isAvailable: true, isFeatured: false, isBestSeller: false },
  { productName: 'Khurmani', category: 'Sweets', subCategory: 'Khurmani', description: 'Traditional dry fruit sweet (khurmani) made with cashews and mawa. Premium festive sweet.', price: 320, unit: 'kg', stock: 60, image: `${BASE}/traditional-indian-maava-mithai-barfi.jpg`, isAvailable: true, isFeatured: false, isBestSeller: false },
  { productName: 'Mawa Barfi', category: 'Sweets', subCategory: 'Barfi', description: 'Rich and creamy mawa barfi made with fresh khoya. Traditional Indian sweet for all occasions.', price: 400, unit: 'kg', stock: 100, image: `${BASE}/kesar-mawa-barfi-indian-sweet.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Kesar Barfi', category: 'Sweets', subCategory: 'Barfi', description: 'Premium kesar (saffron) barfi with rich aroma and golden color. Made with pure saffron.', price: 440, unit: 'kg', stock: 80, image: `${BASE}/kesar-mawa-barfi-indian-sweet-star-arrangement.jpg`, isAvailable: true, isFeatured: true, isBestSeller: false },
  { productName: 'Kashmiri Barfi', category: 'Sweets', subCategory: 'Barfi', description: 'Special Kashmiri barfi with unique flavor and premium ingredients. Royal taste.', price: 440, unit: 'kg', stock: 80, image: `${BASE}/traditional-indian-maava-mithai-barfi.jpg`, isAvailable: true, isFeatured: false, isBestSeller: false },
  { productName: 'Chogni Laddu', category: 'Sweets', subCategory: 'Laddu', description: 'Traditional chogni laddu made in pure desi ghee with premium dry fruits. Festive special.', price: 340, unit: 'kg', stock: 100, image: `${BASE}/motichoor-laddu-indian-sweet-dessert.jpg`, isAvailable: true, isFeatured: true, isBestSeller: false },
  { productName: 'Motichoor Laddu', category: 'Sweets', subCategory: 'Laddu', description: 'Premium motichoor laddu made in pure desi ghee with finest boondi. Classic festive sweet.', price: 360, unit: 'kg', stock: 100, image: `${BASE}/motichoor-laddu-indian-sweet-with-pistachio-and-rose.jpg`, isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Special Thaal Barfi', category: 'Sweets', subCategory: 'Barfi', description: 'Special thaal barfi presented on a bed of dry fruits. Premium gift-quality sweet.', price: 360, unit: 'kg', stock: 60, image: `${BASE}/traditional-maava-mithai-indian-sweet.jpg`, isAvailable: true, isFeatured: true, isBestSeller: false }
];

// GET /api/seed-now — run this once to seed production DB
router.get('/seed-now', async (req, res) => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Product.insertMany(products);
   const bcrypt = await import('bcryptjs');
const hashedPassword = await bcrypt.default.hash('sumittt', 10);
  await User.create({
      name: 'Admin',
      email: 'b231169@skit.ac.in',
      password: 'sumittt',
      phone: '9876543210',
      role: 'admin',
      address: { street: '114, A, Tagore Nagar, Kartarpura', city: 'Jaipur', state: 'Rajasthan', pincode: '302006' }
    });
    res.json({ success: true, message: `✅ Database seeded! ${products.length} products added.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
