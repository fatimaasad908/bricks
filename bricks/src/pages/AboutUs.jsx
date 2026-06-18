import { Trophy, History, Target, Factory } from 'lucide-react';
import { motion } from 'framer-motion';
import bricksPlantImg from '../assets/bricksplant.jpeg';


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function AboutUs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <p className="text-[10px] font-bold text-terracotta-600 tracking-widest uppercase mb-3">OUR FOUNDATION</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brown-900 mb-6 tracking-tight leading-[1.1]">
                Forged in Fire, Built for Generations
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Since 2004, BRICKS has been at the forefront of brick manufacturing. We merge traditional clay craftsmanship with state-of-the-art technological precision to produce the core of tomorrow's infrastructure.
              </p>
              
              <div className="flex gap-8">
                <div>
                  <h4 className="text-3xl font-black text-brown-900 tracking-tight">20<span className="text-terracotta-600">+</span></h4>
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Years active</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <h4 className="text-3xl font-black text-brown-900 tracking-tight">3<span className="text-terracotta-600"></span></h4>
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Mega Plants</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <h4 className="text-3xl font-black text-brown-900 tracking-tight">5k<span className="text-terracotta-600">+</span></h4>
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Projects</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src={bricksPlantImg} 
                  alt="Modern Brick manufacturing facility interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[240px]">
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-orange-50 p-3 rounded-full text-terracotta-600">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-brown-900 text-sm">ISO 9001:2015</h5>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Certified</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  Recognized globally for quality management systems in material production.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core Values / Mission */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-[10px] font-bold text-terracotta-600 tracking-widest uppercase mb-3">OUR PHILOSOPHY</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-brown-900 mb-6 tracking-tight">More than just earth.</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              We see the potential in every grain of clay. Our mission is to provide builders, architects, and visionaries with materials they can trust blindfolded.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Target, title: 'Uncompromising Quality', desc: 'Every batch undergoes rigorous lab testing for compressive strength, water absorption, and efflorescence.' },
              { icon: Factory, title: 'Sustainable Operations', desc: 'We utilize advanced continuous kilns that dramatically reduce fuel consumption and carbon footprint.' },
              { icon: History, title: 'Generational Craft', desc: 'We retain the artistic touch of classic brickmaking while scaling it with modern automated extruders.' }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  variants={fadeUp}
                  key={idx} 
                  className="bg-gray-50 rounded-3xl p-10 border border-gray-100 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-terracotta-600 mb-6 border border-gray-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-brown-900 mb-3 tracking-tight">{value.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
