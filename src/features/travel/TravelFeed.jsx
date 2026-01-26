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
        <div className="max-w-xl mx-auto p-4 space-y-8 pb-24">

            {/* --- FORM CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-blue-50 relative overflow-hidden"
            >
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Car className="text-blue-600" size={24} /> Post a Trip
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <input placeholder="From" className="flex-1 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 text-black placeholder-gray-500" value={origin} onChange={e => setOrigin(e.target.value)} required />
                        <input placeholder="To" className="flex-1 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 text-black placeholder-gray-500" value={destination} onChange={e => setDestination(e.target.value)} required />
                    </div>
                    <div className="flex gap-3">
                        <input placeholder="Time" className="flex-1 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 text-black placeholder-gray-500" value={time} onChange={e => setTime(e.target.value)} required />
                        <select className="bg-gray-50 p-3 rounded-xl outline-none text-black font-medium" value={mode} onChange={e => setMode(e.target.value)}>
                            <option>Cab</option><option>Auto</option><option>Walking</option>
                        </select>
                    </div>
                    <button disabled={loading} className="w-full bg-[#1a1a1a] text-white p-3.5 rounded-xl font-bold mt-2 hover:scale-[1.02] transition-transform">
                        {loading ? 'Posting...' : 'Share Plan'}
                    </button>
                </form>
            </motion.div>

            {/* --- FEED --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 px-2">Active Rides</h3>

                <AnimatePresence>
                    {plans.map((plan) => {
                        const isFull = plan.seats_available === 0
                        const hasJoined = plan.passengers?.includes(session.user.email)
                        const isMyRide = plan.user_email === session.user.email

                        // 🔥 SMART MATCHING: Find orders that match this trip's destination
                        const matches = findMatchingOrders(plan, orders)

                        return (
                            <motion.div
                                key={plan.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`bg-white p-6 rounded-3xl shadow-sm border relative group transition-all ${
                                    isRideCompleted(plan.id) ? 'border-green-200 bg-green-50' : 'border-gray-100'
                                }`}
                            >
                                {/* COMPLETED BADGE */}
                                {isRideCompleted(plan.id) && (
                                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <CheckCircle size={14} /> Completed
                                    </div>
                                )}
                                {/* --- SMART BADGE (Visible if matches exist) --- */}
                                {matches.length > 0 && (
                                    <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                                        <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                                            <Flame size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">
                                                {matches.length} people need items from {plan.destination}!
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                                            {getIcon(plan.mode)} {plan.mode}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            {plan.origin} <ArrowRight size={14} className="text-gray-300" /> {plan.destination}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                            <Clock size={14} /> {plan.travel_time}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">
                                                {plan.user_email[0].toUpperCase()}
                                            </div>
                                            {plan.passengers?.map((p, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-600">
                                                    {p[0].toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 font-medium">
                      {plan.seats_available} seats left
                    </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-400">
                    Posted by {plan.user_email.split('@')[0]}
                  </span>

                                    <div className="flex gap-2 items-center">
                                        {/* DELETE BUTTON - Only for ride creator */}
                                        {isMyRide && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDeleteRide(plan.id)}
                                                className="bg-red-50 text-red-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </motion.button>
                                        )}

                                        {/* MARK COMPLETE BUTTON - Only for ride creator */}
                                        {isMyRide && !isRideCompleted(plan.id) && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleCompleteRide(plan.id)}
                                                className="bg-green-50 text-green-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-green-100 transition-colors flex items-center gap-1"
                                            >
                                                <CheckCircle size={14} /> Complete
                                            </motion.button>
                                        )}

                                        {!isMyRide && !hasJoined && !isFull && (
                                            <button
                                                onClick={() => handleJoin(plan.id, plan.passengers || [], plan.seats_available)}
                                                className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                                            >
                                                Join Ride <Users size={14} />
                                            </button>
                                        )}

                                        {hasJoined && (
                                            <span className="text-green-600 font-bold text-sm flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                          <Check size={14} /> Joined
                        </span>
                                        )}

                                        {isFull && !hasJoined && (
                                            <span className="text-gray-400 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">
                          Full
                        </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}