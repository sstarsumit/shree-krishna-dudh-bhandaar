import { motion } from 'framer-motion';
import { Award, Clock, Heart, Leaf } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Since 1985, we have been committed to providing the finest dairy products and traditional sweets.',
    },
    {
      icon: Clock,
      title: 'Fresh Daily',
      description: 'Our products are sourced fresh every morning from trusted local farms.',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every sweet is handcrafted using traditional recipes passed down through generations.',
    },
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'No artificial preservatives or additives. Just pure, natural goodness.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-cream-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Story
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For over 35 years, Shree Krishna Dudh Bhandaar has been serving the community
              with pure, fresh dairy products and authentic traditional sweets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tradition Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold text-gray-800">
                Our Dairy Tradition
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 1985, Shree Krishna Dudh Bhandaar began as a small family dairy shop.
                Today, we continue the legacy of providing pure, unadulterated dairy products
                to thousands of happy customers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our milk is sourced from carefully selected local farms that follow ethical
                farming practices. We believe in supporting our local farming community while
                delivering the best quality products to your doorstep.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-cream-50 rounded-2xl h-80 flex items-center justify-center"
            >
              <div className="text-center">
                <Award className="w-24 h-24 text-primary mx-auto mb-4" />
                <p className="font-heading text-xl font-bold text-gray-800">Since 1985</p>
                <p className="text-gray-600">Serving Quality Dairy</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fresh Daily Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="order-2 md:order-1 bg-white rounded-2xl h-80 flex items-center justify-center"
            >
              <div className="text-center">
                <Clock className="w-24 h-24 text-primary mx-auto mb-4" />
                <p className="font-heading text-xl font-bold text-gray-800">Fresh Every Morning</p>
                <p className="text-gray-600">Delivery by 8 AM</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="order-1 md:order-2 space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold text-gray-800">
                Fresh Milk Daily
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We believe that great dairy starts with fresh milk. That's why we ensure
                that all our milk, curd, and dairy products are delivered fresh to our
                customers every single day.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our state-of-the-art processing facilities maintain the highest standards
                of hygiene and quality control, ensuring that every product that leaves
                our shop is of premium quality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Handmade Sweets Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold text-gray-800">
                Handmade Sweets
              </h2>
              <p className="text-relaxed">
                Our sweets-gray-600 leading are crafted using time-honored recipes and the finest ingredients.
                From traditional Maava to rich Milk Cake, every piece is made by skilled
                artisans with decades of experience.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether it's a festive celebration or a simple treat, our sweets bring
                joy and sweetness to every occasion. We use pure ghee and fresh ingredients
                to ensure authentic taste and quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-orange-50 rounded-2xl h-80 flex items-center justify-center"
            >
              <div className="text-center">
                <Heart className="w-24 h-24 text-primary mx-auto mb-4" />
                <p className="font-heading text-xl font-bold text-gray-800">Made with Love</p>
                <p className="text-gray-600">Traditional Recipes</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600">Our commitment to quality is unwavering</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
