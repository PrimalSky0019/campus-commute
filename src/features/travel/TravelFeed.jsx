import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, MapPin, ArrowRight, Trash2, TrendingUp, DollarSign, Leaf, Zap } from 'lucide-react'

// --- MOCK DATA FOR "ALIVE" FEEL ---
const TRENDING_LOCATIONS = [
  { name: 'Airport Terminal 2', count: 12 },
  { name: 'City Center Mall', count: 8 },
  { name: 'Railway Station', count: 5 },
]

// --- COMPONENTS ---
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

function StatCard({ icon, label, value, color }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    )
}

export default function TravelFeed({ session }) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
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
      alert("Trip posted successfully!")
      fetchData()
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if(!confirm("Delete trip?")) return;
    await supabase.from('travel_plans').delete().eq('id', id)
    fetchData()
    alert("Trip deleted")
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      
      {/* --- WELCOME BANNER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 md:p-10 mb-10 text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Hello, {session.user.email.split('@')[0]}! 👋</h1>
            <p className="text-blue-100 text-lg">Ready to save money on your next commute?</p>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      </motion.div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
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

                    <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-2">
                        {loading ? 'Posting...' : 'Share Ride 🚀'}
                    </button>
                </form>
            </motion.div>

            {/* Trending Section (Mock Data to fill space) */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hidden lg:block">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                    <TrendingUp size={20} className="text-green-500"/> Trending Destinations
                </div>
                <div className="space-y-3">
                    {TRENDING_LOCATIONS.map((loc, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-default">
                            <span className="text-sm font-medium text-gray-600">{loc.name}</span>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">{loc.count} riders</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: STATS & FEED (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon={<DollarSign size={24}/>} label="Money Saved" value="₹1,200" color="bg-green-100 text-green-600" />
                <StatCard icon={<Leaf size={24}/>} label="CO2 Saved" value="45 kg" color="bg-emerald-100 text-emerald-600" />
                <StatCard icon={<Calendar size={24}/>} label="Rides Taken" value="12" color="bg-purple-100 text-purple-600" />
            </div>

            {/* Feed Header */}
            <div className="flex justify-between items-end px-2">
                <h3 className="text-xl font-bold text-gray-900">Active Rides</h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{plans.length} available</span>
            </div>

            {/* The Feed */}
            <div className="space-y-4">
                {plans.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-dashed border-gray-300 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No active rides yet</h3>
                        <p className="text-gray-500">Be the first to post a trip today!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {plans.map((plan) => {
                            const isMine = plan.user_email === session.user.email
                            const dateObj = new Date(plan.travel_time)

                            return (
                            <motion.div key={plan.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-default relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3 text-lg md:text-xl font-bold text-gray-900">
                                            {plan.origin} <ArrowRight className="text-gray-300" size={20}/> {plan.destination}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 font-medium mt-1 text-sm">
                                            <Calendar size={14} className="text-blue-500"/> {dateObj.toLocaleDateString('en-US', {month:'short', day:'numeric'})}
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <Clock size={14} className="text-blue-500"/> {dateObj.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                    
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${plan.seats_available > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {plan.seats_available} seats
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                            {plan.user_email[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">{plan.user_email.split('@')[0]}</span>
                                    </div>

                                    {isMine ? (
                                        <button onClick={() => handleDelete(plan.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={18}/></button>
                                    ) : (
                                        <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
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
        </div>
      </div>
    </div>
  )
}