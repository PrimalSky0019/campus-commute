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
        <div className="max-w-xl mx-auto space-y-8 pb-24">

            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-50 relative overflow-visible z-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                    <ShoppingBag className="text-green-600" /> Request Delivery
                </h2>

                <form onSubmit={handlePost} className="flex flex-col gap-4">

                    <div className="flex flex-col md:flex-row gap-3">
                        <Autocomplete
                            label="Store (e.g. Canteen)"
                            suggestions={CAMPUS_STORES}
                            value={store}
                            onChange={setStore}
                            icon={Store}
                        />
                        <Autocomplete
                            label="Deliver to (e.g. Hostel)"
                            suggestions={CAMPUS_LOCATIONS}
                            value={location}
                            onChange={setLocation}
                            icon={MapPin}
                        />
                    </div>

                    <div className="relative group">
                        <ShoppingBag className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                        <input
                            placeholder="What do you need? (e.g. 2 Cold Coffees)"
                            // FIX: Added 'text-black' here too
                            className="w-full bg-gray-50 text-black border border-gray-100 pl-10 p-3 rounded-xl focus:ring-2 ring-green-500 focus:bg-white outline-none transition-all font-medium placeholder:text-gray-400"
                            value={items}
                            onChange={e => setItems(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-gray-200">
                        {loading ? 'Posting...' : 'Post Request'}
                    </button>
                </form>
            </motion.div>

            <div className="space-y-4">
                {orders.length === 0 && !loading && (
                    <div className="text-center py-10 opacity-50">
                        <div className="text-4xl mb-2">🍔</div>
                        <p className="font-bold text-gray-500">No active orders</p>
                    </div>
                )}

                <AnimatePresence>
                    {orders.map(order => {
                        const isMine = order.user_email === session.user.email
                        const isAcceptedByMe = order.accepted_by === session.user.email
                        const isOpen = order.status === 'Open'

                        return (
                            <motion.div
                                key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className={`p-6 rounded-3xl border relative group hover:shadow-md transition-shadow ${isOpen ? 'bg-white border-gray-100' : 'bg-green-50 border-green-100'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isOpen ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                       {order.status}
                     </span>
                                        <h3 className="text-lg font-bold mt-2 text-gray-800">{order.item_name}</h3>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 font-medium">
                                            <Store size={14} className="text-green-600" /> {order.platform}
                                            <span className="text-gray-300">|</span>
                                            <MapPin size={14} className="text-red-500" /> {order.location}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs shadow-inner">
                                        {order.user_email[0].toUpperCase()}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    {isOpen && !isMine && (
                                        <button onClick={() => handleAccept(order.id)} className="bg-green-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-700 flex items-center gap-2 shadow-sm">
                                            Accept <Truck size={16} />
                                        </button>
                                    )}
                                    {isAcceptedByMe && order.status === 'In Progress' && (
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="text-green-700 font-bold text-sm flex-1">You are delivering!</span>
                                            <button onClick={() => handleComplete(order.id)} className="bg-gray-900 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
                                                Done <CheckCircle size={14} />
                                            </button>
                                        </div>
                                    )}
                                    {isMine && isOpen && <span className="text-gray-400 text-sm font-medium italic">Waiting for a runner...</span>}
                                    {isMine && order.status === 'In Progress' && (
                                        <span className="text-blue-600 font-bold text-sm flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                       <User size={14} /> {order.accepted_by.split('@')[0]} is on it!
                     </span>
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