import { HandMetal, Layers, Flame, CheckCircle2, Truck, Droplets, Thermometer, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: "easeOut"
    }
  })
};

export default function HowItsMade() {
  const processSteps = [
    {
      id: "01",
      title: "Raw Material Extraction",
      desc: "Our process begins at our dedicated quarries where high-quality clay and shale are carefully extracted. We test the mineral composition constantly to assure consistent strength and color profile.",
      icon: HandMetal,
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "02",
      title: "Crushing & Mixing",
      desc: "The raw clay is transported to the crushing plant where it is ground into a fine powder. Water is then added (pugmilling) to achieve the perfect plastic consistency required for molding.",
      icon: Droplets,
      image: "https://images.unsplash.com/photo-1617260838112-986c72eac92b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "03",
      title: "Extrusion & Slicing",
      desc: "The wet clay mixture is forced through a die to create a continuous column of clay, which is then precision-sliced into individual bricks by automated wire cutters.",
      icon: Layers,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "04",
      title: "Drying Chambers",
      desc: "To prevent cracking during firing, the wet 'green' bricks are placed in specialized drying chambers for 24-48 hours. Temperature and humidity are strictly controlled to remove excess moisture.",
      icon: Thermometer,
      image: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "05",
      title: "Kiln Firing",
      desc: "The dried bricks are loaded into continuous tunnel kilns where temperatures reach up to 1100°C (2000°F). This vitrification process permanently alters the chemical structure, giving the brick its legendary strength.",
      icon: Flame,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "06",
      title: "Quality Assurance & Dispatch",
      desc: "After a controlled cooling period, every batch undergoes rigorous compressive strength and dimensional checks. Passed bricks are then strapped, palletized, and prepared for dispatch to construction sites.",
      icon: CheckCircle2,
      image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c8263e?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-brown-900 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            The Anatomy of a Brick
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            A visual journey through our manufacturing plant, detailing how raw earth is transformed into the structural foundation of modern architecture.
          </motion.p>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative">
        
        {/* Central Line (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-px bg-terracotta-200 -translate-x-1/2 z-0"></div>

        <div className="space-y-20 md:space-y-32 relative z-10">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={step.id} 
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={stepVariants}
                className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>

                {/* Node Marker (Desktop Only) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-terracotta-100 items-center justify-center shadow-sm z-20">
                  <div className="w-4 h-4 rounded-full bg-terracotta-600"></div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 text-left relative">
                  <span className="text-6xl md:text-8xl font-black text-gray-100 absolute -top-8 md:-top-16 -z-10 tracking-tighter select-none opacity-50">
                    {step.id}
                  </span>
                  
                  <div className="flex flex-col mb-4">
                    <div className="w-10 h-10 bg-terracotta-50 rounded-xl flex items-center justify-center text-terracotta-600 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-brown-900 tracking-tight">{step.title}</h3>
                  </div>
                  
                  <p className="text-gray-500 leading-relaxed text-lg pl-14 md:pl-0 md:max-w-md">
                    {step.desc}
                  </p>
                </div>

              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Global Stats Footer inside How It's Made */}
      <section className="bg-brown-900 py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-2xl mb-2">Our Daily Impact</h4>
            <p className="text-gray-400">Consistent quality at massive scale.</p>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <div className="text-terracotta-500 font-bold text-3xl mb-1">100k+</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Bricks Shaped</div>
            </div>
            <div className="w-px bg-gray-700 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-terracotta-500 font-bold text-3xl mb-1">-20%</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Carbon Target</div>
            </div>
            <div className="w-px bg-gray-700 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-terracotta-500 font-bold text-3xl mb-1">&lt; 1%</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Rejection Rate</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
