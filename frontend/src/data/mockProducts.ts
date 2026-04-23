// Mock product data based on menu board prices
// Used as fallback when backend API is not available

export interface Product {
  _id: string;
  productName: string;
  category: string;
  subCategory: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  isBestSeller: boolean;
  isFeatured: boolean;
}

export const mockProducts: Product[] = [
  // Dairy Products
  {
    _id: '1',
    productName: 'Buffalo Milk',
    category: 'Dairy',
    subCategory: 'Milk',
    description: 'Pure and fresh buffalo milk delivered daily. Rich in calcium and nutrients. Perfect for making paneer, curd, and ghee.',
    price: 64,
    unit: 'liter',
    stock: 500,
    image: '/uploads/products/buffalo_milk.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '2',
    productName: 'Fresh Cow Milk',
    category: 'Dairy',
    subCategory: 'Milk',
    description: 'Pure and fresh cow milk delivered daily from local farms. Rich in calcium and nutrients. Easy to digest.',
    price: 54,
    unit: 'liter',
    stock: 500,
    image: '/uploads/products/cow_milk.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '3',
    productName: 'Buffalo Desi Ghee',
    category: 'Dairy',
    subCategory: 'Ghee',
    description: 'Pure desi buffalo ghee made from buffalo milk using traditional bilona method. Rich aroma and golden color.',
    price: 740,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/desi_ghee.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '4',
    productName: 'Cow Desi Ghee',
    category: 'Dairy',
    subCategory: 'Ghee',
    description: 'Pure desi cow ghee made from cow milk using traditional bilona method. Rich aroma and taste. Premium quality.',
    price: 760,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/desi_ghee.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '5',
    productName: 'Fresh Paneer',
    category: 'Dairy',
    subCategory: 'Paneer',
    description: 'Soft and fresh paneer made from pure buffalo milk. Perfect for curries, snacks, and grilling.',
    price: 300,
    unit: 'kg',
    stock: 150,
    image: '/uploads/products/fresh_paneer.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '6',
    productName: 'Fresh Cream',
    category: 'Dairy',
    subCategory: 'Cream',
    description: 'Fresh white cream separated from pure milk. Perfect for desserts, coffee, and cooking.',
    price: 300,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/cream.jpg',
    isBestSeller: false,
    isFeatured: false,
  },
  {
    _id: '7',
    productName: 'White Butter (Makhan)',
    category: 'Dairy',
    subCategory: 'Butter',
    description: 'Fresh homemade white butter (makhan) made from pure curd. Traditional taste with no additives.',
    price: 640,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/butter.jpg',
    isBestSeller: false,
    isFeatured: true,
  },
  {
    _id: '8',
    productName: 'Fresh Curd (Dahi)',
    category: 'Dairy',
    subCategory: 'Curd',
    description: 'Thick and creamy homemade curd set fresh every morning. Made from pure buffalo milk.',
    price: 92,
    unit: 'kg',
    stock: 200,
    image: '/uploads/products/fresh_curd.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '9',
    productName: 'Chaach (Buttermilk)',
    category: 'Dairy',
    subCategory: 'Chaach',
    description: 'Refreshing traditional buttermilk (chaach). Perfect for hot summer days. Aids digestion.',
    price: 24,
    unit: 'liter',
    stock: 300,
    image: '/uploads/products/chaach.jpg',
    isBestSeller: false,
    isFeatured: false,
  },
  // Sweets
  {
    _id: '10',
    productName: 'Special Milk Cake',
    category: 'Sweets',
    subCategory: 'Milk Cake',
    description: 'Our signature milk cake made with fresh mawa and premium ingredients. Rich, creamy, and delicious.',
    price: 360,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/milk_cake.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '11',
    productName: 'Maava',
    category: 'Sweets',
    subCategory: 'Maava',
    description: 'Traditional Indian sweet made from fresh chhena (cottage cheese). Soft, melt-in-mouth texture.',
    price: 280,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/maava.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '12',
    productName: 'Mishri Mawa',
    category: 'Sweets',
    subCategory: 'Mishri Maava',
    description: 'Sweet mishri mawa topped with crystal sugar (rock candy). Traditional festive sweet from Rajasthan.',
    price: 340,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/mishri_mawa.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '13',
    productName: 'Spongy Rasgulla',
    category: 'Sweets',
    subCategory: 'Rasgulla',
    description: 'Soft and spongy rasgullas soaked in light sugar syrup. Classic Bengali sweet made fresh daily.',
    price: 260,
    unit: 'kg',
    stock: 120,
    image: '/uploads/products/rasgulla.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '14',
    productName: 'Rasmalai',
    category: 'Sweets',
    subCategory: 'Rasmalai',
    description: 'Creamy Bengali rasmalai with soft chhena patties soaked in saffron-flavored milk.',
    price: 360,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/rasmalai.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '15',
    productName: 'Gulab Jamun',
    category: 'Sweets',
    subCategory: 'Gulab Jamun',
    description: 'Soft and juicy gulab jamuns soaked in rose-flavored syrup. Perfect for festivals.',
    price: 320,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/gulab_jamun.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '16',
    productName: 'Motichoor Laddu',
    category: 'Sweets',
    subCategory: 'Laddu',
    description: 'Premium motichoor laddu made in pure desi ghee with finest boondi. Classic festive sweet.',
    price: 360,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/laddu.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '17',
    productName: 'Chogni Laddu',
    category: 'Sweets',
    subCategory: 'Laddu',
    description: 'Traditional chogni laddu made in pure desi ghee with premium dry fruits. Festive special.',
    price: 340,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/laddu.jpg',
    isBestSeller: false,
    isFeatured: true,
  },
  {
    _id: '18',
    productName: 'Mawa Barfi',
    category: 'Sweets',
    subCategory: 'Barfi',
    description: 'Rich and creamy mawa barfi made with fresh khoya. Traditional Indian sweet for all occasions.',
    price: 400,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/barfi.jpg',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    _id: '19',
    productName: 'Kesar Barfi',
    category: 'Sweets',
    subCategory: 'Barfi',
    description: 'Premium kesar (saffron) barfi with rich aroma and golden color. Made with pure saffron.',
    price: 440,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/barfi.jpg',
    isBestSeller: false,
    isFeatured: true,
  },
  {
    _id: '20',
    productName: 'Kashmiri Barfi',
    category: 'Sweets',
    subCategory: 'Barfi',
    description: 'Special Kashmiri barfi with unique flavor and premium ingredients. Royal taste.',
    price: 440,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/barfi.jpg',
    isBestSeller: false,
    isFeatured: false,
  },
  {
    _id: '21',
    productName: 'Special Thaal Barfi',
    category: 'Sweets',
    subCategory: 'Barfi',
    description: 'Special thaal barfi presented on a bed of dry fruits. Premium gift-quality sweet.',
    price: 360,
    unit: 'kg',
    stock: 60,
    image: '/uploads/products/barfi.jpg',
    isBestSeller: false,
    isFeatured: true,
  },
  {
    _id: '22',
    productName: 'Bengali Sweets',
    category: 'Sweets',
    subCategory: 'Bengali Sweets',
    description: 'Assorted Bengali sweets including sandesh, chhena payesh, and rasgulla. Traditional flavors.',
    price: 340,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/rasgulla.jpg',
    isBestSeller: false,
    isFeatured: false,
  },
  {
    _id: '23',
    productName: 'Khurmani',
    category: 'Sweets',
    subCategory: 'Khurmani',
    description: 'Traditional dry fruit sweet (khurmani) made with cashews and mawa. Premium festive sweet.',
    price: 320,
    unit: 'kg',
    stock: 60,
    image: '/uploads/products/barfi.jpg',
    isBestSeller: false,
    isFeatured: false,
  },
];

export const WHATSAPP_NUMBER = '919876543210';

export const generateWhatsAppOrderMessage = (products: Array<{
  productName: string;
  price: number;
  quantity: number;
}>, customerInfo?: {
  name?: string;
  phone?: string;
  address?: string;
  notes?: string;
}) => {
  const productList = products.map(p =>
    `▸ ${p.productName}\n   Qty: ${p.quantity} × ₹${p.price} = ₹${p.price * p.quantity}`
  ).join('\n\n');

  const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const delivery = subtotal > 200 ? 0 : 30;
  const total = subtotal + delivery;

  const message = `🛒 *NEW ORDER - Shree Krishna Dudh Bhandaar*

━━━━━━━━━━━━━━━━━━
*📋 ORDER DETAILS*
━━━━━━━━━━━━━━━━━━

${customerInfo?.name ? `*Name:* ${customerInfo.name}` : ''}
${customerInfo?.phone ? `*Phone:* ${customerInfo.phone}` : ''}
${customerInfo?.address ? `*Address:* ${customerInfo.address}` : ''}

━━━━━━━━━━━━━━━━━━
*🛒 PRODUCTS ORDERED*
━━━━━━━━━━━━━━━━━━
${productList}

━━━━━━━━━━━━━━━━━━
*💰 ORDER SUMMARY*
━━━━━━━━━━━━━━━━━━
*Subtotal:* ₹${subtotal}
*Delivery:* ${delivery === 0 ? 'FREE' : `₹${delivery}`}
*TOTAL:* ₹${total}

${customerInfo?.notes ? `*Notes:* ${customerInfo.notes}` : ''}

━━━━━━━━━━━━━━━━━━
Please confirm and process this order. 🙏`;

  return encodeURIComponent(message);
};

export const generateWhatsAppDirectOrder = (product: Product, quantity: number = 1) => {
  const message = `🛒 *Quick Order - Shree Krishna Dudh Bhandaar*

I would like to order:
▸ ${product.productName}
▸ Quantity: ${quantity}
▸ Price: ₹${product.price}/${product.unit}
▸ Total: ₹${product.price * quantity}

Please confirm availability and delivery options. Thank you! 🙏`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
