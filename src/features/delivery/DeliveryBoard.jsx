import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Truck, ShoppingBag, Plus, IndianRupee, CheckCircle, Package, ArrowRight } from 'lucide-react'

const LOCATIONS = [
  'City Mall', 'Stationery Shop', 'Burger King', 'Dominos', 'Campus Store', 'Medical Store'
]

export default function DeliveryBoard({ session }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'trip', 'request'

  // Form
  const [type, setType] = useState('trip')
  const [destination, setDestination] = useState('')
  const [item, setItem] = useState('')
  const [location, setLocation] = useState('')

  const DELIVERY_FEE = 20

  const fetchPosts = async () => {
    const { data } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'Completed') // We hide completed orders to keep board clean
        .order('created_at', { ascending: false })

    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    const sub = supabase.channel('orders-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchPosts)
        .subscribe()

    return () => sub.unsubscribe()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('orders').insert([{
      type, destination, item_name: item, location, delivery_fee: DELIVERY_FEE,
      status: 'Open', user_email: session.user.email
    }])
    setShowForm(false); setItem(''); setDestination(''); setLocation(''); setLoading(false)
  }

  const acceptPost = async id => {
    if(!confirm("Are you sure you want to accept this task?")) return;
    await supabase.from('orders').update({ status: 'In Progress', accepted_by: session.user.email }).eq('id', id)
  }

  const completePost = async id => {
    if(!confirm("Has the delivery been completed?")) return;
    await supabase.from('orders').update({ status: 'Completed' }).eq('id', id)
  }

  // Filter Logic
  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter)

  return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto">

          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Community Delivery</h1>
              <p className="text-gray-500 font-medium">Earn ₹20 per delivery or get things brought to you.</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
              {showForm ? 'Close Form' : <><Plus size={20} /> New Request</>}
            </button>
          </div>

          {/* --- FORM SECTION --- */}
          <AnimatePresence>
            {showForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
                  <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button type="button" onClick={() => setType('trip')} className={`p-4 rounded-2xl font-bold border-2 transition-all ${type === 'trip' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'}`}>
                        🚗 I'm Going Somewhere
                      </button>
                      <button type="button" onClick={() => setType('request')} className={`p-4 rounded-2xl font-bold border-2 transition-all ${type === 'request' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-400'}`}>
                        📦 I Need Something
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <select value={destination} onChange={e => setDestination(e.target.value)} required className="p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 ring-black">
                        <option value="">Where is the shop/stop?</option>
                        {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                      </select>
                      <input placeholder="Delivery Location (e.g. Hostel 4)" value={location} onChange={e => setLocation(e.target.value)} required className="p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 ring-black"/>
                    </div>

                    {type === 'request' && (
                        <input placeholder="What items do you need? (e.g. 2 Notebooks)" value={item} onChange={e => setItem(e.target.value)} required className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 ring-black mb-4"/>
                    )}

                    <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
                      {loading ? 'Publishing...' : 'Post to Board'}
                    </button>
                  </form>
                </motion.div>
            )}
          </AnimatePresence>

          {/* --- FILTERS --- */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'trip', 'request'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                  {f === 'all' ? 'All Posts' : f + 's'}
                </button>
            ))}
          </div>

          {/* --- CARDS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map(post => {
                const isMine = post.user_email === session.user.email
                const isRequest = post.type === 'request'

                return (
                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={post.id}
                                className={`p-6 rounded-3xl border-2 relative group hover:-translate-y-1 transition-transform ${isRequest ? 'bg-orange-50/50 border-orange-100' : 'bg-blue-50/50 border-blue-100'}`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {post.status === 'Open' && <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm border border-gray-100">Open</span>}
                        {post.status === 'In Progress' && <span className="bg-green-100 px-3 py-1 rounded-full text-xs font-bold text-green-700 border border-green-200 animate-pulse">In Progress</span>}
                      </div>

                      {/* Icon & Title */}
                      <div className="mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-sm ${isRequest ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {isRequest ? <ShoppingBag size={24} /> : <Truck size={24} />}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">
                          {isRequest ? 'Needs items from' : 'Going to'} <br/>
                          <span className={isRequest ? 'text-orange-600' : 'text-blue-600'}>{post.destination}</span>
                        </h3>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-6">
                        {post.item_name && (
                            <div className="flex items-start gap-2 text-gray-600 font-medium text-sm bg-white/60 p-2 rounded-lg">
                              <Package size={16} className="mt-0.5"/> <span>{post.item_name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm p-2">
                          <MapPin size={16} /> Drop at: {post.location}
                        </div>
                      </div>

                      {/* Footer / Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                        <div className="font-bold text-gray-900 flex items-center gap-1">
                          <IndianRupee size={16}/> {post.delivery_fee}
                        </div>

                        {/* ACTION BUTTONS */}
                        {isMine ? (
                            post.status === 'In Progress' && (
                                <button onClick={() => completePost(post.id)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-200">
                                  <CheckCircle size={16}/> Completed
                                </button>
                            )
                        ) : (
                            post.status === 'Open' && (
                                <button onClick={() => acceptPost(post.id)} className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800">
                                  Accept <ArrowRight size={16}/>
                                </button>
                            )
                        )}
                        {!isMine && post.status !== 'Open' && <span className="text-xs font-bold text-gray-400">Processing...</span>}
                      </div>
                    </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredPosts.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <p className="text-xl font-bold text-gray-400">No active {filter === 'all' ? 'posts' : filter + 's'} found.</p>
              </div>
          )}
        </div>
      </div>
  )
}