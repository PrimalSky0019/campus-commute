import { motion } from 'framer-motion'
import { Car, ShoppingBag, ShieldAlert, ArrowRight, Play, CheckCircle } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-green-500 selection:text-black">

            {/* --- BACKGROUND GLOW EFFECTS --- */}
            {/* Top Center Glow (White/Green) */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            {/* Bottom Right Glow (Teal) */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-900/40 rounded-full blur-[100px] pointer-events-none"></div>
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* --- FLOATING NAVBAR --- */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
                    <span className="font-bold text-white tracking-tight">CampusCommute</span>
                    <div className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Features</a>
                        <a href="#" className="hover:text-white transition-colors">Safety</a>
                        <a href="#" className="hover:text-white transition-colors">About</a>
                    </div>
                    <button
                        onClick={onGetStarted}
                        className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* --- MAIN HERO SECTION --- */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">

                {/* Floating "Badge" */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Live on Campus</span>
                </motion.div>

                {/* Main Title with Gradient */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
                >
                    One Platform for <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Student Life.
          </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed"
                >
                    Dive into the campus network. Coordinate rides, split delivery costs, and stay safe with emergency alerts—all in one secured ecosystem.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <button
                        onClick={onGetStarted}
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        Open App <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-ping opacity-20"></div>
                    </button>

                    <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-md flex items-center gap-2">
                        <Play size={18} fill="currentColor" /> Watch Demo
                    </button>
                </motion.div>
            </div>

            {/* --- FLOATING "NODES" (The Constellation Effect) --- */}
            {/* Node 1: Travel (Left) */}
            <FloatingNode
                icon={<Car size={20} />}
                label="Travel"
                sub="Carpooling"
                x="10%" y="30%" delay={0.5}
            />

            {/* Node 2: Delivery (Right) */}
            <FloatingNode
                icon={<ShoppingBag size={20} />}
                label="Delivery"
                sub="Group Orders"
                x="85%" y="45%" delay={0.7}
            />

            {/* Node 3: Safety (Bottom Left) */}
            <FloatingNode
                icon={<ShieldAlert size={20} />}
                label="Safety"
                sub="SOS Alerts"
                x="20%" y="75%" delay={0.9}
            />

            {/* Connecting Lines (SVG Overlay) */}
            <svg className="absolute inset-0 pointer-events-none opacity-20" width="100%" height="100%">
                {/* Line to Travel */}
                <motion.line
                    x1="50%" y1="50%" x2="10%" y2="30%"
                    stroke="url(#grad1)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
                />
                {/* Line to Delivery */}
                <motion.line
                    x1="50%" y1="50%" x2="85%" y2="45%"
                    stroke="url(#grad1)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.7 }}
                />
                {/* Line to Safety */}
                <motion.line
                    x1="50%" y1="50%" x2="20%" y2="75%"
                    stroke="url(#grad1)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.9 }}
                />
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                        <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.5 }} />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

// Reusable "Floating Node" Component
function FloatingNode({ icon, label, sub, x, y, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            style={{ left: x, top: y }}
            className="absolute hidden md:flex items-center gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl z-20"
        >
            <div className="p-3 rounded-full bg-white/10 border border-white/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                {icon}
            </div>
            <div>
                <div className="text-sm font-bold text-white">{label}</div>
                <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">{sub}</div>
            </div>
            {/* Little connecting dot */}
            <div className="absolute -right-1 top-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#34d399]"></div>
        </motion.div>
    )
}