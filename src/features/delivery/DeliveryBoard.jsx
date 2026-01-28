import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin, Truck, CheckCircle, Search, Star, Utensils, Coffee, Pizza } from 'lucide-react'
import SkeletonCard from '../../components/SkeletonCard'

// --- THEME CONSTANTS (BUNBITE STYLE) ---
const THEME = {
  green: "bg-[#2C5F46]", // Deep Forest Green
  yellow: "text-[#F4C458]", // Mustard Yellow
  yellowBg: "bg-[#F4C458]",
  cream: "bg-[#FDF8F0]",
  fontDisplay: "font-['Lilita_One',_sans-serif]", // Chunky Font
}

// --- DATA ---
const CATEGORIES = [
  { name: "All", icon: <Utensils size={18} /> },
  { name: "Canteen", icon: <Pizza size={18} /> },
  { name: "Coffee", icon: <Coffee size={18} /> },
  { name: "Grocery", icon: <ShoppingBag size={18} /> },
]

const CAMPUS_LOCATIONS = [
  "Hostel 1", "Hostel 2", "Hostel 3", "Girls Hostel",
  "Main Building", "Library", "Computer Center",
  "Sports Complex", "Main Gate", "Faculty Quarters",
  "Food Street", "Cafeteria", "Auditorium"
]

export default function DeliveryBoard({ session }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("All")
  
  // Form State
  const [item, setItem] = useState('')
  const [location, setLocation] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Fetch Logic
  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').neq('status', 'Completed').order('created_at', { ascending: false })
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
      user_email: session.user.email, platform: 'Campus', location, item_name: item, status: 'Open' 
    }])
    setItem(''); setLocation(''); setIsFormOpen(false); fetchOrders(); setLoading(false)
  }

  const handleAccept = async (id) => {
    await supabase.from('orders').update({ status: 'In Progress', accepted_by: session.user.email }).eq('id', id)
  }

  // Filter Orders
  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.item_name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className={`min-h-screen ${THEME.cream} pb-20 font-sans`}>
      
      {/* --- HERO SECTION (Green Background) --- */}
      <div className={`${THEME.green} relative overflow-hidden pt-24 pb-32 px-6 text-center`}>
        {/* Floating Background Icons (Decoration) */}
        <Pizza className="absolute top-20 left-10 text-white/10 rotate-12" size={122} />
        <Coffee className="absolute bottom-10 right-10 text-white/10 -rotate-12" size={100} />

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
          <h2 className={`${THEME.fontDisplay} text-xl md:text-2xl ${THEME.yellow} tracking-widest uppercase mb-2`}>
            Fast & Fresh
          </h2>
          <h1 className={`${THEME.fontDisplay} text-6xl md:text-8xl text-white mb-6 uppercase leading-[0.9] drop-shadow-xl`}>
            Campus<br/>Cravings
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 font-medium">
            Craving something? Request a delivery from peers or earn money by bringing food to others!
          </p>

          <motion.button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`${THEME.yellowBg} text-[#2C5F46] px-10 py-4 rounded-full font-black text-xl hover:shadow-lg active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-4 border-white`}
          >
            {isFormOpen ? 'Close Menu' : 'ORDER NOW 🍔'}
          </motion.button>
        </motion.div>
      </div>

      {/* --- REQUEST FORM (Slides Down) --- */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#26503c] px-6 overflow-hidden"
          >
            <form onSubmit={handlePost} className="max-w-xl mx-auto py-8 space-y-4">
              <motion.input 
                placeholder="What do you want? (e.g. Burger King)" 
                className="w-full bg-[#1e4030] text-white placeholder:text-white/50 p-4 rounded-xl font-bold border-2 border-[#3a7558] focus:border-[#F4C458] outline-none transition-all"
                value={item} 
                onChange={e => setItem(e.target.value)} 
                whileFocus={{ scale: 1.02 }}
                required
              />
              
              <motion.select
                className="w-full bg-[#1e4030] text-white p-4 rounded-xl font-bold border-2 border-[#3a7558] focus:border-[#F4C458] outline-none transition-all cursor-pointer"
                value={location}
                onChange={e => setLocation(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                required
              >
                <option value="">Select your location...</option>
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </motion.select>

              <motion.button 
                disabled={loading} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-[#2C5F46] py-4 rounded-xl font-black text-lg hover:bg-gray-100 disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'PLACE REQUEST'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MENU FILTERS (Wave Divider) --- */}
      <div className="bg-[#2C5F46] rounded-b-[3rem] pb-10 px-6">
        <div className="flex justify-center gap-4 flex-wrap max-w-3xl mx-auto">
          {CATEGORIES.map(cat => (
            <motion.button 
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${filter === cat.name ? 'bg-[#F4C458] text-[#2C5F46] shadow-lg scale-105' : 'bg-[#3a7558] text-white hover:bg-[#468c69]'}`}
            >
              {cat.icon} {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* --- FOOD CARDS GRID --- */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {loading && filteredOrders.length === 0 ? (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="col-span-full text-center py-20 opacity-40"
             >
               <motion.div
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="mb-4"
               >
                 <Pizza size={64} className="mx-auto text-[#2C5F46]" />
               </motion.div>
               <h3 className="text-2xl font-black text-[#2C5F46]">No Orders Yet</h3>
               <p className="text-[#2C5F46]/60 mt-2">Be the first to request a delivery!</p>
             </motion.div>
          ) : (
            <>
              {filteredOrders.map((order, idx) => {
            const isMine = order.user_email === session.user.email
            const isOpen = order.status === 'Open'
            
            return (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(44, 95, 70, 0.2)" }}
                className="bg-white p-6 rounded-[2rem] shadow-xl border-b-8 border-r-8 border-[#2C5F46] transition-transform relative overflow-hidden group"
              >
                {/* Decorative Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#F4C458]/0 to-[#2C5F46]/0 group-hover:from-[#F4C458]/5 group-hover:to-[#2C5F46]/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                {/* Badge */}
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-0 left-0 bg-[#F4C458] text-[#2C5F46] px-4 py-1.5 rounded-br-2xl font-black text-xs uppercase tracking-wider z-10"
                >
                  {isOpen ? '🕐 WAITING' : '🚚 ON THE WAY'}
                </motion.div>

                {/* Content */}
                <div className="mt-6 text-center relative z-10">
                   {/* Food Icon */}
                   <motion.div 
                     className="w-32 h-32 mx-auto bg-[#FDF8F0] rounded-full flex items-center justify-center mb-4 text-[#2C5F46] border-4 border-[#2C5F46]"
                     whileHover={{ rotate: 360, scale: 1.1 }}
                     transition={{ duration: 0.6 }}
                   >
                      {order.item_name.toLowerCase().includes('coffee') ? <Coffee size={64} /> : <Pizza size={64} />}
                   </motion.div>

                   <motion.h3 
                     className={`${THEME.fontDisplay} text-2xl text-[#2C5F46] uppercase mb-3 line-clamp-1`}
                     whileHover={{ letterSpacing: "0.05em" }}
                     transition={{ duration: 0.3 }}
                   >
                     {order.item_name}
                   </motion.h3>

                   {/* Star Rating */}
                   <div className="flex justify-center items-center gap-1 text-yellow-500 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ scale: [1, 1.2, 1] }}
                         transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                       >
                         <Star size={16} fill="currentColor" />
                       </motion.div>
                     ))}
                   </div>

                   {/* Location & Requester */}
                   <motion.div 
                     className="bg-[#FDF8F0] p-4 rounded-xl mb-6 text-left border-2 border-[#2C5F46]"
                     whileHover={{ scale: 1.02 }}
                   >
                      <div className="flex items-center gap-2 text-[#2C5F46] font-bold text-sm mb-2">
                        <MapPin size={16} /> {order.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                        📌 Requested by: <span className="text-[#2C5F46] font-black">{order.user_email.split('@')[0]}</span>
                      </div>
                   </motion.div>

                   {/* Action Button */}
                   {isOpen && !isMine && (
                     <motion.button 
                       onClick={() => handleAccept(order.id)}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="w-full bg-[#2C5F46] text-white py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-[#1e4030] shadow-lg flex items-center justify-center gap-2 transition-all"
                     >
                       🚴 Deliver This <Truck size={18} />
                     </motion.button>
                   )}
                   {isMine && isOpen && (
                     <motion.div 
                       className="w-full bg-[#F4C458] text-[#2C5F46] py-3 rounded-xl font-bold uppercase cursor-default"
                       animate={{ scale: [1, 1.02, 1] }}
                       transition={{ duration: 2, repeat: Infinity }}
                     >
                       ⏳ Waiting for a Rider
                     </motion.div>
                   )}
                   {order.accepted_by && (
                     <motion.div 
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-bold uppercase"
                     >
                       ✅ {order.accepted_by.split('@')[0]} is delivering!
                     </motion.div>
                   )}
                </div>
              </motion.div>
            )
          })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}