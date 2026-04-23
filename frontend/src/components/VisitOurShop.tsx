import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

const VisitOurShop = () => {
  return (
    <section className="py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div>
            <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4">Visit Our Shop</h2>
            <p className="text-gray-600 mb-6 max-w-xl">
              Come visit us at our shop for the freshest dairy products and sweets. We're open every day from early morning to late evening.
            </p>

            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-gray-600">Main Market, Near Bus Stand<br/>Jaipur, Rajasthan 302001</div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-primary" />
                <div className="text-gray-600">+91 98765 43210</div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <div className="text-gray-600">6:00 AM – 10:00 PM (Daily)</div>
              </li>
            </ul>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.228!2d75.7924!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU1JzMyLjEiTiA3NcKwNDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="340"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitOurShop;
