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
                <div className="text-gray-600">114, A, Tagore Nagar, Kartarpura<br/>Jaipur, Rajasthan 302006</div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-primary" />
                <div className="text-gray-600">+91 97850 77767, +91 98290 62058</div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <div className="text-gray-600">6:00 AM – 10:00 PM (Daily)</div>
              </li>
            </ul>

            <a
              href="https://wa.me/919785077767"
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
              src="https://www.google.com/maps?q=114+A+Tagore+Nagar+Kartarpura+Jaipur+302006&output=embed"
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
