import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { Leaf, Drumstick, Plane, Train, ShoppingBag, Home, Bell, Check } from 'lucide-react'

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
            alert("Error saving profile: " + error.message)
        } else {
            onComplete() // Tell App.jsx we are done!
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-white"
            >
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`} />
                    ))}
                </div>

                {/* --- STEP 1: BASICS --- */}
                {step === 1 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 className="text-3xl font-black mb-2">Welcome! 👋</h2>
                        <p className="text-gray-500 mb-8 font-medium">Let's set up your campus identity.</p>

                        <label className="block text-sm font-bold mb-2 ml-1">What's your name?</label>
                        <input
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full bg-gray-50 text-black p-4 rounded-xl font-bold outline-none focus:ring-2 ring-green-500 mb-6"
                            placeholder="e.g. Rahul Sharma"
                            autoFocus
                        />

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6 cursor-pointer" onClick={() => setNotify(!notify)}>
                            <div className={`w-6 h-6 rounded border flex items-center justify-center ${notify ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'}`}>
                                {notify && <Check size={14} strokeWidth={4} />}
                            </div>
                            <div>
                                <p className="font-bold text-sm">Enable Notifications</p>
                                <p className="text-xs text-gray-400">Get alerts for rides & orders</p>
                            </div>
                            <Bell size={18} className="ml-auto text-gray-400" />
                        </div>

                        <button
                            disabled={!fullName}
                            onClick={() => setStep(2)}
                            className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                        >
                            Next Step
                        </button>
                    </motion.div>
                )}

                {/* --- STEP 2: DIET --- */}
                {step === 2 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 className="text-3xl font-black mb-2">Food Preferences 🍔</h2>
                        <p className="text-gray-500 mb-8 font-medium">This helps us filter delivery requests.</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setDiet('Veg')}
                                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${diet === 'Veg' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                            >
                                <Leaf size={32} />
                                <span className="font-bold">Pure Veg</span>
                            </button>
                            <button
                                onClick={() => setDiet('Non-Veg')}
                                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${diet === 'Non-Veg' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                            >
                                <Drumstick size={32} />
                                <span className="font-bold">Non-Veg</span>
                            </button>
                        </div>
                        <button onClick={() => setDiet('Both')} className={`w-full p-3 rounded-xl mb-8 font-bold text-sm ${diet === 'Both' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-400'}`}>I eat everything (Both)</button>

                        <button onClick={() => setStep(3)} className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform">
                            Next Step
                        </button>
                    </motion.div>
                )}

                {/* --- STEP 3: ROUTES --- */}
                {step === 3 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 className="text-3xl font-black mb-2">Route Alerts 🔔</h2>
                        <p className="text-gray-500 mb-8 font-medium">We'll notify you when someone posts a ride to these places.</p>

                        <div className="flex flex-wrap gap-3 mb-10">
                            {PRESET_ROUTES.map((route) => {
                                const isActive = routes.includes(route.name)
                                return (
                                    <button
                                        key={route.name}
                                        onClick={() => toggleRoute(route.name)}
                                        className={`px-4 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${isActive ? 'bg-[#1a1a1a] text-white shadow-lg scale-105' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}
                                    >
                                        {route.icon} {route.name}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#00C853] text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-green-200"
                        >
                            {loading ? 'Setting up...' : 'Finish Setup 🎉'}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}