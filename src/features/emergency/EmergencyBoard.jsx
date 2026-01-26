import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react'

export default function EmergencyBoard({ session }) {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(false)
    const [sosLoading, setSosLoading] = useState(false)

    // Form for non-SOS help
    const [type, setType] = useState('Medical')
    const [desc, setDesc] = useState('')

    const fetchAlerts = async () => {
        const { data } = await supabase
            .from('emergencies')
            .select('*')
            .eq('status', 'Active')
            .order('created_at', { ascending: false })
        if (data) setAlerts(data)
    }

    useEffect(() => { fetchAlerts() }, [])

    // --- FUNCTION: SEND SOS (One Tap) ---
    const handleSOS = () => {
        if (!confirm("Are you sure? This will broadcast your location to everyone.")) return;

        setSosLoading(true)

        // Get Location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords

                await supabase.from('emergencies').insert([{
                    user_email: session.user.email,
                    type: 'SOS',
                    description: 'EMERGENCY: User requested immediate help!',
                    latitude,
                    longitude,
                    is_sos: true
                }])

                setSosLoading(false)
                fetchAlerts()
                alert("SOS Broadcasted! Help is on the way.")
            }, (error) => {
                alert("Could not get location. Posting without GPS.")
                setSosLoading(false)
            })
        } else {
            alert("Geolocation not supported.")
            setSosLoading(false)
        }
    }

    // --- FUNCTION: POST HELP REQUEST ---
    const handleRequestHelp = async (e) => {
        e.preventDefault()
        setLoading(true)
        await supabase.from('emergencies').insert([{
            user_email: session.user.email, type, description: desc, is_sos: false
        }])
        setDesc('')
        fetchAlerts()
        setLoading(false)
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-8">

            {/* --- THE SOS BUTTON --- */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-red-50 via-red-50 to-orange-50 p-8 rounded-3xl border-2 border-red-200 text-center shadow-lg shadow-red-200/50"
            >
                <div className="flex justify-center mb-4">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-red-600"
                    >
                        <ShieldAlert size={40} />
                    </motion.div>
                </div>

                <h2 className="text-4xl font-black text-red-700 mb-1 tracking-tight">
                    EMERGENCY SOS
                </h2>
                <p className="text-red-600 mb-8 text-sm font-medium leading-relaxed">
                    Instantly share your live location with campus security & nearby students
                </p>

                <motion.button
                    whileTap={{ scale: 0.92 }}
                    animate={{ 
                        boxShadow: ["0px 0px 0px 0px rgba(239, 68, 68, 0.7)", "0px 0px 0px 25px rgba(239, 68, 68, 0)"],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    onClick={handleSOS}
                    disabled={sosLoading}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-black text-5xl shadow-2xl shadow-red-500 flex items-center justify-center mx-auto border-4 border-red-400 hover:from-red-700 hover:to-red-800 transition-all"
                >
                    {sosLoading ? (
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-3xl"
                        >
                            ⟳
                        </motion.div>
                    ) : (
                        'SOS'
                    )}
                </motion.button>

                <p className="text-xs text-red-500 mt-6 font-bold uppercase tracking-wider">
                    ⚠️ ONLY TAP IF YOU'RE IN IMMEDIATE DANGER
                </p>
            </motion.div>

            {/* --- Request Help Form --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg border-2 border-orange-100"
            >
                <h3 className="text-2xl font-black text-gray-800 mb-1 flex items-center gap-2">
                    <AlertCircle className="text-orange-500" size={28} /> Request Assistance
                </h3>
                <p className="text-gray-500 text-sm mb-6 font-medium">Non-emergency help request</p>

                <form onSubmit={handleRequestHelp} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Type of Help</label>
                        <select
                            className="w-full p-3 bg-white border-2 border-orange-200 rounded-xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium transition-all"
                            value={type} 
                            onChange={e => setType(e.target.value)}
                        >
                            <option>Medical</option>
                            <option>Safety</option>
                            <option>Lost Item</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Description</label>
                        <textarea
                            placeholder="Tell us what help you need..."
                            className="w-full p-3 bg-white border-2 border-orange-200 rounded-xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 h-24 resize-none font-medium transition-all"
                            value={desc} 
                            onChange={e => setDesc(e.target.value)}
                            required
                        />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post Request'}
                    </motion.button>
                </form>
            </motion.div>

            {/* --- Active Alerts Feed --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700">Active Alerts</h3>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className={`p-5 rounded-2xl border-l-4 shadow-sm ${alert.is_sos ? 'bg-red-50 border-red-500' : 'bg-white border-orange-400'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className={`font-bold text-lg ${alert.is_sos ? 'text-red-700' : 'text-gray-800'}`}>
                                    {alert.is_sos ? '🚨 SOS SIGNAL' : alert.type}
                                </h4>
                                <p className="text-gray-600 text-sm mt-1">{alert.description}</p>

                                {/* Show Location if available */}
                                {alert.latitude && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                                        target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 text-sm mt-3 font-medium hover:underline"
                                    >
                                        <MapPin size={14} /> View Location on Map
                                    </a>
                                )}
                            </div>
                            <span className="text-xs bg-white px-2 py-1 rounded border">
                {new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}