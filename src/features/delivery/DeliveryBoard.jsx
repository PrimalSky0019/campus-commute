import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin, CheckCircle, Truck, User, Store } from 'lucide-react'

// --- 1. DATA: THE CAMPUS DATABASE ---
const CAMPUS_LOCATIONS = [
    "Hostel 1", "Hostel 2", "Hostel 3", "Girls Hostel",
    "Main Building", "Library", "Computer Center",
    "Sports Complex", "Main Gate", "Faculty Quarters"
]

const CAMPUS_STORES = [
    "Night Canteen", "Main Canteen", "Amul Parlour",
    "Nescafe Kiosk", "Campus Grocery", "Stationery Shop",
    "Zomato Delivery Point", "Swiggy Point"
]

// --- 2. REUSABLE AUTOCOMPLETE COMPONENT ---
function Autocomplete({ label, suggestions, value, onChange, icon: Icon }) {
    const [show, setShow] = useState(false)
    const wrapperRef = useRef(null)

    const filtered = suggestions.filter(item =>
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
        <div className="relative flex-1" ref={wrapperRef}>
            <div className="relative group">
                {Icon && <Icon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />}
                <input
                    placeholder={label}
                    // FIX: Added 'text-black' here
                    className="w-full bg-gray-50 text-black border border-gray-100 pl-10 p-3 rounded-xl focus:ring-2 ring-green-500 focus:bg-white outline-none transition-all font-medium placeholder:text-gray-400"
                    value={value}
                    onChange={e => { onChange(e.target.value); setShow(true) }}
                    onFocus={() => setShow(true)}
                    required
                />
            </div>

            <AnimatePresence>
                {show && value && filtered.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute z-50 w-full bg-white mt-2 rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto text-black"
                    >
                        {filtered.map((item) => (
                            <li
                                key={item}
                                onClick={() => { onChange(item); setShow(false) }}
                                className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm font-medium text-gray-700 border-b border-gray-50 last:border-0"
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
export default function DeliveryBoard({ session }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    const [store, setStore] = useState('')
    const [location, setLocation] = useState('')
    const [items, setItems] = useState('')

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*')
            .neq('status', 'Completed')
            .order('created_at', { ascending: false })
        if (data) setOrders(data)
    }

    useEffect(() => {
        fetchOrders()
        const sub = supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders).subscribe()
        return () => sub.unsubscribe()
    }, [])

    const handlePost = async (e) => {
        e.preventDefault()
        setLoading(true)
        await supabase.from('orders').insert([{
            user_email: session.user.email,
            platform: store,
            location,
            item_name: items,
            status: 'Open'
        }])
        setItems(''); setStore(''); setLocation(''); fetchOrders(); setLoading(false)
    }

    const handleAccept = async (id) => {
        await supabase.from('orders').update({ status: 'In Progress', accepted_by: session.user.email }).eq('id', id)
    }

    const handleComplete = async (id) => {
        await supabase.from('orders').update({ status: 'Completed' }).eq('id', id)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">

            {/* --- FORM CARD --- */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-br from-white to-green-50/30 p-8 rounded-3xl shadow-[0_8px_32px_rgba(34,197,94,0.1)] border border-green-100/50 backdrop-blur-sm relative overflow-hidden group"
            >
                <motion.div
                    className="absolute top-0 right-0 w-40 h-40 bg-green-200 rounded-full opacity-10 blur-3xl"
                    animate={{ x: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900">
                        <motion.div 
                            className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <ShoppingBag className="text-green-600" size={24} />
                        </motion.div>
                        Request Delivery or Pool Orders
                    </h2>

                    <form onSubmit={handlePost} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Autocomplete
                                label="📍 Store (e.g. Canteen, Zomato)"
                                suggestions={CAMPUS_STORES}
                                value={store}
                                onChange={setStore}
                                icon={Store}
                            />
                            <Autocomplete
                                label="🏠 Deliver to (e.g. Hostel 1)"
                                suggestions={CAMPUS_LOCATIONS}
                                value={location}
                                onChange={setLocation}
                                icon={MapPin}
                            />
                        </div>

                        <motion.div className="relative group" whileFocus={{ scale: 1.02 }}>
                            <ShoppingBag className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                            <input
                                placeholder="What do you need? (e.g. 2 Cold Coffees, Pizza from Zomato)"
                                className="w-full bg-white/70 backdrop-blur text-black border border-white pl-12 p-4 rounded-2xl focus:ring-2 ring-green-400 focus:bg-white outline-none transition-all font-medium placeholder:text-gray-500"
                                value={items}
                                onChange={e => setItems(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.button 
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-bold text-lg mt-4 hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 uppercase tracking-wide"
                        >
                            {loading ? '📤 Posting...' : '📤 Post Your Request'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>

            {/* --- ORDERS HEADER --- */}
            <div className="px-2">
                <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-black text-white mb-4 flex items-center gap-3"
                >
                    <motion.div className="w-6 h-6 bg-green-500 rounded-full animate-pulse" />
                    Active Orders
                    <span className="text-sm font-medium text-gray-400 ml-auto">{orders.length} open</span>
                </motion.h3>
            </div>

            {/* --- ORDERS LIST --- */}
            <div className="space-y-4 px-2">
                {orders.length === 0 && !loading && (
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
                            🍔
                        </motion.div>
                        <p className="text-gray-400 font-medium">No active orders. Be the first to pool!</p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {orders.map((order, idx) => {
                        const isMine = order.user_email === session.user.email
                        const isAcceptedByMe = order.accepted_by === session.user.email
                        const isOpen = order.status === 'Open'

                        return (
                            <motion.div
                                key={order.id} 
                                layout 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -4 }}
                                className={`p-6 rounded-3xl border transition-all relative group overflow-hidden ${
                                    isOpen 
                                        ? 'bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 hover:shadow-lg hover:shadow-green-500/10' 
                                        : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-300'
                                }`}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex-1">
                                        <motion.span 
                                            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                                                isOpen 
                                                    ? 'bg-orange-100 text-orange-700 border-orange-300' 
                                                    : isAcceptedByMe
                                                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                    : 'bg-green-100 text-green-700 border-green-300'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {order.status}
                                        </motion.span>
                                        
                                        <motion.h3 
                                            className="text-xl font-black text-gray-900 mt-3"
                                            whileHover={{ letterSpacing: "0.05em" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {order.item_name}
                                        </motion.h3>
                                        
                                        <div className="flex items-center gap-4 text-gray-600 text-sm mt-3 font-semibold flex-wrap">
                                            <div className="flex items-center gap-2 bg-green-100/50 px-3 py-1 rounded-full">
                                                <Store size={16} className="text-green-600" /> {order.platform}
                                            </div>
                                            <div className="flex items-center gap-2 bg-red-100/50 px-3 py-1 rounded-full">
                                                <MapPin size={16} className="text-red-600" /> {order.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* USER AVATAR */}
                                    <motion.div 
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white shadow-lg ml-4 flex-shrink-0"
                                        whileHover={{ scale: 1.15 }}
                                    >
                                        {order.user_email[0].toUpperCase()}
                                    </motion.div>
                                </div>

                                {/* ACTION SECTION */}
                                <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center gap-3 flex-wrap relative z-10">
                                    <span className="text-xs text-gray-500 font-semibold">
                                        Posted by <span className="text-green-600 font-bold">{order.user_email.split('@')[0]}</span>
                                    </span>

                                    <div className="flex gap-2 flex-wrap">
                                        {isOpen && !isMine && (
                                            <motion.button 
                                                onClick={() => handleAccept(order.id)}
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2"
                                            >
                                                🏃 Accept Order
                                            </motion.button>
                                        )}

                                        {isAcceptedByMe && order.status === 'In Progress' && (
                                            <motion.button 
                                                onClick={() => handleComplete(order.id)}
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2"
                                            >
                                                ✅ Completed
                                            </motion.button>
                                        )}

                                        {isAcceptedByMe && order.status === 'In Progress' && (
                                            <span className="text-green-700 font-bold text-sm bg-green-100 px-4 py-2 rounded-full">
                                                🚚 You're delivering!
                                            </span>
                                        )}

                                        {isMine && isOpen && (
                                            <span className="text-gray-500 text-sm font-medium italic px-3 py-2">
                                                ⏳ Waiting for a runner...
                                            </span>
                                        )}

                                        {isMine && order.status === 'In Progress' && (
                                            <motion.span 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-blue-600 font-bold text-sm flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full"
                                            >
                                                👤 {order.accepted_by.split('@')[0]} is delivering!
                                            </motion.span>
                                        )}

                                        {order.status === 'Completed' && (
                                            <motion.span 
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="text-green-700 font-bold text-sm flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full"
                                            >
                                                ✅ Done!
                                            </motion.span>
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