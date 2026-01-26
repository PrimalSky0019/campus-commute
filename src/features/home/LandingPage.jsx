import { motion } from 'framer-motion'
import { Car, ShoppingBag, ShieldAlert, ArrowRight, Users, Coffee } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
    return (
        <div className="min-h-screen bg-[#FDF8F0] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-[#00C853] selection:text-white">
            <Navbar onGetStarted={onGetStarted} />
            <HeroSection onGetStarted={onGetStarted} />
            <FeatureCards />
            <ImpactSection />
            <CTASection onGetStarted={onGetStarted} />
            <Footer />
        </div>
    )
}

// --- 1. NAVBAR ---
function Navbar({ onGetStarted }) {
    return (
        <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-multiply bg-[#FDF8F0]/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white font-bold tracking-tighter">
                    CC
                </div>
                <span className="font-bold text-xl tracking-tight">CampusCommute</span>
            </div>
            <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
                Login
            </button>
        </nav>
    )
}

// --- 2. HERO SECTION ---
function HeroSection({ onGetStarted }) {
    return (
        <section className="relative pt-32 pb-20 px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-[10vw] md:text-[7rem] leading-[0.9] font-black tracking-tighter text-[#1a1a1a] mb-8">
                    Campus <br />
                    <span className="inline-flex items-center align-middle mx-2 align-baseline">
             {/* The "Pill" Image Animation */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '180px', opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                            className="h-[60px] md:h-[100px] w-[120px] md:w-[220px] rounded-full bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center border-4 border-[#FDF8F0] mx-2"
                        ></motion.div>
          </span>
                    is Living.
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-500 max-w-2xl font-medium mb-10 leading-relaxed"
            >
                Travel together. Eat together. Stay safe together. <br className="hidden md:block"/>
                The all-in-one platform for student life.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4"
            >
                <button onClick={onGetStarted} className="px-8 py-4 bg-[#00C853] text-white rounded-full font-bold text-lg hover:bg-[#00b548] transition-colors flex items-center gap-2 shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-1">
                    Get Started <ArrowRight size={20} />
                </button>
            </motion.div>
        </section>
    )
}

// --- 3. FEATURE CARDS ---
function FeatureCards() {
    return (
        <section className="py-20 px-6">
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                <FeatureCard
                    title="Travel"
                    desc="Find peers going to the airport. Split costs."
                    icon={<Car size={32} />}
                    bg="bg-[#FFF8E1]" btn="bg-[#FFD740]" delay={0.2}
                />
                <FeatureCard
                    title="Delivery"
                    desc="Pool orders from Zomato & Blinkit instantly."
                    icon={<ShoppingBag size={32} />}
                    bg="bg-[#E8F5E9]" btn="bg-[#00C853]" delay={0.4}
                    isTall={true} // Makes the middle card pop
                />
                <FeatureCard
                    title="Safety"
                    desc="Emergency SOS and live location sharing."
                    icon={<ShieldAlert size={32} />}
                    bg="bg-[#FFEBEE]" btn="bg-[#FF5252]" delay={0.6}
                />
            </div>
        </section>
    )
}

function FeatureCard({ title, desc, icon, bg, btn, delay, isTall }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className={`${bg} p-8 rounded-[2.5rem] flex flex-col justify-between ${isTall ? 'md:-mt-12 md:mb-12 shadow-xl' : 'shadow-sm'}`}
        >
            <div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-black">
                    {icon}
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">{desc}</p>
            </div>
            <div className={`w-12 h-12 ${btn} text-white rounded-full flex items-center justify-center mt-8 self-end`}>
                <ArrowRight size={20} />
            </div>
        </motion.div>
    )
}

// --- 4. IMPACT SECTION ---
function ImpactSection() {
    return (
        <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-12 md:p-20 shadow-sm text-center">
                <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">Our Impact</span>

                <h2 className="text-4xl md:text-6xl font-black mt-8 mb-16 tracking-tight">
                    Making Campus <br/> Smaller & Safer.
                </h2>

                <div className="grid md:grid-cols-3 gap-12">
                    <Stat number="31k+" label="Rides Shared" color="text-[#00C853]" delay={0.2} />
                    <Stat number="214" label="Emergencies Solved" color="text-[#FF5252]" delay={0.4} />
                    <Stat number="$12k" label="Saved on Delivery" color="text-[#FFD740]" delay={0.6} />
                </div>
            </div>
        </section>
    )
}

function Stat({ number, label, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring" }}
            className="flex flex-col items-center"
        >
            <h3 className={`text-6xl md:text-7xl font-black ${color} mb-2`}>{number}</h3>
            <p className="text-lg font-bold text-gray-400">{label}</p>
        </motion.div>
    )
}

// --- 5. CTA SECTION ---
function CTASection({ onGetStarted }) {
    return (
        <section className="pb-32 px-6 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#FDF8F0] p-8 max-w-xl w-full text-center"
            >
                <h3 className="text-3xl font-black mb-6">Ready to Join?</h3>

                <div className="flex gap-4 mb-6">
                    <button className="flex-1 bg-white py-4 rounded-2xl font-bold border-2 border-transparent hover:border-[#00C853] shadow-sm transition-all flex flex-col items-center justify-center gap-2">
                        <Users className="text-[#00C853]" size={32} />
                        <span>Student</span>
                    </button>
                    <button className="flex-1 bg-white py-4 rounded-2xl font-bold border-2 border-transparent hover:border-blue-500 shadow-sm transition-all flex flex-col items-center justify-center gap-2">
                        <Coffee className="text-blue-500" size={32} />
                        <span>Faculty</span>
                    </button>
                </div>

                <button
                    onClick={onGetStarted}
                    className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] transition-transform shadow-xl"
                >
                    Create Account
                </button>
            </motion.div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="text-center pb-8 text-gray-400 font-medium text-xs">
            <p>© 2026 Campus Commute. All rights reserved.</p>
        </footer>
    )
}