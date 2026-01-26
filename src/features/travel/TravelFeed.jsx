import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Car, Bus, Footprints } from 'lucide-react'

export default function TravelFeed({ session }) {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)

    // Form State
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [time, setTime] = useState('')
    const [mode, setMode] = useState('Cab')

    const fetchPlans = async () => {
        const { data } = await supabase
            .from('travel_plans')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setPlans(data)
    }

    useEffect(() => { fetchPlans() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('travel_plans').insert([
            { user_email: session.user.email, origin, destination, travel_time: time, mode }
        ])
        if (!error) {
            setOrigin(''); setDestination(''); fetchPlans()
        }
        setLoading(false)
    }

    // Helper to pick icons
    const getIcon = (mode) => {
        if (mode === 'Bus') return <Bus size={18} />
        if (mode === 'Walking') return <Footprints size={18} />
        return <Car size={18} />
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-8">
            {/* --- Animated Form --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <MapPin className="text-blue-500" /> Post a Trip
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input placeholder="From" className="flex-1 bg-gray-50 border-none p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all" value={origin} onChange={e => setOrigin(e.target.value)} required />
                        <input placeholder="To" className="flex-1 bg-gray-50 border-none p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all" value={destination} onChange={e => setDestination(e.target.value)} required />
                    </div>
                    <div className="flex gap-2">
                        <input placeholder="Time" className="flex-1 bg-gray-50 border-none p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all" value={time} onChange={e => setTime(e.target.value)} required />
                        <select className="bg-gray-50 border-none p-3 rounded-xl outline-none" value={mode} onChange={e => setMode(e.target.value)}>
                            <option>Cab</option><option>Auto</option><option>Walking</option><option>Bus</option>
                        </select>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-500/30"
                    >
                        {loading ? 'Posting...' : 'Share Plan'}
                    </motion.button>
                </form>
            </motion.div>

            {/* --- Animated Feed --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 px-2">Recent Plans</h3>
                <AnimatePresence>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }} // Stagger effect
                            whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                            <div className="flex justify-between items-center pl-4">
                                <div>
                                    <div className="flex items-center gap-2 text-indigo-500 font-bold mb-1 text-sm">
                                        {getIcon(plan.mode)} {plan.mode}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {plan.origin} <span className="text-gray-300">➔</span> {plan.destination}
                                    </h3>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                        <Clock size={12} /> {plan.travel_time}
                                    </div>
                                </div>
                                <div className="text-right">
                   <span className="text-xs font-medium bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {plan.user_email.split('@')[0]}
                  </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}