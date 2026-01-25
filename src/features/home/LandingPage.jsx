import { motion } from 'framer-motion'
import { Car, ShoppingBag, Users, ArrowRight } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
    return (
        <div className="min-h-screen bg-white">
            {/* --- Hero Section --- */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 text-white pt-20 pb-32">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Campus Life, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
                Simplified.
              </span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Coordinate rides to the airport, order food with friends, and solve campus problems together. One platform for everything.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                        >
                            Get Started <ArrowRight size={20} />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Background blobs for style */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* --- Features Section --- */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Car size={32} className="text-blue-600" />}
                        title="Travel Together"
                        desc="Going to the airport or city? Find peers to share a cab and split the cost instantly."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<ShoppingBag size={32} className="text-orange-500" />}
                        title="Group Orders"
                        desc="Ordering from Zomato or Blinkit? Start a pool and save on delivery fees."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Users size={32} className="text-purple-600" />}
                        title="Community Help"
                        desc="Need a kettle? Lost an ID card? Broadcast it to the campus network."
                        delay={0.3}
                    />
                </div>
            </div>

            {/* --- Footer --- */}
            <footer className="bg-gray-50 py-10 text-center text-gray-400 text-sm">
                <p>© 2026 Campus Commute. Built for Students.</p>
            </footer>
        </div>
    )
}

// A reusable card component for the features
function FeatureCard({ icon, title, desc, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all"
        >
            <div className="mb-4 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
        </motion.div>
    )
}