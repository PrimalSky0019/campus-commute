import { motion } from 'framer-motion'
import { Car, ShoppingBag, ShieldAlert, ArrowRight, Users, Coffee, Play, Zap, Smile, Lock } from 'lucide-react'

const FeatureCard = ({ title, desc, icon, bg, btn, delay, isTall }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl cursor-pointer ${bg} ${isTall ? 'md:row-span-2' : ''}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
            <motion.div 
                className="mb-6 text-[#1a1a1a]"
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
                {icon}
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-3 text-[#1a1a1a]">{title}</h3>
            <p className="text-gray-600 font-medium mb-6 text-sm leading-relaxed">{desc}</p>
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${btn} text-white font-bold rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all group-hover:translate-x-1`}
            >
                Explore →
            </motion.button>
        </div>
    </motion.div>
)

const Stat = ({ number, label, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="text-center"
    >
        <div className={`text-5xl md:text-6xl font-black ${color} mb-3 font-sans`}>
            {number}
        </div>
        <p className="text-gray-500 font-medium text-lg">{label}</p>
    </motion.div>
)

export default function LandingPage({ onGetStarted }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    return (
        <div className="w-full min-h-screen bg-[#FDF8F0] text-[#1a1a1a] font-sans overflow-x-hidden flex flex-col items-center">

            {/* --- NAVBAR --- */}
            <motion.nav 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 w-full p-6 z-50 flex justify-center bg-[#FDF8F0]/95 backdrop-blur-md border-b border-gray-200/50"
            >
                <div className="max-w-7xl w-full flex justify-between items-center px-4">
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div 
                            className="w-10 h-10 bg-gradient-to-br from-[#00C853] to-[#00b548] rounded-full flex items-center justify-center text-white font-bold tracking-tighter shadow-lg"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            CC
                        </motion.div>
                        <span className="font-bold text-xl tracking-tight text-[#1a1a1a]">CampusCommute</span>
                    </motion.div>
                    <motion.button
                        onClick={onGetStarted}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-full font-bold hover:shadow-lg shadow-md transition-all"
                    >
                        Login
                    </motion.button>
                </div>
            </motion.nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-40 pb-20 px-4 flex flex-col items-center text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1a1a1a] mb-6 leading-[0.95]">
                        Campus <br />
                        <span className="inline-flex items-center mx-2 align-middle">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '160px' }}
                                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                                className="h-[80px] rounded-full bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center border-4 border-[#FDF8F0] overflow-hidden shadow-lg"
                            />
                        </span>
                        is Living.
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-600 max-w-2xl font-medium mb-10 leading-relaxed"
                >
                    Travel together. Eat together. Stay safe together. <br/>
                    <span className="font-bold text-[#00C853]">The all-in-one platform for student life.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
                >
                    <motion.button 
                        onClick={onGetStarted}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-[#00C853] text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-200 hover:shadow-2xl"
                    >
                        Get Started <ArrowRight size={20} />
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-[#1a1a1a] border-2 border-gray-300 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                        <Play size={18} fill="currentColor" /> Watch Demo
                    </motion.button>
                </motion.div>
            </section>

            {/* --- FEATURE CARDS --- */}
            <section className="py-20 px-6 max-w-7xl mx-auto w-full">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <FeatureCard
                        title="🚗 Travel Smart"
                        desc="Find peers going to the airport. Share rides. Split costs instantly."
                        icon={<Car size={32} />}
                        bg="bg-[#FFF8E1]" btn="bg-[#FFD740]" delay={0.2}
                    />
                    <FeatureCard
                        title="🍔 Group Orders"
                        desc="Pool orders from Zomato & Blinkit. Faster delivery. Better discounts."
                        icon={<ShoppingBag size={32} />}
                        bg="bg-[#E8F5E9]" btn="bg-[#00C853]" delay={0.4}
                        isTall={true}
                    />
                    <FeatureCard
                        title="🚨 Stay Safe"
                        desc="Emergency SOS. Live location sharing. Campus protection network."
                        icon={<ShieldAlert size={32} />}
                        bg="bg-[#FFEBEE]" btn="bg-[#FF5252]" delay={0.6}
                    />
                </motion.div>
            </section>

            {/* --- IMPACT SECTION --- */}
            <section className="py-20 px-6 w-full">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-12 md:p-24 shadow-2xl text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"></div>
                    <motion.div 
                        className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full opacity-20 blur-3xl"
                        animate={{ y: [0, 40, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    ></motion.div>

                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-gradient-to-r from-green-100 to-yellow-100 text-[#00C853] px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider"
                    >
                        Our Impact
                    </motion.span>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-black mt-8 mb-16 tracking-tight text-[#1a1a1a]"
                    >
                        Making Campus <br/> Smaller & Safer.
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-12 relative z-10">
                        <Stat number="31k+" label="Rides Shared" color="text-[#00C853]" delay={0.2} />
                        <Stat number="214" label="Emergencies Solved" color="text-[#FF5252]" delay={0.4} />
                        <Stat number="$12k" label="Saved on Delivery" color="text-[#FFD740]" delay={0.6} />
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIAL SECTION --- */}
            <section className="py-20 px-6 max-w-6xl mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-black text-[#1a1a1a] mb-4">Why Students Love Us</h2>
                    <p className="text-gray-600 font-medium text-lg">Trusted by thousands of students across campuses</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: <Zap size={28} />, title: "Super Fast", desc: "Find matches in seconds" },
                        { icon: <Smile size={28} />, title: "Easy to Use", desc: "Intuitive interface for everyone" },
                        { icon: <Lock size={28} />, title: "Secure", desc: "Your data is always protected" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 text-center"
                        >
                            <div className="inline-block p-4 bg-green-50 rounded-full text-[#00C853] mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-[#1a1a1a]">{item.title}</h3>
                            <p className="text-gray-600 font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="pb-32 px-6 flex justify-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-white to-gray-50 p-12 rounded-3xl max-w-2xl w-full text-center border-2 border-gray-200 shadow-2xl"
                >
                    <h3 className="text-3xl md:text-4xl font-black mb-3 text-[#1a1a1a]">Ready to Join?</h3>
                    <p className="text-gray-600 font-medium mb-8 text-lg">Select your role to get started.</p>

                    <div className="flex gap-4 mb-6">
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-white py-6 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-[#00C853] shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#00C853] group-hover:bg-[#00C853] group-hover:text-white transition-colors">
                                <Users size={24} />
                            </div>
                            <span className="text-[#1a1a1a]">Student</span>
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-white py-6 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-blue-500 shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Coffee size={24} />
                            </div>
                            <span className="text-[#1a1a1a]">Faculty</span>
                        </motion.button>
                    </div>

                    <motion.button
                        onClick={onGetStarted}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[#00C853] to-[#00b548] text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                    >
                        Create Account <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </section>

            {/* --- FOOTER --- */}
            <motion.footer 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full bg-[#1a1a1a] text-white py-12 px-6 text-center"
            >
                <p className="font-medium text-gray-400">© 2024 Campus Commute. Making student life better. 🚀</p>
            </motion.footer>
        </div>
    )
}