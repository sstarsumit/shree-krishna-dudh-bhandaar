// WhatsApp notification utility for Shree Krishna Dudh Bhandaar
// This sends order notifications to admin with detailed receipts

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

// Initialize Twilio client (only if credentials are provided)
let client = null;
if (accountSid && authToken && accountSid !== 'your_twilio_account_sid') {
  client = twilio(accountSid, authToken);
}

// Format order products for WhatsApp receipt
const formatProductsList = (products) => {
  return products.map(item =>
    `▸ ${item.productName}\n   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`
  ).join('\n\n');
};

// Calculate product totals
const calculateProductTotals = (products) => {
  let subtotal = 0;
  products.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  return subtotal;
};

// Format date for display
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

// Send detailed order notification to admin
export const sendOrderNotification = async (order) => {
  // Always log the order details for debugging
  console.log('=== NEW ORDER RECEIVED ===');
  console.log('Order ID:', order._id);
  console.log('Customer:', order.customerName);
  console.log('Phone:', order.phoneNumber);
  console.log('Total:', order.totalAmount);
  console.log('Products:', order.products);
  console.log('=========================');

  // If Twilio is not configured, generate WhatsApp link instead
  if (!client) {
    console.log('Twilio not configured. Generating WhatsApp link...');

    // Generate WhatsApp direct link with order details
    const orderSummary = `🆕 *NEW ORDER - Shree Krishna Dudh Bhandaar*

*📋 Order ID:* #${order._id.toString().slice(-8)}
*📅 Date:* ${formatDate(order.createdAt)}

*👤 Customer Details:*
*Name:* ${order.customerName}
*Phone:* ${order.phoneNumber}

*🛒 Products Ordered:*
${order.products.map(item => `▸ ${item.productName} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

*💰 Payment Details:*
Subtotal: ₹${calculateProductTotals(order.products)}
Delivery: ₹${order.totalAmount - calculateProductTotals(order.products)}
*Total: ₹${order.totalAmount}*
Payment Method: ${order.paymentMethod}

*📍 Delivery Address:*
${order.deliveryAddress?.fullAddress || 'Not provided'}

${order.orderNotes ? `*📝 Notes:* ${order.orderNotes}` : ''}`;

    // Encode for WhatsApp URL
    const encodedMessage = encodeURIComponent(orderSummary);
    const whatsappLink = `https://wa.me/${adminPhoneNumber?.replace('+', '')}?text=${encodedMessage}`;

    console.log('WhatsApp Link:', whatsappLink);
    return { sent: false, reason: 'Twilio not configured', whatsappLink };
  }

  try {
    const deliveryCharge = order.totalAmount - calculateProductTotals(order.products);

    const message = `🆕 *NEW ORDER - Shree Krishna Dudh Bhandaar*

━━━━━━━━━━━━━━━━━━
*📋 ORDER RECEIPT*
━━━━━━━━━━━━━━━━━━

*Order ID:* #${order._id.toString().slice(-8)}
*Date:* ${formatDate(order.createdAt)}

━━━━━━━━━━━━━━━━━━
*👤 CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━
*Name:* ${order.customerName}
*Phone:* ${order.phoneNumber}

━━━━━━━━━━━━━━━━━━
*🛒 PRODUCTS ORDERED*
━━━━━━━━━━━━━━━━━━
${formatProductsList(order.products)}

━━━━━━━━━━━━━━━━━━
*💰 PAYMENT DETAILS*
━━━━━━━━━━━━━━━━━━
*Subtotal:* ₹${calculateProductTotals(order.products)}
*Delivery Charge:* ₹${deliveryCharge > 0 ? deliveryCharge : 0}
*TOTAL AMOUNT:* ₹${order.totalAmount}
*Payment Method:* ${order.paymentMethod}

━━━━━━━━━━━━━━━━━━
*📍 DELIVERY ADDRESS*
━━━━━━━━━━━━━━━━━━
${order.deliveryAddress?.fullAddress || 'Not provided'}

${order.orderNotes ? `━━━━━━━━━━━━━━━━━━
*📝 ORDER NOTES*
━━━━━━━━━━━━━━━━━━
${order.orderNotes}` : ''}

━━━━━━━━━━━━━━━━━━
Please prepare the order and update status on dashboard. 🙏`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${adminPhoneNumber}`
    });

    console.log('WhatsApp notification sent to admin for order:', order._id);
    return { sent: true };
  } catch (error) {
    console.log('Failed to send WhatsApp notification:', error.message);
    return { sent: false, error: error.message };
  }
};

// Send order status update notification to customer
export const sendStatusUpdateNotification = async (order) => {
  if (!client) {
    console.log('Twilio not configured. Status update notification skipped.');
    return { sent: false, reason: 'Twilio not configured' };
  }

  try {
    const statusMessages = {
      pending: 'Your order has been received and is pending confirmation.',
      confirmed: 'Your order has been confirmed and will be prepared soon.',
      preparing: 'Your fresh dairy products/sweets are being prepared with care!',
      out_for_delivery: 'Your order is out for delivery! It will arrive soon.',
      delivered: 'Your order has been delivered. Thank you for ordering!',
      cancelled: 'Your order has been cancelled. Please contact us for more info.'
    };

    const statusEmojis = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      out_for_delivery: '🚴',
      delivered: '🎉',
      cancelled: '❌'
    };

    const message = `${statusEmojis[order.orderStatus] || '📦'} *Order Update - Shree Krishna Dudh Bhandaar*

━━━━━━━━━━━━━━━━━━
*Order ID:* #${order._id.toString().slice(-8)}
*Status:* ${statusMessages[order.orderStatus] || order.orderStatus}
━━━━━━━━━━━━━━━━━━

*Total Amount:* ₹${order.totalAmount}
*Payment:* ${order.paymentMethod}

Thank you for choosing Shree Krishna Dudh Bhandaar! 🙏

Questions? Chat with us or call us.`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:+91${order.phoneNumber}`
    });

    console.log('WhatsApp status update sent to customer for order:', order._id);
    return { sent: true };
  } catch (error) {
    console.log('Failed to send status notification:', error.message);
    return { sent: false, error: error.message };
  }
};

// Generate WhatsApp order check link for customers
export const generateOrderCheckLink = (orderId, phone) => {
  const message = `🔍 *Check Order Status*

*Order ID:* #${orderId.toString().slice(-8)}

Please provide my order status. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${adminPhoneNumber?.replace('+', '')}?text=${encodedMessage}`;
};

export default {
  sendOrderNotification,
  sendStatusUpdateNotification,
  generateOrderCheckLink
};
