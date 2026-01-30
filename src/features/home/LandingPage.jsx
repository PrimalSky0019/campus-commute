import { motion } from 'framer-motion'
import { Car, ShoppingBag, ShieldAlert, ArrowRight, Users, Coffee, Play, Zap, Smile, Lock } from 'lucide-react'

const FeatureCard = ({ title, desc, icon, bg, btn, delay, isTall }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        whileHover={{ y: -10 }}
        className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl cursor-pointer ${bg} ${isTall ? 'md:row-span-2' : ''} h-full flex flex-col justify-between`}
    >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent"></div>

        <div className="relative z-10">
            <motion.div
                className="mb-6 text-[#1a1a1a] origin-center inline-block"
                whileHover={{ scale: 1.25, rotate: 15 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
                {icon}
            </motion.div>

            <motion.h3
                className="text-2xl font-bold mb-3 text-[#1a1a1a]"
                whileHover={{ letterSpacing: "0.05em" }}
                transition={{ duration: 0.3 }}
            >
                {title}
            </motion.h3>
            <motion.p
                className="text-gray-600 font-medium mb-6 text-sm leading-relaxed"
                whileHover={{ color: "#1a1a1a" }}
                transition={{ duration: 0.3 }}
            >
                {desc}
            </motion.p>
        </div>

        <div className="relative z-10 mt-auto">
            <motion.button
                whileHover={{ scale: 1.08, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`${btn} text-white font-bold rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all group-hover:translate-x-1 relative overflow-hidden inline-flex items-center gap-2`}
            >
                <motion.span
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white/20"
                />
                <span className="relative">Explore</span>
                <ArrowRight size={16} className="relative" />
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
        whileHover={{ scale: 1.1, y: -5 }}
        className="text-center cursor-pointer group"
    >
        <motion.div
            className={`text-5xl md:text-6xl font-black ${color} mb-3 font-sans relative`}
            whileHover={{ fontSize: "3.75rem" }}
            transition={{ duration: 0.3 }}
        >
            <motion.span
                whileHover={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {number}
            </motion.span>

            <motion.span
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent"
                aria-hidden="true"
            >
                {number}
            </motion.span>
        </motion.div>
        <motion.p
            className="text-gray-500 font-medium text-lg"
            whileHover={{ color: "#1a1a1a", fontWeight: 700 }}
            transition={{ duration: 0.3 }}
        >
            {label}
        </motion.p>
    </motion.div>
)

export default function LandingPage({ onGetStarted = () => console.log("Get Started") }) {
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
                        className="flex items-center gap-3 cursor-pointer"
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
            <section className="pt-40 pb-20 px-4 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="group"
                >
                    <motion.h1
                        className="text-6xl md:text-8xl font-black tracking-tighter text-[#1a1a1a] mb-6 leading-[0.95] group-hover:tracking-wider transition-all duration-300"
                        whileHover={{ color: "#00C853" }}
                        transition={{ duration: 0.3 }}
                    >
                        Campus <br />
                        <span className="inline-flex items-center mx-2 align-middle relative top-[-10px] md:top-[-20px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '160px' }}
                                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                                whileHover={{ width: '180px', boxShadow: '0 20px 50px rgba(0, 200, 83, 0.3)' }}
                                className="h-[60px] md:h-[80px] rounded-full bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center border-4 border-[#FDF8F0] overflow-hidden shadow-lg transition-all"
                            />
                        </span>
                        is Living.
                    </motion.h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-600 max-w-2xl font-medium mb-10 leading-relaxed cursor-default"
                    whileHover={{ color: "#1a1a1a", letterSpacing: "0.02em" }}
                    transition={{ duration: 0.3 }}
                >
                    Travel together. Eat together. Stay safe together. <br/>
                    <span className="font-bold text-[#00C853]">The all-in-one platform for student life.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center"
                >
                    <motion.button
                        onClick={onGetStarted}
                        whileHover={{ scale: 1.08, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-[#00C853] text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-200 hover:shadow-2xl relative overflow-hidden group"
                    >
                        <motion.span
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white/20"
                        />
                        <span className="relative">Get Started</span> <ArrowRight size={20} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.08, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-[#1a1a1a] border-2 border-gray-300 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-md group relative overflow-hidden"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        />
                        <Play size={18} fill="currentColor" /> <span className="relative">Watch Demo</span>
                    </motion.button>
                </motion.div>
            </section>

            {/* --- FEATURE CARDS --- */}
            <section className="py-20 px-6 max-w-7xl mx-auto w-full">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(300px,auto)]"
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
                        desc="Pool orders from Zomato & Blinkit. Faster delivery. Better discounts. Order in bulk and save big."
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
                        className="inline-block bg-gradient-to-r from-green-100 to-yellow-100 text-[#00C853] px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-8"
                    >
                        Our Impact
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-black mb-16 tracking-tight text-[#1a1a1a]"
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

            {/* --- HOW TO USE SECTION --- */}
            <section className="py-24 px-6 max-w-6xl mx-auto w-full relative overflow-hidden">
                <motion.div
                    className="absolute -top-32 -right-32 w-96 h-96 bg-green-100 rounded-full opacity-15 blur-3xl z-0"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 relative z-10"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-gradient-to-r from-green-100 to-yellow-100 text-[#00C853] px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider"
                    >
                        Getting Started
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 mt-6">How to Use Campus Commute</h2>
                    <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto">Simple steps to connect, share, and save.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {[
                        {
                            step: "01",
                            title: "🔐 Sign Up",
                            desc: "Create your account with your campus email. Takes less than 2 minutes. Verify your identity instantly.",
                            features: ["Campus Email Required", "One-Click Login", "Profile Setup"]
                        },
                        {
                            step: "02",
                            title: "🎯 Create or Join",
                            desc: "Post your travel plans, delivery needs, or emergency requests. Or join existing posts from other students.",
                            features: ["Post Plans", "Browse Listings", "Smart Matching"]
                        },
                        {
                            step: "03",
                            title: "💰 Save & Connect",
                            desc: "Connect with peers, split costs, share rides, pool orders. Track your savings and build your community.",
                            features: ["Real-time Chat", "Cost Split", "Community"]
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ y: -12, boxShadow: "0 30px 60px rgba(0, 200, 83, 0.12)" }}
                            className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-green-200 transition-all relative overflow-hidden group h-full flex flex-col"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:to-green-50/30 transition-all"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                            />

                            <motion.div
                                className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4 relative z-10"
                                whileHover={{ scale: 1.15 }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.step}
                            </motion.div>

                            <motion.h3
                                className="text-2xl font-bold text-[#1a1a1a] mb-3 relative z-10"
                                whileHover={{ letterSpacing: "0.05em" }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.title}
                            </motion.h3>

                            <motion.p
                                className="text-gray-600 font-medium mb-6 relative z-10 leading-relaxed flex-grow"
                                whileHover={{ color: "#1a1a1a" }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.desc}
                            </motion.p>

                            <motion.div className="space-y-2 relative z-10 mt-auto">
                                {item.features.map((feature, fIdx) => (
                                    <motion.div
                                        key={fIdx}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.15 + fIdx * 0.08 }}
                                        className="flex items-center gap-3 text-sm font-medium text-gray-700"
                                    >
                                        <motion.div
                                            className="w-2 h-2 rounded-full bg-green-500"
                                            whileHover={{ scale: 1.5 }}
                                        />
                                        {feature}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Use Cases */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 grid md:grid-cols-2 gap-12 relative z-10"
                >
                    <div className="space-y-8">
                        <h3 className="text-3xl font-bold text-[#1a1a1a] mb-8">What You Can Do</h3>
                        {[
                            { icon: "🚗", title: "Share Rides", desc: "Going to the airport? Heading home? Find students going your way." },
                            // eslint-disable-next-line
                            { icon: "🍔", title: "Pool Food Orders", desc: "Hungry? Order together from Zomato/Blinkit for faster delivery & discounts." },
                            { icon: "🚨", title: "Emergency Help", desc: "Need assistance? SOS button connects you to the safety network instantly." },
                            { icon: "👥", title: "Build Community", desc: "Meet peers, make friends, expand your campus network organically." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ x: 8 }}
                                className="flex gap-4 group cursor-pointer items-start"
                            >
                                <motion.div
                                    className="text-4xl flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {item.icon}
                                </motion.div>
                                <div className="group-hover:translate-x-1 transition-transform pt-2">
                                    <h4 className="font-bold text-xl text-[#1a1a1a] mb-1">{item.title}</h4>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ boxShadow: "0 40px 80px rgba(0, 200, 83, 0.15)" }}
                        // Fixed: Removed 'relative' to avoid conflict with 'sticky'
                        className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl p-12 border border-green-100 overflow-hidden h-fit md:sticky md:top-24"
                    >
                        <motion.div
                            className="absolute top-0 right-0 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-3xl"
                            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                        <div className="relative z-10">
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                ✨
                            </motion.div>
                            <h4 className="text-2xl font-black text-[#1a1a1a] mb-6">Pro Tips</h4>
                            <ul className="space-y-6 text-sm">
                                <li className="flex gap-4 items-center">
                                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">⚡</span>
                                    <span><strong>Post Early:</strong> Best matches happen in the first hour.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">🤝</span>
                                    <span><strong>Be Specific:</strong> Detailed posts get faster responses.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">⭐</span>
                                    <span><strong>Rate & Review:</strong> Build trust in the community.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">🔒</span>
                                    <span><strong>Stay Safe:</strong> Use our verified system always.</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>
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
                            whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0, 200, 83, 0.15)" }}
                            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 text-center group cursor-pointer relative overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-[#00C853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                            />
                            <motion.div
                                className="inline-block p-4 bg-green-50 rounded-full text-[#00C853] mb-4 group-hover:scale-110"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                {item.icon}
                            </motion.div>
                            <motion.h3
                                className="text-xl font-bold mb-2 text-[#1a1a1a] relative z-10"
                                whileHover={{ letterSpacing: "0.05em" }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.title}
                            </motion.h3>
                            <motion.p
                                className="text-gray-600 font-medium relative z-10"
                                whileHover={{ color: "#00C853" }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.desc}
                            </motion.p>
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
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-white to-gray-50 p-12 rounded-3xl max-w-2xl w-full text-center border-2 border-gray-200 shadow-2xl group relative overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                    />

                    <motion.h3
                        className="text-3xl md:text-4xl font-black mb-3 text-[#1a1a1a] relative z-10"
                        whileHover={{ letterSpacing: "0.05em" }}
                        transition={{ duration: 0.3 }}
                    >
                        Ready to Join?
                    </motion.h3>
                    <motion.p
                        className="text-gray-600 font-medium mb-8 text-lg relative z-10"
                        whileHover={{ color: "#00C853" }}
                        transition={{ duration: 0.3 }}
                    >
                        Select your role to get started.
                    </motion.p>

                    <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-white py-6 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-[#00C853] shadow-sm transition-all flex flex-col items-center justify-center gap-3 group/btn relative overflow-hidden"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-green-50"
                                style={{ zIndex: -1 }}
                            />
                            <motion.div
                                className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#00C853] group-hover/btn:bg-[#00C853] group-hover/btn:text-white transition-colors relative z-10"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                                <Users size={24} />
                            </motion.div>
                            <span className="text-[#1a1a1a] relative z-10">Student</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-white py-6 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-blue-500 shadow-sm transition-all flex flex-col items-center justify-center gap-3 group/btn relative overflow-hidden"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-blue-50"
                                style={{ zIndex: -1 }}
                            />
                            <motion.div
                                className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors relative z-10"
                                whileHover={{ scale: 1.2, rotate: -10 }}
                            >
                                <Coffee size={24} />
                            </motion.div>
                            <span className="text-[#1a1a1a] relative z-10">Faculty</span>
                        </motion.button>
                    </div>

                    <motion.button
                        onClick={onGetStarted}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[#00C853] to-[#00b548] text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 relative overflow-hidden group/cta z-10"
                    >
                        <motion.span
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white/20"
                        />
                        <span className="relative">Create Account</span> <ArrowRight size={20} />
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
                <p className="font-medium text-gray-400">© 2026 Campus Commute. Making student life better. 🚀</p>
            </motion.footer>
        </div>
    )
}