import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, MapPin, Car, Bus, Footprints, ArrowRight, Users, Check, Flame, Trash2, CheckCircle } from 'lucide-react'
import { findMatchingOrders } from '../../utils/smartMatcher'

// --- 1. CAMPUS DATA (For Autocomplete) ---
const COMMON_LOCATIONS = [
    "Hostel 1", "Hostel 2", "Girls Hostel", "Main Gate",
    "Library", "Cafeteria", "Sports Complex", "Admin Block"
]

const CITY_HUBS = [
    "Airport", "Railway Station", "Bus Stand",
    "City Mall", "Downtown", "Movie Theater"
]

const ALL_LOCATIONS = [...COMMON_LOCATIONS, ...CITY_HUBS].sort()

// --- 2. AUTOCOMPLETE COMPONENT ---
function LocationInput({ label, value, onChange }) {
    const [show, setShow] = useState(false)
    const wrapperRef = useRef(null)

    const filtered = ALL_LOCATIONS.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
    )

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShow(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapperRef])

    return (
        <div className="relative flex-1 group" ref={wrapperRef}>
            <MapPin className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
                placeholder={label}
                className="w-full bg-gray-50 text-black placeholder:text-gray-400 pl-10 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 border border-gray-100 transition-all"
                value={value}
                onChange={e => { onChange(e.target.value); setShow(true) }}
                onFocus={() => setShow(true)}
                required
            />

            <AnimatePresence>
                {show && value && filtered.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute z-50 w-full bg-white mt-2 rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto"
                    >
                        {filtered.map((item) => (
                            <li
                                key={item}
                                onClick={() => { onChange(item); setShow(false) }}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700 border-b border-gray-50 last:border-0"
                            >
                                {item}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- 3. MAIN COMPONENT ---
export default function TravelFeed({ session }) {
    const [plans, setPlans] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    // Form State
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [mode, setMode] = useState('Cab')

    const fetchData = async () => {
        // Fetch all trips
        const { data: travelData } = await supabase
            .from('travel_plans')
            .select('*')
            .neq('status', 'Completed') // Don't show completed
            .order('travel_time', { ascending: true }) // Show soonest first

        if (travelData) {
            // CLIENT-SIDE FILTER: Hide trips that are in the past
            const now = new Date()
            const activeTrips = travelData.filter(trip => {
                const tripDate = new Date(trip.travel_time)
                return tripDate > now // Only keep future trips
            })
            setPlans(activeTrips)
        }

        const { data: orderData } = await supabase.from('orders').select('*').eq('status', 'Open')
        if (orderData) setOrders(orderData)
    }

    useEffect(() => {
        fetchData()
        // Refresh every minute to auto-remove expired trips without reloading
        const interval = setInterval(fetchData, 60000)

        const travelSub = supabase.channel('travel_realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'travel_plans' }, fetchData).subscribe()
        return () => { travelSub.unsubscribe(); clearInterval(interval) }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Create a proper ISO Date String so we can sort/filter it
        const isoDateTime = new Date(`${date}T${time}`).toISOString()

        const { error } = await supabase.from('travel_plans').insert([{
            user_email: session.user.email,
            origin,
            destination,
            travel_time: isoDateTime, // Saving as machine-readable time
            mode,
            passengers: [],
            seats_available: mode === 'Cab' ? 3 : 2,
            status: 'Open'
        }])

        if (!error) {
            setOrigin(''); setDestination(''); setDate(''); setTime('')
            alert("Trip Posted Successfully! 🚗")
            fetchData()
        } else {
            alert(error.message)
        }
        setLoading(false)
    }

    const handleJoin = async (planId, currentPassengers, seats) => {
        if (seats <= 0) return alert("Ride is full!")
        await supabase.from('travel_plans').update({
            passengers: [...currentPassengers, session.user.email], seats_available: seats - 1
        }).eq('id', planId)
    }

    // --- NEW: COMPLETE TRIP FUNCTION ---
    const handleComplete = async (planId) => {
        if(!confirm("Mark this trip as completed? It will move to history.")) return;

        await supabase.from('travel_plans')
            .update({ status: 'Completed' }) // Soft delete (moves to history)
            .eq('id', planId)

        fetchData() // Refresh list
    }

    const handleDelete = async (planId) => {
        if(!confirm("Delete this trip permanently?")) return;

        const { error } = await supabase.from('travel_plans').delete().eq('id', planId)

        if (error) {
            alert("Delete failed: " + error.message)
        } else {
            alert("Trip deleted successfully")
            fetchData()
        }
    }

    const getIcon = (mode) => {
        if (mode === 'Bus') return <Bus size={18} />
        if (mode === 'Walking') return <Footprints size={18} />
        return <Car size={18} />
    }

    // Helper to make the ISO date look nice
    const formatDisplayTime = (isoString) => {
        const d = new Date(isoString)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            ' at ' +
            d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="max-w-xl mx-auto space-y-8 pb-24">

            {/* --- FORM CARD --- */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-blue-50 relative overflow-visible z-20">
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Car size={20} /></div>
                    Post Your Trip
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-3 z-30">
                        <LocationInput label="From (e.g. Hostel 1)" value={origin} onChange={setOrigin} />
                        <div className="hidden md:flex items-center text-gray-300"><ArrowRight size={20}/></div>
                        <LocationInput label="To (e.g. Airport)" value={destination} onChange={setDestination} />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 relative group min-w-[140px]">
                            <Calendar className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                            <input type="date" className="w-full bg-gray-50 text-black pl-10 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 border border-gray-100" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div className="flex-1 relative group min-w-[120px]">
                            <Clock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                            <input type="time" className="w-full bg-gray-50 text-black pl-10 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 border border-gray-100" value={time} onChange={e => setTime(e.target.value)} required />
                        </div>
                        <div className="relative min-w-[100px]">
                            <select className="w-full h-full bg-gray-50 text-black p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 border border-gray-100 font-medium cursor-pointer" value={mode} onChange={e => setMode(e.target.value)}>
                                <option>Cab</option><option>Auto</option><option>Walking</option><option>Bus</option>
                            </select>
                        </div>
                    </div>
                    <button disabled={loading} className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold mt-2 hover:scale-[1.02] transition-transform shadow-lg shadow-gray-200">
                        {loading ? 'Publishing Trip...' : 'Share Trip 🚀'}
                    </button>
                </form>
            </motion.div>

            {/* --- FEED --- */}
            <div className="space-y-4">
                {plans.length === 0 && !loading && (
                    <div className="text-center py-10 opacity-50">
                        <div className="text-4xl mb-2">🚗</div>
                        <p className="font-bold text-gray-500">No active rides</p>
                    </div>
                )}

                <AnimatePresence>
                    {plans.map((plan) => {
                        const isFull = plan.seats_available === 0
                        const hasJoined = plan.passengers?.includes(session.user.email)
                        const isMyRide = plan.user_email === session.user.email
                        const matches = findMatchingOrders(plan, orders)

                        // Format time safely
                        let displayTime = plan.travel_time
                        if (plan.travel_time.includes('T')) {
                            displayTime = formatDisplayTime(plan.travel_time)
                        }

                        return (
                            <motion.div key={plan.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
                                {matches.length > 0 && (
                                    <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                                        <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Flame size={18} fill="currentColor" /></div>
                                        <p className="text-sm font-bold text-gray-800">{matches.length} people need items from here!</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">{getIcon(plan.mode)} {plan.mode}</div>
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">{plan.origin} <ArrowRight size={14} className="text-gray-300" /> {plan.destination}</h3>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 font-medium bg-gray-50 px-2 py-1 rounded-md inline-flex">
                                            <Clock size={14} /> {displayTime}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">{plan.user_email[0].toUpperCase()}</div>
                                            {plan.passengers?.map((p, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-600 shadow-sm">{p[0].toUpperCase()}</div>
                                            ))}
                                        </div>
                                        <span className={`text-xs mt-1 font-bold ${plan.seats_available > 1 ? 'text-green-600' : 'text-orange-500'}`}>
                      {plan.seats_available} seats left
                    </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Posted by {plan.user_email.split('@')[0]}</span>

                                    {/* BUTTONS LOGIC */}
                                    {!isMyRide && !hasJoined && !isFull && (
                                        <button onClick={() => handleJoin(plan.id, plan.passengers || [], plan.seats_available)} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg shadow-gray-200">
                                            Join Ride <Users size={14} />
                                        </button>
                                    )}
                                    {hasJoined && <span className="text-green-600 font-bold text-sm flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full border border-green-100"><Check size={14} /> Joined</span>}

                                    {/* CREATOR BUTTONS */}
                                    {isMyRide && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleComplete(plan.id)}
                                                className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors"
                                                title="Mark as Complete"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
                                                title="Delete Trip"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}