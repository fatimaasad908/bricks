import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Page Header */}
      <section className="bg-brown-900 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1518640035070-52ea2b08fa11?q=80&w=1600&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Our Product Catalog
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Explore our range of premium, durable bricks manufactured to exceed industry standards for any construction need.
          </motion.p>
        </div>
      </section>

      {/* Main Catalog */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">

        {loading ? (
          <div className="bg-white p-12 rounded-[2rem] text-center text-gray-500 shadow-xl border border-gray-100">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center text-gray-500 shadow-xl border border-gray-100">
            No products found in catalog.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12 shrink-0"
          >
            {products.map((item, idx) => {
              const Icon = Icons[item.iconName] || Icons.Box;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  variants={fadeUp}
                  key={item._id}
                  className={`bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >

                  {/* Image Side */}
                  <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full overflow-hidden group bg-gray-100">
                    <img
                      src={
                        item.image === "first" || item.image?.includes("first") || item.name?.toLowerCase().includes("red") || item.name?.toLowerCase().includes("awaal")
                          ? "/src/assets/first.png"
                          : item.image === "second" || item.image?.includes("second") || item.name?.toLowerCase().includes("fire") || item.name?.toLowerCase().includes("doem")
                          ? "/src/assets/second.png"
                          : item.image === "third" || item.image?.includes("third") || item.name?.toLowerCase().includes("clay") || item.name?.toLowerCase().includes("soem")
                          ? "/src/assets/third.png"
                          : item.image?.startsWith('/src/assets')
                          ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`
                          : item.image
                      }
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x400?text=No+Image";
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {item.tag && (
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-brown-900 px-3 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          {item.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2 p-10 md:p-14 lg:p-16 flex flex-col justify-center">

                    <div className="w-12 h-12 bg-terracotta-50 rounded-full flex items-center justify-center text-terracotta-600 mb-6">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h2 className="text-3xl font-bold text-brown-900 mb-2 tracking-tight">
                      {item.name}
                    </h2>

                    <p className="text-lg font-semibold text-terracotta-600 mb-6">
                      {item.price}
                    </p>

                    <p className="text-gray-500 mb-8 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Specs Table */}
                    {item.specs && Object.keys(item.specs).length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">
                          Technical Specs
                        </h3>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                          {Object.entries(item.specs).map(([key, value]) => (
                            <div key={key}>
                              <span className="block text-xs text-gray-500 mb-1">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="block text-sm font-bold text-brown-900">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        to={`/order?product=${item.productId}`}
                        className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-4 rounded-sm font-bold transition-transform hover:scale-105 active:scale-95 text-[15px] shadow-lg shadow-terracotta-600/20"
                      >
                        Request Bulk Quote
                        <Icons.ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </section>
    </div>
  );
}