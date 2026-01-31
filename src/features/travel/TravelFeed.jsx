import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, MapPin, ArrowRight, Trash2, TrendingUp, Zap, Map as MapIcon, List } from 'lucide-react'
import { toast } from 'sonner'

// --- 1. MOCK DATA FOR "ALIVE" FEEL ---
const TRENDING_LOCATIONS = [
    { name: 'Airport Terminal 2', count: 12, top: '30%', left: '60%' },
    { name: 'City Center Mall', count: 8, top: '50%', left: '45%' },
    { name: 'Railway Station', count: 5, top: '70%', left: '55%' },
]

// --- 2. COMPONENTS ---

// New: Live Map Visualization (Pure CSS/React - No API Key needed)
function LiveMap({ activeRides }) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative h-[600px] w-full group">
            {/* Map Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-[3s]"
                style={{
                    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
                    backgroundSize: 'cover',
                    filter: 'grayscale(100%) opacity(0.3)'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

            {/* Floating Status Header */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
             </span>
                        Live Activity
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{activeRides} active commuters on campus</p>
                </div>
            </div>

            {/* Pulsing "Live User" Markers */}
            {TRENDING_LOCATIONS.map((loc, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker"
                    style={{ top: loc.top, left: loc.left }}
                >
                    <div className="relative">
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover/marker:opacity-100 transition-opacity" />
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10 animate-bounce" style={{ animationDuration: `${2 + i}s` }} />
                        <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-20" />
                    </div>

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none transform translate-y-2 group-hover/marker:translate-y-0">
                        {loc.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

function LocationInput({ label, value, onChange }) {
    const [show, setShow] = useState(false)
    const wrapperRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShow(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapperRef])

    const suggestions = ["Hostel 1", "Hostel 2", "Library", "Main Gate", "Cafeteria", "Airport", "Railway Station", "City Mall"]

    return (
        <div className="relative flex-1 group" ref={wrapperRef}>
            <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <MapPin size={20} />
            </div>
            <input
                placeholder={label}
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 pl-12 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-500 transition-all font-medium"
                value={value}
                onChange={e => { onChange(e.target.value); setShow(true) }}
                onFocus={() => setShow(true)}
            />
            {show && value && (
                <div className="absolute z-50 w-full bg-white mt-2 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {suggestions.filter(i => i.toLowerCase().includes(value.toLowerCase())).map(item => (
                        <div key={item} onClick={() => { onChange(item); setShow(false) }} className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-sm font-medium text-gray-600 transition-colors border-b border-gray-50 last:border-0">
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// --- 3. MAIN PAGE LAYOUT ---
export default function TravelFeed({ session }) {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState('map') // Default to 'map' so it looks populated immediately
    const [form, setForm] = useState({ origin: '', dest: '', date: '', time: '', mode: 'Cab' })

    const fetchData = async () => {
        const { data } = await supabase.from('travel_plans').select('*').neq('status', 'Completed').order('travel_time', { ascending: true })
        if (data) setPlans(data)
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('travel_plans').insert([{
            user_email: session.user.email, origin: form.origin, destination: form.dest,
            travel_time: new Date(`${form.date}T${form.time}`).toISOString(),
            mode: form.mode, passengers: [], seats_available: 3, status: 'Open'
        }])
        if (!error) {
            setForm({ origin: '', dest: '', date: '', time: '', mode: 'Cab' })
            toast.success("Trip posted successfully!")
            fetchData()
        }
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if(!confirm("Delete trip?")) return;
        await supabase.from('travel_plans').delete().eq('id', id)
        fetchData()
        toast.success("Trip deleted")
    }

    return (
        <div className="max-w-7xl mx-auto pb-24">

            {/* --- 1. WELCOME BANNER (Fills the "Lonely" Top Space) --- */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#111] to-[#222] rounded-[2rem] p-8 md:p-10 mb-10 text-white shadow-xl relative overflow-hidden"
            >
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Hello, {session.user.email.split('@')[0]}! 👋</h1>
                        <p className="text-gray-400 text-lg font-medium">Find your travel buddy for today.</p>
                    </div>

                    {/* Gamification Stats */}
                    <div className="flex gap-4">
                        <div className="text-center px-6 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                            <div className="text-2xl font-black">₹1.2k</div>
                            <div className="text-xs text-gray-400 font-bold uppercase">Saved</div>
                        </div>
                        <div className="text-center px-6 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                            <div className="text-2xl font-black">12</div>
                            <div className="text-xs text-gray-400 font-bold uppercase">Rides</div>
                        </div>
                    </div>
                </div>

                {/* Abstract Art Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </motion.div>

            {/* --- 2. SMART GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: Fixed Sticky Wrapper (Fixes the Overlap Bug) */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-24 space-y-6">

                        {/* Post Trip Form */}
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg shadow-gray-300">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Post a Trip</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <LocationInput label="From (e.g. Hostel)" value={form.origin} onChange={v => setForm({...form, origin: v})} />
                                <LocationInput label="To (e.g. Airport)" value={form.dest} onChange={v => setForm({...form, dest: v})} />

                                <div className="flex gap-3">
                                    <input type="date" className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-600" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                                    <input type="time" className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-600" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
                                </div>

                                <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl active:scale-95 disabled:opacity-50 mt-2">
                                    {loading ? 'Posting...' : 'Share Ride 🚀'}
                                </button>
                            </form>
                        </motion.div>

                        {/* Trending Section (Now correctly contained so it won't overlap) */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hidden lg:block">
                            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold px-2">
                                <TrendingUp size={20} className="text-blue-600"/> Trending Now
                            </div>
                            <div className="space-y-2">
                                {TRENDING_LOCATIONS.map((loc, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-400 font-bold text-sm w-4">#{i+1}</div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">{loc.name}</span>
                                        </div>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">{loc.count} going</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: FEED or MAP */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Toggle Header */}
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">Active Rides</h3>
                            <p className="text-gray-400 text-sm font-medium">{plans.length} trips available today</p>
                        </div>

                        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                                <List size={20} />
                            </button>
                            <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                                <MapIcon size={20} />
                            </button>
                        </div>
                    </div>

                    {/* --- 3. DYNAMIC CONTENT AREA --- */}
                    {viewMode === 'map' ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <LiveMap activeRides={plans.length} />
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {plans.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-200 p-16 text-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MapPin size={40} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No rides yet</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto">It's quiet today. Be the first to post a trip and break the ice!</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {plans.map((plan) => {
                                        const isMine = plan.user_email === session.user.email
                                        const dateObj = new Date(plan.travel_time)

                                        return (
                                            <motion.div key={plan.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-default relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-[4rem] -mr-4 -mt-4 transition-opacity opacity-0 group-hover:opacity-100"></div>

                                                <div className="flex justify-between items-start mb-6 relative z-10">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-3 text-lg md:text-xl font-bold text-gray-900">
                                                            {plan.origin} <ArrowRight className="text-gray-300" size={20}/> {plan.destination}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-500 font-medium mt-2 text-sm bg-gray-50 w-fit px-3 py-1 rounded-lg">
                                                            <Calendar size={14} className="text-black"/> {dateObj.toLocaleDateString('en-US', {month:'short', day:'numeric'})}
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <Clock size={14} className="text-black"/> {dateObj.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}
                                                        </div>
                                                    </div>

                                                    <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${plan.seats_available > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                        {plan.seats_available} seats
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-white shadow-sm">
                                                            {plan.user_email[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Host</p>
                                                            <span className="text-sm font-bold text-gray-900">{plan.user_email.split('@')[0]}</span>
                                                        </div>
                                                    </div>

                                                    {isMine ? (
                                                        <button onClick={() => handleDelete(plan.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors"><Trash2 size={18}/></button>
                                                    ) : (
                                                        <button className="bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                                                            Join Ride
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}