import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { Plus, ShoppingBag, MapPin } from 'lucide-react'

export default function DeliveryBoard({ session }) {
    const [orders, setOrders] = useState([])
    const [newOrder, setNewOrder] = useState({ platform: '', location: '' })

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('status', 'Open')
            .order('created_at', { ascending: false })
        if (data) setOrders(data)
    }

    useEffect(() => { fetchOrders() }, [])

    const handleCreateOrder = async (e) => {
        e.preventDefault()
        const { error } = await supabase.from('orders').insert([{
            user_email: session.user.email, platform: newOrder.platform, location: newOrder.location
        }])
        if (!error) { setNewOrder({ platform: '', location: '' }); fetchOrders() }
    }

    const handleAddItem = async (orderId, itemName) => {
        if (!itemName) return
        await supabase.from('order_items').insert([{ order_id: orderId, user_email: session.user.email, item_name: itemName }])
        fetchOrders()
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            {/* --- Create Order --- */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200"
            >
                <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <ShoppingBag /> Start a Pool
                </h2>
                <form onSubmit={handleCreateOrder} className="flex gap-2">
                    <input placeholder="Store (e.g. KFC)" className="flex-1 bg-white/50 border-none p-3 rounded-xl outline-none focus:bg-white transition-colors" value={newOrder.platform} onChange={e => setNewOrder({...newOrder, platform: e.target.value})} required />
                    <input placeholder="Location" className="flex-1 bg-white/50 border-none p-3 rounded-xl outline-none focus:bg-white transition-colors" value={newOrder.location} onChange={e => setNewOrder({...newOrder, location: e.target.value})} required />
                    <motion.button whileTap={{ scale: 0.9 }} className="bg-orange-500 text-white px-5 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                        Go
                    </motion.button>
                </form>
            </motion.div>

            {/* --- Orders Grid --- */}
            <div className="grid gap-4">
                {orders.map((order, i) => (
                    <motion.div
                        key={order.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{order.platform}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} /> {order.location}
                                    <span className="mx-1">•</span>
                                    Host: {order.user_email.split('@')[0]}
                                </p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                OPEN
              </span>
                        </div>

                        <div className="bg-gray-50/50 p-3 rounded-xl mb-4 text-sm space-y-2">
                            {order.order_items.length === 0 ? <p className="text-gray-400 italic text-xs">No items yet</p> :
                                order.order_items.map(item => (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.id} className="flex justify-between">
                                        <span className="font-medium text-gray-700">{item.item_name}</span>
                                        <span className="text-gray-400 text-xs">{item.user_email.split('@')[0]}</span>
                                    </motion.div>
                                ))
                            }
                        </div>

                        <div className="flex gap-2">
                            <input id={`input-${order.id}`} placeholder="Add your request..." className="bg-gray-50 border-none p-2 rounded-lg flex-1 text-sm outline-none focus:ring-1 ring-gray-200" />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    const input = document.getElementById(`input-${order.id}`)
                                    handleAddItem(order.id, input.value)
                                    input.value = ''
                                }}
                                className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 font-medium"
                            >
                                <Plus size={16} /> Add
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}