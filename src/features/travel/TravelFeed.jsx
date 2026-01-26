import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Car, Bus, Footprints, ArrowRight, Sparkles } from 'lucide-react'

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
        if (mode === 'Bus') return <Bus size={16} />
        if (mode === 'Walking') return <Footprints size={16} />
        return <Car size={16} />
    }

    return (
        <div className="relative min-h-[80vh] w-full max-w-2xl mx-auto p-4 text-white">

            {/* --- BACKGROUND LIQUID EFFECT (The "Liquid Blob") --- */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-yellow-600/30 via-orange-500/20 to-purple-900/30 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse"></div>

            {/* --- HEADER --- */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold tracking-tighter mb-2">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Route.</span>
                </h2>
                <p className="text-gray-400 text-sm">Coordinate travel in a regulated environment.</p>
            </div>

            {/* --- GLASS FORM CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
            >
                {/* Shine Effect */}
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">Origin</label>
                            <div className="relative">
                                <input
                                    placeholder="Hostel 1"
                                    className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-gray-600"
                                    value={origin} onChange={e => setOrigin(e.target.value)} required
                                />
                                <MapPin className="absolute right-4 top-4 text-gray-600" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">Destination</label>
                            <div className="relative">
                                <input
                                    placeholder="Airport"
                                    className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-gray-600"
                                    value={destination} onChange={e => setDestination(e.target.value)} required
                                />
                                <MapPin className="absolute right-4 top-4 text-gray-600" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">Time</label>
                            <input
                                placeholder="5:00 PM"
                                className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-yellow-500/50 outline-none transition-all placeholder:text-gray-600"
                                value={time} onChange={e => setTime(e.target.value)} required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">Mode</label>
                            <select
                                className="w-full h-[58px] bg-black/40 border border-white/10 text-white px-4 rounded-xl focus:border-yellow-500/50 outline-none appearance-none cursor-pointer"
                                value={mode} onChange={e => setMode(e.target.value)}
                            >
                                <option>Cab</option><option>Auto</option><option>Bus</option>
                            </select>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-white text-black p-4 rounded-xl font-bold text-lg mt-2 hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        {loading ? 'Processing...' : 'Post Trip'} <ArrowRight size={20} />
                    </motion.button>
                </form>
            </motion.div>

            {/* --- FEED SECTION --- */}
            <div className="mt-12 space-y-4">
                <div className="flex justify-between items-end px-2 mb-4">
                    <h3 className="text-xl font-bold">Active Requests</h3>
                    <div className="text-xs font-mono text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        LIVE FEED
                    </div>
                </div>

                <AnimatePresence>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                            className="bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-md flex justify-between items-center group"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/10 p-2 rounded-lg text-yellow-200">
                                        {getIcon(plan.mode)}
                                    </div>
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{plan.mode}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    {plan.origin}
                                    <span className="text-gray-600">→</span>
                                    {plan.destination}
                                </h4>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-yellow-500 font-bold mb-1">
                                    <Clock size={14} /> {plan.travel_time}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    by {plan.user_email.split('@')[0]}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}