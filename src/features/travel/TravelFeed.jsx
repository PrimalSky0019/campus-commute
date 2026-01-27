import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Car, Bus, Footprints, ArrowRight, Users, Check, Flame, Trash2, CheckCircle } from 'lucide-react'
import { findMatchingOrders } from '../../utils/smartMatcher'

export default function TravelFeed({ session }) {
    const [plans, setPlans] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [completedRides, setCompletedRides] = useState(new Set())

    // Form State
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [time, setTime] = useState('')
    const [mode, setMode] = useState('Cab')

    const fetchData = async () => {
        // 1. Fetch Travel Plans
        const { data: travelData } = await supabase
            .from('travel_plans')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (travelData) {
            // Auto-delete rides older than 24 hours
            const filteredPlans = travelData.filter(plan => {
                const createdAt = new Date(plan.created_at)
                const now = new Date()
                const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
                return hoursDiff < 24
            })
            setPlans(filteredPlans)
        }

        // 2. Fetch Open Orders
        const { data: orderData } = await supabase
            .from('orders')
            .select('*')
            .eq('status', 'Open')
        if (orderData) setOrders(orderData)
    }

    // Auto-delete outdated rides in background
    const deleteOutdatedRides = async () => {
        const { data: allPlans } = await supabase
            .from('travel_plans')
            .select('id, created_at')
        
        if (allPlans) {
            const idsToDelete = allPlans
                .filter(plan => {
                    const createdAt = new Date(plan.created_at)
                    const now = new Date()
                    const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
                    return hoursDiff >= 24
                })
                .map(p => p.id)
            
            if (idsToDelete.length > 0) {
                await supabase
                    .from('travel_plans')
                    .delete()
                    .in('id', idsToDelete)
            }
        }
    }

    useEffect(() => {
        fetchData()
        deleteOutdatedRides()

        // Auto-cleanup every 30 minutes
        const cleanupInterval = setInterval(deleteOutdatedRides, 30 * 60 * 1000)

        // Realtime Subscriptions
        const travelSub = supabase.channel('travel_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'travel_plans' }, fetchData)
            .subscribe()

        const orderSub = supabase.channel('order_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData)
            .subscribe()

        return () => {
            travelSub.unsubscribe()
            orderSub.unsubscribe()
            clearInterval(cleanupInterval)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('travel_plans').insert([
            {
                user_email: session.user.email,
                origin,
                destination,
                travel_time: time,
                mode,
                passengers: [],
                seats_available: mode === 'Cab' ? 3 : 2
            }
        ])
        if (!error) { setOrigin(''); setDestination(''); setTime(''); }
        setLoading(false)
    }

    // JOIN RIDE LOGIC
    const handleJoin = async (planId, currentPassengers, seats) => {
        if (seats <= 0) return alert("Ride is full!")

        const { error } = await supabase
            .from('travel_plans')
            .update({
                passengers: [...currentPassengers, session.user.email],
                seats_available: seats - 1
            })
            .eq('id', planId)

        if (error) console.error(error)
    }

    // DELETE RIDE LOGIC
    const handleDeleteRide = async (planId) => {
        if (window.confirm('Are you sure you want to delete this ride?')) {
            const { error } = await supabase
                .from('travel_plans')
                .delete()
                .eq('id', planId)
            
            if (!error) {
                setPlans(plans.filter(p => p.id !== planId))
            } else {
                alert('Error deleting ride')
            }
        }
    }

    // MARK RIDE AS COMPLETED
    const handleCompleteRide = (planId) => {
        setCompletedRides(prev => new Set([...prev, planId]))
    }

    const getIcon = (mode) => {
        if (mode === 'Bus') return <Bus size={18} />
        if (mode === 'Walking') return <Footprints size={18} />
        return <Car size={18} />
    }

    const isRideCompleted = (planId) => completedRides.has(planId)

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">

            {/* --- FORM CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-3xl shadow-[0_8px_32px_rgba(59,130,246,0.1)] border border-blue-100/50 backdrop-blur-sm relative overflow-hidden group"
            >
                <motion.div
                    className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full opacity-10 blur-3xl"
                    animate={{ x: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-3">
                        <motion.div 
                            className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Car className="text-blue-600" size={24} />
                        </motion.div>
                        Post Your Trip
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <motion.input 
                                placeholder="From (e.g., Hostel 1)" 
                                className="bg-white/70 backdrop-blur p-4 rounded-2xl outline-none focus:ring-2 ring-blue-400 focus:bg-white text-black placeholder-gray-500 font-medium border border-white transition-all" 
                                value={origin} 
                                onChange={e => setOrigin(e.target.value)} 
                                whileFocus={{ scale: 1.02 }}
                                required 
                            />
                            <motion.input 
                                placeholder="To (e.g., Airport)" 
                                className="bg-white/70 backdrop-blur p-4 rounded-2xl outline-none focus:ring-2 ring-blue-400 focus:bg-white text-black placeholder-gray-500 font-medium border border-white transition-all" 
                                value={destination} 
                                onChange={e => setDestination(e.target.value)} 
                                whileFocus={{ scale: 1.02 }}
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <motion.input 
                                type="time"
                                placeholder="Time" 
                                className="bg-white/70 backdrop-blur p-4 rounded-2xl outline-none focus:ring-2 ring-blue-400 focus:bg-white text-black font-medium border border-white transition-all" 
                                value={time} 
                                onChange={e => setTime(e.target.value)} 
                                whileFocus={{ scale: 1.02 }}
                                required 
                            />
                            <motion.select 
                                className="col-span-2 bg-white/70 backdrop-blur p-4 rounded-2xl outline-none text-black font-bold border border-white focus:ring-2 ring-blue-400 focus:bg-white transition-all cursor-pointer" 
                                value={mode} 
                                onChange={e => setMode(e.target.value)}
                                whileFocus={{ scale: 1.02 }}
                            >
                                <option value="Cab">🚕 Cab</option>
                                <option value="Auto">🏍️ Auto</option>
                                <option value="Walking">🚶 Walking</option>
                            </motion.select>
                        </div>
                        <motion.button 
                            disabled={loading} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl font-bold text-lg mt-4 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 uppercase tracking-wide"
                        >
                            {loading ? '📤 Posting...' : '📤 Share Your Trip'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>

            {/* --- FEED HEADER --- */}
            <div className="px-2">
                <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-black text-white mb-4 flex items-center gap-3"
                >
                    <motion.div className="w-6 h-6 bg-green-500 rounded-full animate-pulse" />
                    Available Rides
                    <span className="text-sm font-medium text-gray-400 ml-auto">{plans.length} active</span>
                </motion.h3>
            </div>

            {/* --- FEED --- */}
            <div className="space-y-4 px-2">
                <AnimatePresence>
                    {plans.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <motion.div 
                                className="text-6xl mb-4"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                🚗
                            </motion.div>
                            <p className="text-gray-400 font-medium">No rides available yet. Be the first to post!</p>
                        </motion.div>
                    ) : (
                        plans.map((plan, idx) => {
                            const isFull = plan.seats_available === 0
                            const hasJoined = plan.passengers?.includes(session.user.email)
                            const isMyRide = plan.user_email === session.user.email
                            const matches = findMatchingOrders(plan, orders)

                            return (
                                <motion.div
                                    key={plan.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className={`rounded-3xl shadow-lg border transition-all overflow-hidden group relative ${
                                        isRideCompleted(plan.id) 
                                            ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-300' 
                                            : 'bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 hover:shadow-xl hover:shadow-blue-500/10'
                                    }`}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "100%" }}
                                        transition={{ duration: 0.8 }}
                                    />

                                    <div className="p-6 relative z-10">
                                        {/* COMPLETED BADGE */}
                                        {isRideCompleted(plan.id) && (
                                            <motion.div 
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
                                            >
                                                <CheckCircle size={16} /> Completed
                                            </motion.div>
                                        )}

                                        {/* SMART MATCHING BADGE */}
                                        {matches.length > 0 && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mb-4 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 p-4 rounded-2xl flex items-center gap-3"
                                            >
                                                <motion.div 
                                                    className="bg-orange-200 p-2 rounded-full text-orange-600 flex-shrink-0"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Flame size={20} fill="currentColor" />
                                                </motion.div>
                                                <div>
                                                    <p className="font-bold text-orange-900">🎯 Smart Match Found!</p>
                                                    <p className="text-sm text-orange-700">{matches.length} people need items to {plan.destination}</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* MAIN CONTENT */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <motion.div 
                                                    className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2"
                                                    whileHover={{ letterSpacing: "0.1em" }}
                                                >
                                                    {getIcon(plan.mode)} {plan.mode} • {plan.travel_time}
                                                </motion.div>
                                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">📍</span>
                                                    {plan.origin}
                                                    <motion.div whileHover={{ x: 5 }}>
                                                        <ArrowRight size={18} className="text-blue-400" />
                                                    </motion.div>
                                                    {plan.destination}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2 font-medium">
                                                    <Clock size={16} className="text-blue-400" /> 
                                                    Departing at {plan.travel_time}
                                                </div>
                                            </div>

                                            {/* PASSENGERS AVATARS */}
                                            <div className="flex flex-col items-end">
                                                <div className="flex -space-x-2 mb-2">
                                                    <motion.div 
                                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-sm font-bold text-white shadow-lg"
                                                        whileHover={{ scale: 1.15 }}
                                                    >
                                                        {plan.user_email[0].toUpperCase()}
                                                    </motion.div>
                                                    {plan.passengers?.slice(0, 2).map((p, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-sm font-bold text-white shadow-lg"
                                                            whileHover={{ scale: 1.15 }}
                                                        >
                                                            {p[0].toUpperCase()}
                                                        </motion.div>
                                                    ))}
                                                    {plan.passengers && plan.passengers.length > 2 && (
                                                        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700 shadow-lg">
                                                            +{plan.passengers.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                                <motion.span 
                                                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                        isFull 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-green-100 text-green-700'
                                                    }`}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {isFull ? '🚫 Full' : `✅ ${plan.seats_available} seat${plan.seats_available !== 1 ? 's' : ''} left`}
                                                </motion.span>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center gap-2 flex-wrap">
                                            <span className="text-xs text-gray-500 font-semibold">
                                                Posted by <span className="text-blue-600 font-bold">{plan.user_email.split('@')[0]}</span>
                                            </span>

                                            <div className="flex gap-2 items-center flex-wrap">
                                                {isMyRide && (
                                                    <>
                                                        {!isRideCompleted(plan.id) && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.08 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleCompleteRide(plan.id)}
                                                                className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-green-200 transition-all flex items-center gap-2"
                                                            >
                                                                ✅ Complete
                                                            </motion.button>
                                                        )}
                                                        <motion.button
                                                            whileHover={{ scale: 1.08 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleDeleteRide(plan.id)}
                                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-200 transition-all flex items-center gap-2"
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </motion.button>
                                                    </>
                                                )}

                                                {!isMyRide && !hasJoined && !isFull && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.08 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleJoin(plan.id, plan.passengers || [], plan.seats_available)}
                                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
                                                    >
                                                        🚗 Join Ride
                                                    </motion.button>
                                                )}

                                                {hasJoined && (
                                                    <motion.span 
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-green-600 font-bold text-xs flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full"
                                                    >
                                                        <Check size={16} /> Joined
                                                    </motion.span>
                                                )}

                                                {isFull && !hasJoined && (
                                                    <span className="text-gray-500 font-bold text-xs bg-gray-100 px-4 py-2 rounded-full">
                                                        🚫 Full
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}