import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { Leaf, Drumstick, Plane, Train, ShoppingBag, Home, Bell, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function Onboarding({ session, onComplete }) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form Data
    const [fullName, setFullName] = useState('')
    const [diet, setDiet] = useState('Veg')
    const [routes, setRoutes] = useState([])
    const [notify, setNotify] = useState(true)

    const PRESET_ROUTES = [
        { name: 'Airport', icon: <Plane size={18} /> },
        { name: 'Railway Stn', icon: <Train size={18} /> },
        { name: 'City Mall', icon: <ShoppingBag size={18} /> },
        { name: 'Home (Weekend)', icon: <Home size={18} /> }
    ]

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
            toast.error("Error saving profile: " + error.message)
        } else {
            toast.success("Profile saved successfully!")
            onComplete() // Tell App.jsx we are done!
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-white to-[#F5F5F5] flex items-center justify-center p-6 font-sans text-[#1a1a1a] relative overflow-hidden">
            {/* Animated background orbs */}
            <motion.div
                className="fixed top-0 right-0 w-96 h-96 bg-[#00C853]/5 rounded-full blur-3xl pointer-events-none"
                animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="fixed bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"
                animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60 relative z-10"
            >
                {/* Progress Bar with Animation */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <motion.div 
                            key={i} 
                            layoutId={`progress-${i}`}
                            animate={{ scaleX: i <= step ? 1 : 0.6, opacity: i <= step ? 1 : 0.3 }}
                            className="h-2 flex-1 rounded-full bg-[#00C853] origin-left transition-all"
                        />
                    ))}
                </div>

                {/* Step Counter */}
                <div className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
                    Step {step} of 3
                </div>

                {/* --- STEP 1: BASICS --- */}
                {step === 1 && (
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h2 
                            className="text-3xl font-black mb-2"
                            animate={{ opacity: [0.7, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            Welcome! 👋
                        </motion.h2>
                        <p className="text-gray-500 mb-8 font-medium">Let's set up your campus identity.</p>

                        <label className="block text-sm font-bold mb-3 ml-1 text-gray-700">What's your name?</label>
                        <motion.input 
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full bg-gray-50/80 text-black p-4 rounded-xl font-bold outline-none focus:ring-2 ring-[#00C853] focus:bg-white mb-6 border border-gray-100 transition-all placeholder:text-gray-400"
                            placeholder="e.g. Rahul Sharma"
                            autoFocus
                            whileFocus={{ scale: 1.02 }}
                        />

                        <motion.div 
                            className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-xl mb-8 cursor-pointer border border-gray-100 hover:border-gray-200 transition-all"
                            onClick={() => setNotify(!notify)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div 
                                className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${notify ? 'bg-[#00C853] border-[#00C853] text-white shadow-lg shadow-green-200' : 'border-gray-300 bg-white'}`}
                                animate={{ scale: notify ? 1.1 : 1 }}
                            >
                                {notify && <Check size={14} strokeWidth={4} />}
                            </motion.div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">Enable Notifications</p>
                                <p className="text-xs text-gray-500">Get alerts for rides & orders</p>
                            </div>
                            <motion.div 
                                className="ml-auto text-gray-400"
                                animate={{ y: notify ? -2 : 0 }}
                            >
                                <Bell size={18} />
                            </motion.div>
                        </motion.div>

                        <motion.button
                            disabled={!fullName}
                            onClick={() => setStep(2)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue →
                        </motion.button>
                    </motion.div>
                )}

                {/* --- STEP 2: DIET --- */}
                {step === 2 && (
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h2 
                            className="text-3xl font-black mb-2"
                            animate={{ opacity: [0.7, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            Food Preferences 🍔
                        </motion.h2>
                        <p className="text-gray-500 mb-8 font-medium">This helps us filter delivery requests for you.</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                                { val: 'Veg', label: 'Pure Veg', icon: <Leaf size={32} />, color: 'green' },
                                { val: 'Non-Veg', label: 'Non-Veg', icon: <Drumstick size={32} />, color: 'red' }
                            ].map(option => (
                                <motion.button
                                    key={option.val}
                                    onClick={() => setDiet(option.val)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                                        diet === option.val 
                                            ? option.color === 'green' 
                                                ? 'border-[#00C853] bg-green-50 text-[#00C853] shadow-lg shadow-green-200' 
                                                : 'border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-200'
                                            : 'border-gray-100 bg-gray-50/80 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    <motion.div
                                        animate={{ scale: diet === option.val ? 1.2 : 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        {option.icon}
                                    </motion.div>
                                    <span className="font-bold text-sm">{option.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        <motion.button 
                            onClick={() => setDiet('Both')} 
                            whileHover={{ scale: 1.02 }}
                            className={`w-full p-3 rounded-xl mb-8 font-bold text-sm border transition-all ${diet === 'Both' ? 'bg-gray-800 text-white border-gray-800 shadow-lg' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >
                            I eat everything (Both)
                        </motion.button>

                        <div className="flex gap-3">
                            <motion.button 
                                onClick={() => setStep(1)}
                                whileHover={{ scale: 1.05 }}
                                className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Back
                            </motion.button>
                            <motion.button 
                                onClick={() => setStep(3)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Continue →
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* --- STEP 3: ROUTES --- */}
                {step === 3 && (
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h2 
                            className="text-3xl font-black mb-2"
                            animate={{ opacity: [0.7, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            Route Alerts 🔔
                        </motion.h2>
                        <p className="text-gray-500 mb-8 font-medium">We'll notify you for rides to these places.</p>

                        <div className="flex flex-wrap gap-3 mb-10">
                            {PRESET_ROUTES.map((route, idx) => {
                                const isActive = routes.includes(route.name)
                                return (
                                    <motion.button
                                        key={route.name}
                                        onClick={() => toggleRoute(route.name)}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`px-4 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all border-2 ${
                                            isActive 
                                                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                        }`}
                                    >
                                        <motion.div
                                            animate={{ rotate: isActive ? 360 : 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {route.icon}
                                        </motion.div>
                                        {route.name}
                                    </motion.button>
                                )
                            })}
                        </div>

                        <div className="flex gap-3">
                            <motion.button 
                                onClick={() => setStep(2)}
                                whileHover={{ scale: 1.05 }}
                                className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Back
                            </motion.button>
                            <motion.button
                                onClick={handleSubmit}
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-[#00C853] text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200/30 "
                            >
                                {loading ? (
                                    <motion.span 
                                        animate={{ opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        Setting up...
                                    </motion.span>
                                ) : (
                                    'Finish Setup 🎉'
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}