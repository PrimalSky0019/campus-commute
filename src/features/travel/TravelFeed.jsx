import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Car, Bus, Footprints, ArrowRight } from 'lucide-react'

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

    const getIcon = (mode) => {
        if (mode === 'Bus') return <Bus size={18} />
        if (mode === 'Walking') return <Footprints size={18} />
        return <Car size={18} />
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-8">

            {/* --- BEAUTIFUL FORM CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden"
            >
                {/* Decorative Background Blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2 relative z-10">
                    <MapPin className="text-blue-600" /> Post a Trip
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">From</label>
                            <input
                                placeholder="e.g. Hostel 1"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 ring-blue-500 focus:bg-white outline-none transition-all"
                                value={origin} onChange={e => setOrigin(e.target.value)} required
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">To</label>
                            <input
                                placeholder="e.g. Airport"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 ring-blue-500 focus:bg-white outline-none transition-all"
                                value={destination} onChange={e => setDestination(e.target.value)} required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Time</label>
                            <input
                                placeholder="e.g. 5:00 PM"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 ring-blue-500 focus:bg-white outline-none transition-all"
                                value={time} onChange={e => setTime(e.target.value)} required
                            />
                        </div>
                        <div className="w-1/3 space-y-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Mode</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 h-[50px]"
                                value={mode} onChange={e => setMode(e.target.value)}
                            >
                                <option>Cab</option><option>Auto</option><option>Walking</option><option>Bus</option>
                            </select>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 mt-2 flex justify-center items-center gap-2"
                    >
                        {loading ? 'Posting...' : 'Share Plan'} <ArrowRight size={18} />
                    </motion.button>
                </form>
            </motion.div>

            {/* --- FEED SECTION --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 px-2">Recent Plans</h3>
                <AnimatePresence>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group cursor-default"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 text-indigo-500 font-bold mb-1 text-xs uppercase tracking-wider bg-indigo-50 w-fit px-2 py-1 rounded">
                                        {getIcon(plan.mode)} {plan.mode}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mt-2">
                                        {plan.origin} <span className="text-gray-300 mx-1">➔</span> {plan.destination}
                                    </h3>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-2 font-medium">
                                        <Clock size={12} /> {plan.travel_time}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                        {plan.user_email[0].toUpperCase()}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1">
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