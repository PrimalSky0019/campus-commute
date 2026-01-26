import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Car, Bus, Footprints, ArrowRight, Navigation } from 'lucide-react'

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

    // Helper to get the right icon
    const getIcon = (mode) => {
        if (mode === 'Bus') return <Bus size={18} />
        if (mode === 'Walking') return <Footprints size={18} />
        return <Car size={18} />
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-8">

            {/* --- FLOATING FORM CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-50 relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -z-10"></div>

                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Navigation className="text-blue-600 fill-blue-600" size={20} />
                    Post a Trip
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Row 1: From & To */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative group">
                            <MapPin className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                placeholder="From (e.g. Hostel)"
                                className="w-full bg-gray-50 border border-gray-100 pl-10 p-3 rounded-xl focus:ring-2 ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                                value={origin} onChange={e => setOrigin(e.target.value)} required
                            />
                        </div>
                        <div className="flex-1 relative group">
                            <MapPin className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                placeholder="To (e.g. Airport)"
                                className="w-full bg-gray-50 border border-gray-100 pl-10 p-3 rounded-xl focus:ring-2 ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                                value={destination} onChange={e => setDestination(e.target.value)} required
                            />
                        </div>
                    </div>

                    {/* Row 2: Time & Mode */}
                    <div className="flex gap-3">
                        <div className="flex-[2] relative group">
                            <Clock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                placeholder="Time (e.g. 5:00 PM)"
                                className="w-full bg-gray-50 border border-gray-100 pl-10 p-3 rounded-xl focus:ring-2 ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                                value={time} onChange={e => setTime(e.target.value)} required
                            />
                        </div>
                        <div className="flex-1">
                            <select
                                className="w-full h-full bg-gray-50 border border-gray-100 px-3 rounded-xl outline-none focus:ring-2 ring-blue-500 cursor-pointer font-medium text-gray-600"
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 mt-2 flex justify-center items-center gap-2 hover:shadow-blue-500/40 transition-shadow"
                    >
                        {loading ? 'Posting...' : 'Share Plan'} <ArrowRight size={18} />
                    </motion.button>
                </form>
            </motion.div>

            {/* --- ANIMATED LIST --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-gray-700">Recent Plans</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{plans.length} Active</span>
                </div>

                <AnimatePresence>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -2, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group cursor-default relative overflow-hidden"
                        >
                            {/* Left Accent Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-2xl"></div>

                            <div className="flex justify-between items-center pl-3">
                                <div>
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1 text-[11px] uppercase tracking-wider bg-indigo-50 w-fit px-2 py-0.5 rounded border border-indigo-100">
                                        {getIcon(plan.mode)} {plan.mode}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mt-1 flex items-center gap-2">
                                        {plan.origin}
                                        <ArrowRight size={14} className="text-gray-300" />
                                        {plan.destination}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2 font-medium">
                                        <Clock size={12} className="text-gray-400" />
                                        Leaving at <span className="text-gray-700 font-bold">{plan.travel_time}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-gray-600 font-bold text-xs">
                                        {plan.user_email[0].toUpperCase()}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 font-medium">
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