// WhatsApp notification utility for Shree Krishna Dudh Bhandaar

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

let client = null;
if (accountSid && authToken && accountSid !== 'your_twilio_account_sid') {
  client = twilio(accountSid, authToken);
}

// ✅ FIX: Check all possible price fields
const getItemPrice = (item) => {
  return item.price ?? item.unitPrice ?? item.rate ?? 0;
};

const getItemQuantity = (item) => {
  return item.quantity ?? item.qty ?? 1;
};

// ✅ FIX: Robust subtotal calculation with console debug
const calculateProductTotals = (products) => {
  if (!products || !Array.isArray(products) || products.length === 0) {
    console.warn('WARNING: products is not an array or is empty', products);
    return 0;
  }
  console.log('Calculating subtotal for products:', JSON.stringify(products, null, 2));
  let subtotal = 0;
  products.forEach((item, idx) => {
    if (!item) return;
    const price = getItemPrice(item);
    const qty = getItemQuantity(item);
    const lineTotal = price * qty;
    console.log(`  [${idx}] ${item.productName}: price=${price}, qty=${qty}, line=${lineTotal}`);
    subtotal += lineTotal;
  });
  console.log('✓ Total subtotal calculated:', subtotal);
  return subtotal;
};

// ✅ FIX: Use Unicode escapes for emojis — raw emoji breaks in Twilio WhatsApp
const EMOJI = {
  box:      '\u{1F4E6}',
  calendar: '\u{1F4C5}',
  person:   '\u{1F464}',
  phone:    '\u{1F4DE}',
  cake:     '\u{1F9C1}',
  card:     '\u{1F4B3}',
  truck:    '\u{1F69A}',
  money:    '\u{1F4B0}',
  pin:      '\u{1F4CD}',
  note:     '\u{1F4DD}',
  pray:     '\u{1F64F}',
  candy:    '\u{1F36C}',
  check:    '\u{2705}',
  cross:    '\u{274C}',
  clock:    '\u{23F3}',
  cook:     '\u{1F468}\u{200D}\u{1F373}',
  bike:     '\u{1F6B4}',
  party:    '\u{1F389}',
};

const formatProductsList = (products) => {
  return products.map(item => {
    const price = getItemPrice(item);
    const qty = getItemQuantity(item);
    return `\u25B8 ${item.productName}\n   Qty: ${qty} \u00D7 \u20B9${price} = \u20B9${price * qty}`;
  }).join('\n\n');
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

export const sendOrderNotification = async (order) => {
  console.log('=== NEW ORDER RECEIVED ===');
  console.log('Order ID:', order._id);
  console.log('Customer:', order.customerName);
  console.log('Phone:', order.phoneNumber);
  console.log('Total:', order.totalAmount);
  console.log('Products:', JSON.stringify(order.products, null, 2)); // ✅ full product debug
  console.log('=========================');

  // Calculate subtotal inline for consistency
  let subtotal = 0;
  const productLines = (order.products || []).map(item => {
    const p = getItemPrice(item);
    const q = getItemQuantity(item);
    const lineTotal = p * q;
    subtotal += lineTotal;
    return `\u25B8 ${item.productName} x${q} = \u20B9${lineTotal}`;
  }).join('\n');
  console.log(`Subtotal calculated: ${subtotal}`);
  const delivery = Math.max(order.totalAmount - subtotal, 0);

  if (!client) {
    console.log('Twilio not configured. Generating WhatsApp link...');

    const orderSummary =
      `*NEW ORDER - Shree Krishna Dudh Bhandaar*\n\n` +
      `*Order ID:* #${order._id.toString().slice(-8)}\n` +
      `*Date:* ${formatDate(order.createdAt)}\n\n` +
      `*Customer Details:*\n` +
      `*Name:* ${order.customerName}\n` +
      `*Phone:* ${order.phoneNumber}\n\n` +
      `*Products Ordered:*\n` +
      `${productLines}\n\n` +
      `*Payment Details:*\n` +
      `Subtotal: \u20B9${subtotal}\n` +
      `Delivery: \u20B9${delivery}\n` +
      `*Total: \u20B9${order.totalAmount}*\n` +
      `Payment Method: ${order.paymentMethod}\n\n` +
      `*Delivery Address:*\n` +
      `${order.deliveryAddress?.fullAddress || 'Not provided'}\n` +
      `${order.orderNotes ? `\n*Notes:* ${order.orderNotes}` : ''}`;

    const encodedMessage = encodeURIComponent(orderSummary);
    const whatsappLink = `https://wa.me/${adminPhoneNumber?.replace('+', '')}?text=${encodedMessage}`;
    console.log('WhatsApp Link:', whatsappLink);
    return { sent: false, reason: 'Twilio not configured', whatsappLink };
  }

  try {
    const message =
      `${EMOJI.box} *NEW ORDER - Shree Krishna Dudh Bhandaar*\n\n` +
      `${EMOJI.box} Order ID: #${order._id.toString().slice(-8)}\n` +
      `${EMOJI.calendar} Date: ${formatDate(order.createdAt)}\n\n` +
      `${EMOJI.person} Customer Details:\n` +
      `Name: ${order.customerName}\n` +
      `${EMOJI.phone} Phone: ${order.phoneNumber}\n\n` +
      `${EMOJI.cake} Products Ordered:\n` +
      `${formatProductsList(order.products)}\n\n` +
      `${EMOJI.card} Payment Details:\n` +
      `Subtotal: \u20B9${subtotal}\n` +
      `${EMOJI.truck} Delivery: \u20B9${delivery}\n` +
      `${EMOJI.money} Total Amount: \u20B9${order.totalAmount}\n` +
      `Payment Method: ${order.paymentMethod}\n\n` +
      `${EMOJI.pin} Delivery Address:\n` +
      `${order.deliveryAddress?.fullAddress || 'Not provided'}\n` +
      `${order.orderNotes ? `\n${EMOJI.note} Notes: ${order.orderNotes}` : ''}\n\n` +
      `${EMOJI.pray} Thank you for your order! Your delicious sweets will be delivered soon. ${EMOJI.candy}`;

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

export const sendStatusUpdateNotification = async (order) => {
  if (!client) {
    console.log('Twilio not configured. Status update notification skipped.');
    return { sent: false, reason: 'Twilio not configured' };
  }

  try {
    const statusMessages = {
      pending:          'Your order has been received and is pending confirmation.',
      confirmed:        'Your order has been confirmed and will be prepared soon.',
      preparing:        'Your fresh dairy products/sweets are being prepared with care!',
      out_for_delivery: 'Your order is out for delivery! It will arrive soon.',
      delivered:        'Your order has been delivered. Thank you for ordering!',
      cancelled:        'Your order has been cancelled. Please contact us for more info.'
    };

    const statusEmojis = {
      pending:          EMOJI.clock,
      confirmed:        EMOJI.check,
      preparing:        EMOJI.cook,
      out_for_delivery: EMOJI.bike,
      delivered:        EMOJI.party,
      cancelled:        EMOJI.cross,
    };

    const message =
      `${statusEmojis[order.orderStatus] || EMOJI.box} *Order Update - Shree Krishna Dudh Bhandaar*\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
      `*Order ID:* #${order._id.toString().slice(-8)}\n` +
      `*Status:* ${statusMessages[order.orderStatus] || order.orderStatus}\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `*Total Amount:* \u20B9${order.totalAmount}\n` +
      `*Payment:* ${order.paymentMethod}\n\n` +
      `Thank you for choosing Shree Krishna Dudh Bhandaar! ${EMOJI.pray}`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:+91${order.phoneNumber}`
    });

    console.log('WhatsApp status update sent to customer:', order._id);
    return { sent: true };
  } catch (error) {
    console.log('Failed to send status notification:', error.message);
    return { sent: false, error: error.message };
  }
};

export const generateOrderCheckLink = (orderId, phone) => {
  const message =
    `\u{1F50D} *Check Order Status*\n\n` +
    `*Order ID:* #${orderId.toString().slice(-8)}\n\n` +
    `Please provide my order status. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${adminPhoneNumber?.replace('+', '')}?text=${encodedMessage}`;
};

export default {
  sendOrderNotification,
  sendStatusUpdateNotification,
  generateOrderCheckLink
};