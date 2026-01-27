import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { Clock, ShoppingBag, ShieldAlert, CheckCircle, Calendar } from 'lucide-react'

export default function ActivityHistory({ session }) {
    const [history, setHistory] = useState({ rides: [], orders: [], alerts: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            const email = session.user.email

            // 1. Get My Rides (Posted or Joined)
            const { data: rides } = await supabase
                .from('travel_plans')
                .select('*')
                .or(`user_email.eq.${email},passengers.cs.{${email}}`)
                .order('created_at', { ascending: false })

            // 2. Get My Deliveries (Requested or Delivered)
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .or(`user_email.eq.${email},accepted_by.eq.${email}`)
                .eq('status', 'Completed') // Only show completed history
                .order('created_at', { ascending: false })

            // 3. Get My SOS History
            const { data: alerts } = await supabase
                .from('emergencies')
                .select('*')
                .eq('user_email', email)
                .order('created_at', { ascending: false })

            setHistory({ rides: rides || [], orders: orders || [], alerts: alerts || [] })
            setLoading(false)
        }

        fetchHistory()
    }, [session])

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-24 text-black">
            <h2 className="text-3xl font-black mb-6">My Activity</h2>

            {/* --- RIDES HISTORY --- */}
            <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock /> Travel History</h3>
                <div className="space-y-3">
                    {history.rides.map(ride => (
                        <div key={ride.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                            <div>
                                <p className="font-bold">{ride.origin} → {ride.destination}</p>
                                <p className="text-xs text-gray-400">{new Date(ride.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg">
                 {ride.user_email === session.user.email ? 'Driver/Host' : 'Passenger'}
               </span>
                        </div>
                    ))}
                    {history.rides.length === 0 && <p className="text-gray-400 text-sm">No travel history yet.</p>}
                </div>
            </section>

            {/* --- DELIVERY HISTORY --- */}
            <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag /> Completed Orders</h3>
                <div className="space-y-3">
                    {history.orders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                            <div>
                                <p className="font-bold">{order.item_name}</p>
                                <p className="text-xs text-gray-500">From {order.platform}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-green-600">✔ Completed</span>
                                <span className="text-[10px] text-gray-400">
                    {order.user_email === session.user.email ? 'You requested' : 'You delivered'}
                  </span>
                            </div>
                        </div>
                    ))}
                    {history.orders.length === 0 && <p className="text-gray-400 text-sm">No completed orders.</p>}
                </div>
            </section>

            {/* --- SOS HISTORY --- */}
            <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldAlert /> Alert Logs</h3>
                <div className="space-y-3">
                    {history.alerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-2xl border flex justify-between items-center ${alert.status === 'Resolved' ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
                            <div>
                                <p className="font-bold">{alert.type}</p>
                                <p className="text-xs text-gray-500">{alert.description}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${alert.status === 'Resolved' ? 'text-gray-500 bg-gray-200' : 'text-red-600 bg-red-100'}`}>
                 {alert.status}
               </span>
                        </div>
                    ))}
                    {history.alerts.length === 0 && <p className="text-gray-400 text-sm">No alerts recorded.</p>}
                </div>
            </section>
        </div>
    )
}