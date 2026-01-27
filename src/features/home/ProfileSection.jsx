import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { User, Bell, MapPin, Leaf, LogOut, Edit2, Clock, ShoppingBag } from 'lucide-react'

export default function ProfileSection({ session }) {
    const [profile, setProfile] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()

            // Fetch History (Last 3 items for preview)
            const { data: rides } = await supabase.from('travel_plans')
                .select('*').or(`user_email.eq.${session.user.email},passengers.cs.{${session.user.email}}`)
                .order('created_at', { ascending: false }).limit(3)

            setProfile(profileData)
            setHistory(rides || [])
            setLoading(false)
        }
        fetchData()
    }, [session])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    const toggleNotification = async () => {
        const newVal = !profile.notifications_enabled
        setProfile({ ...profile, notifications_enabled: newVal })
        await supabase.from('profiles').update({ notifications_enabled: newVal }).eq('id', session.user.id)
    }

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 p-4 md:p-10 font-sans flex items-center justify-center">

            {/* --- MAIN CARD (The White Box) --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/95 backdrop-blur-xl w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            >

                {/* --- LEFT SIDE: IDENTITY --- */}
                <div className="md:w-1/3 bg-gray-50 p-10 flex flex-col items-center justify-center text-center border-r border-gray-100 relative">
                    <div className="absolute top-6 left-6">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Student</span>
                    </div>

                    <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-1">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                                <User size={64} className="text-gray-300" />
                                {/* If you had an avatar URL, you'd put <img /> here */}
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Edit2 size={14} />
                        </button>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-1">{profile?.full_name || 'Anonymous User'}</h2>
                    <p className="text-gray-500 font-medium mb-8">{session.user.email}</p>

                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Leaf size={18} /></div>
                                <span className="font-bold text-gray-700">Diet</span>
                            </div>
                            <span className="font-bold text-black">{profile?.diet_preference}</span>
                        </div>

                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Bell size={18} /></div>
                                <span className="font-bold text-gray-700">Alerts</span>
                            </div>
                            <button
                                onClick={toggleNotification}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${profile?.notifications_enabled ? 'bg-black' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${profile?.notifications_enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-auto pt-10 flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>

                {/* --- RIGHT SIDE: DASHBOARD & HISTORY --- */}
                <div className="md:w-2/3 p-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">Make it uniquely yours</h1>
                            <p className="text-gray-500 font-medium">Manage your campus preferences and activity log.</p>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                            <h3 className="text-orange-900 font-black text-4xl mb-1">{history.length}</h3>
                            <p className="text-orange-600/80 font-bold text-sm">Rides Taken</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                            <h3 className="text-purple-900 font-black text-4xl mb-1">{profile?.frequent_routes?.length || 0}</h3>
                            <p className="text-purple-600/80 font-bold text-sm">Saved Routes</p>
                        </div>
                    </div>

                    {/* Recent Activity List */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {history.length === 0 && <p className="text-gray-400 italic">No recent activity found.</p>}

                        {history.map(item => (
                            <div key={item.id} className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-gray-500">
                                    {item.origin ? <Clock size={20} /> : <ShoppingBag size={20} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">
                                        {item.origin ? `Trip to ${item.destination}` : `Order: ${item.item_name}`}
                                    </h4>
                                    <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                                <button className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                    View
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </motion.div>
        </div>
    )
}