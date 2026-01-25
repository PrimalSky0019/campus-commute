import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Plus, ShoppingBag } from 'lucide-react' // Icons

export default function DeliveryBoard({ session }) {
    const [orders, setOrders] = useState([])
    const [newOrder, setNewOrder] = useState({ platform: '', location: '' })

    // Fetch active orders
    const fetchOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)') // Get the order AND the items inside it
            .eq('status', 'Open')
            .order('created_at', { ascending: false })

        if (data) setOrders(data)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // Create a new "Group Order"
    const handleCreateOrder = async (e) => {
        e.preventDefault()
        const { error } = await supabase.from('orders').insert([{
            user_email: session.user.email,
            platform: newOrder.platform,
            location: newOrder.location,
            status: 'Open'
        }])

        if (!error) {
            setNewOrder({ platform: '', location: '' })
            fetchOrders()
        }
    }

    // Add an item to someone's order
    const handleAddItem = async (orderId, itemName) => {
        if (!itemName) return

        await supabase.from('order_items').insert([{
            order_id: orderId,
            user_email: session.user.email,
            item_name: itemName
        }])
        fetchOrders() // Refresh to see the new item
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Top Section: Create Order */}
            <div className="bg-orange-50 p-6 rounded-lg mb-8 border border-orange-200">
                <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                    <ShoppingBag /> Start a Pool
                </h2>
                <form onSubmit={handleCreateOrder} className="flex gap-2">
                    <input
                        placeholder="Platform (e.g. Dominos, Blinkit)"
                        className="border p-2 rounded flex-1"
                        value={newOrder.platform}
                        onChange={e => setNewOrder({...newOrder, platform: e.target.value})}
                        required
                    />
                    <input
                        placeholder="Drop Location"
                        className="border p-2 rounded flex-1"
                        value={newOrder.location}
                        onChange={e => setNewOrder({...newOrder, location: e.target.value})}
                        required
                    />
                    <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                        Create
                    </button>
                </form>
            </div>

            {/* List of Open Orders */}
            <div className="grid gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white border rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold">{order.platform}</h3>
                                <p className="text-sm text-gray-500">📍 {order.location} • Host: {order.user_email.split('@')[0]}</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {order.status}
              </span>
                        </div>

                        {/* List Items in this Order */}
                        <div className="bg-gray-50 p-3 rounded mb-4 text-sm space-y-1">
                            {order.order_items.length === 0 ? (
                                <p className="text-gray-400 italic">No items yet.</p>
                            ) : (
                                order.order_items.map(item => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.item_name}</span>
                                        <span className="text-gray-500 text-xs">{item.user_email.split('@')[0]}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Item Input */}
                        <div className="flex gap-2">
                            <input
                                id={`input-${order.id}`}
                                placeholder="I want..."
                                className="border p-1.5 rounded flex-1 text-sm"
                            />
                            <button
                                onClick={() => {
                                    const input = document.getElementById(`input-${order.id}`)
                                    handleAddItem(order.id, input.value)
                                    input.value = ''
                                }}
                                className="bg-gray-800 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Request
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}