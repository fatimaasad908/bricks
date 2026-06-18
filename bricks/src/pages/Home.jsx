import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, Hammer, Layers, Flame, CheckCircle2, Factory, HandMetal, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[2rem] overflow-hidden bg-brown-900 min-h-[550px] flex items-center shadow-xl"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src="/images/hero_facade.png" 
                alt="Modern Brick building facade" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brown-900 via-brown-900/80 to-transparent"></div>
            </div>
            
            {/* Hero Content */}
            <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.1] mb-6 tracking-tight"
              >
                Building the Future with Strength & Tradition
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed"
              >
                Quality bricks crafted with decades of expertise and modern innovation for structures that stand the test of time.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link 
                  to="/products"
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-3.5 rounded-sm font-bold transition-transform hover:scale-105 active:scale-95 text-[15px] shadow-lg shadow-terracotta-600/30"
                >
                  View Our Products
                </Link>
                <Link 
                  to="/order"
                  className="bg-white hover:bg-gray-50 text-brown-900 px-8 py-3.5 rounded-sm font-bold transition-transform hover:scale-105 active:scale-95 text-[15px]"
                >
                  Get a Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="max-w-5xl mx-auto -mt-16 relative z-20 px-4 sm:px-0">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: Clock, label: 'EXPERIENCE', val: '20+ Years' },
                { icon: Factory, label: 'BRICKS PRODUCED', val: '500M+' },
                { icon: Smile, label: 'HAPPY CUSTOMERS', val: '10k+' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    variants={fadeUp}
                    key={idx} 
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-terracotta-50 flex items-center justify-center text-terracotta-600 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-brown-900 tracking-tight">{stat.val}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <p className="text-[10px] font-bold text-terracotta-600 tracking-widest uppercase mb-2">OUR COLLECTION</p>
              <h2 className="text-3xl font-bold text-brown-900 tracking-tight">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 group">
              View Catalog <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
            
              {
                title: 'Awaal',
                desc: 'Premium quality bricks with high strength, smooth finish, and excellent durability.',
                tag: 'STANDARD',
                img: 'src/assets/first.jpg'
              },
              {
                title: 'Doem',
                desc: 'Good quality bricks suitable for general construction at an economical cost.',
                tag: 'REFRACTORY',
                img: 'src/assets/second.png'
              },
              {
                title: 'Soem',
                desc: 'Basic quality bricks ideal for temporary structures and low-cost projects.',
                tag: 'NATURAL',
                img: 'src/assets/third.png'
              }
            ].map((product, idx) => (
              <motion.div variants={fadeUp} key={idx} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 relative">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-4 left-4">
                     <span className="bg-terracotta-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-sm">{product.tag}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brown-900 mb-2 tracking-tight">{product.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{product.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It's Made / OUR METHOD */}
      <section className="py-32 bg-[#f5eee8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-bold text-terracotta-600 tracking-widest uppercase mb-2">OUR METHOD</p>
            <h2 className="text-3xl font-bold text-brown-900 tracking-tight mb-4">How It's Made</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-[15px] leading-relaxed">
              We combine age-old techniques with modern precision to ensure every brick meets our standard of excellence.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: HandMetal, title: 'Raw Material', desc: 'Carefully sourced clay and minerals for optimal strength.' },
              { icon: Layers, title: 'Molding', desc: 'Precision extrusion and cutting into perfect dimensions.' },
              { icon: Flame, title: 'Kiln Firing', desc: 'Extreme high-heat processing for permanent hardening.' },
              { icon: CheckCircle2, title: 'Quality Check', desc: 'Rigorous testing for durability and finish consistency.' }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  variants={fadeUp}
                  key={idx} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-white/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-terracotta-50 rounded-full flex items-center justify-center text-terracotta-600 mx-auto mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-brown-900 mb-3">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-24 px-6 bg-gray-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto bg-brown-900 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl"
        >
          <div className="max-w-xl text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Ready to start your project?</h2>
            <p className="text-gray-300 text-[15px] leading-relaxed mb-8">
              Our experts are ready to help you choose the perfect material for your next masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-terracotta-500/10 rounded-full">
                  <Phone className="w-5 h-5 text-terracotta-500" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Call Us</p>
                  <p className="text-sm font-bold text-white tracking-wide">0313-6884162</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-terracotta-500/10 rounded-full">
                  <Mail className="w-5 h-5 text-terracotta-500" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Email Us</p>
                  <p className="text-sm font-bold text-white tracking-wide">ahmad@bricks.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              to="/order"
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white w-full md:w-auto px-8 py-4 rounded-sm font-bold transition-transform hover:scale-105 active:scale-95 inline-block text-center shadow-lg shadow-terracotta-600/20"
            >
              Get Custom Quote
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
