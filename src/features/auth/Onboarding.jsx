import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Drumstick, Plane, Train, ShoppingBag, Home, Bell, Check, ArrowRight, Sparkles, Utensils } from 'lucide-react'
import { toast } from 'sonner'

export default function Onboarding({ session, onComplete }) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [direction, setDirection] = useState(1) // To control slide direction

    // Form Data
    const [fullName, setFullName] = useState('')
    const [diet, setDiet] = useState('Veg')
    const [routes, setRoutes] = useState([])
    const [notify, setNotify] = useState(true)

    const PRESET_ROUTES = [
        { name: 'Airport', icon: <Plane size={20} />, color: 'bg-blue-50 text-blue-600' },
        { name: 'Railway Stn', icon: <Train size={20} />, color: 'bg-orange-50 text-orange-600' },
        { name: 'City Mall', icon: <ShoppingBag size={20} />, color: 'bg-pink-50 text-pink-600' },
        { name: 'Home', icon: <Home size={20} />, color: 'bg-green-50 text-green-600' }
    ]

    const changeStep = (newStep) => {
        setDirection(newStep > step ? 1 : -1)
        setStep(newStep)
    }

    const toggleRoute = (route) => {
        if (routes.includes(route)) {
            setRoutes(routes.filter(r => r !== route))
        } else {
            setRoutes([...routes, route])
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        const { error } = await supabase.from('profiles').upsert({
            id: session.user.id,
            full_name: fullName,
            diet_preference: diet,
            frequent_routes: routes,
            notifications_enabled: notify
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Welcome to Campus Commute!")
            onComplete()
        }
        setLoading(false)
    }

    // Animation Variants
    const slideVariants = {
        hidden: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: (direction) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        })
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans relative overflow-hidden">

            {/* --- 1. DYNAMIC MESH BACKGROUND --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-blue-300/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.5, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ y: [0, 50, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-green-300/20 rounded-full blur-[100px]"
                />
            </div>

            {/* --- 2. GLASS CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="max-w-lg w-full bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white relative z-10"
            >
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{
                                    width: i === step ? 30 : 10,
                                    backgroundColor: i <= step ? '#000' : '#E5E7EB'
                                }}
                                className="h-2 rounded-full transition-all duration-300"
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Step {step}/3</span>
                </div>

                <AnimatePresence mode="wait" custom={direction}>

                    {/* --- STEP 1: IDENTITY --- */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            variants={slideVariants}
                            initial="hidden" animate="visible" exit="exit"
                        >
                            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-black/20">
                                <Sparkles size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Let's start.</h2>
                            <p className="text-gray-500 text-lg mb-8">What should we call you on campus?</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                    <input
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        className="w-full bg-gray-100 text-gray-900 text-xl p-5 rounded-2xl font-bold outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all placeholder:text-gray-400"
                                        placeholder="Type your name..."
                                        autoFocus
                                    />
                                </div>

                                <motion.div
                                    className="p-5 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 cursor-pointer transition-all flex items-center justify-between group"
                                    onClick={() => setNotify(!notify)}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${notify ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                            <Bell size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Notifications</h4>
                                            <p className="text-sm text-gray-500">Alerts for rides & orders</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${notify ? 'bg-black border-black' : 'border-gray-300'}`}>
                                        {notify && <Check size={14} className="text-white" />}
                                    </div>
                                </motion.div>
                            </div>

                            <button
                                disabled={!fullName}
                                onClick={() => changeStep(2)}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 mt-10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    )}

                    {/* --- STEP 2: DIET --- */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            variants={slideVariants}
                            initial="hidden" animate="visible" exit="exit"
                        >
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <Utensils size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Food vibes?</h2>
                            <p className="text-gray-500 text-lg mb-8">This filters the delivery requests you see.</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {[
                                    { val: 'Veg', label: 'Vegetarian', icon: <Leaf size={28} />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' },
                                    { val: 'Non-Veg', label: 'Non-Veg', icon: <Drumstick size={28} />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' }
                                ].map(option => (
                                    <motion.button
                                        key={option.val}
                                        onClick={() => setDiet(option.val)}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all relative overflow-hidden ${
                                            diet === option.val
                                                ? `${option.bg} ${option.border} shadow-lg`
                                                : 'bg-white border-gray-100 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center ${option.color} shadow-sm`}>
                                            {option.icon}
                                        </div>
                                        <span className={`font-bold text-lg ${diet === option.val ? 'text-black' : 'text-gray-500'}`}>{option.label}</span>

                                        {diet === option.val && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                                <Check size={14} className="text-white"/>
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                onClick={() => setDiet('Both')}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 rounded-2xl font-bold text-sm border-2 transition-all ${diet === 'Both' ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400'}`}
                            >
                                I eat everything (Both)
                            </motion.button>

                            <div className="flex gap-4 mt-10">
                                <button onClick={() => changeStep(1)} className="px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Back</button>
                                <button onClick={() => changeStep(3)} className="flex-1 bg-black text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all">Next Step</button>
                            </div>
                        </motion.div>
                    )}

                    {/* --- STEP 3: ROUTES --- */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            variants={slideVariants}
                            initial="hidden" animate="visible" exit="exit"
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <Plane size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Frequent spots?</h2>
                            <p className="text-gray-500 text-lg mb-8">Tap the places you visit often.</p>

                            <div className="grid grid-cols-2 gap-3 mb-10">
                                {PRESET_ROUTES.map((route, idx) => {
                                    const isActive = routes.includes(route.name)
                                    return (
                                        <motion.button
                                            key={route.name}
                                            onClick={() => toggleRoute(route.name)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-4 rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-3 transition-all border-2 h-32 ${
                                                isActive
                                                    ? 'bg-black text-white border-black shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : route.color}`}>
                                                {route.icon}
                                            </div>
                                            {route.name}
                                        </motion.button>
                                    )
                                })}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => changeStep(2)} className="px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 bg-[#007AFF] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Setting up...' : 'Finish Setup 🎉'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    )
}