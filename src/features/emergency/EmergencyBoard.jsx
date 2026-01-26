import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, ShieldAlert, CheckCircle } from 'lucide-react'

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
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 text-center"
            >
                <h2 className="text-2xl font-bold text-red-700 mb-2 flex justify-center items-center gap-2">
                    <ShieldAlert size={32} /> EMERGENCY SOS
                </h2>
                <p className="text-red-600 mb-6 text-sm">
                    Pressing this will instantly share your live location with campus security and students nearby.
                </p>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    animate={{ boxShadow: ["0px 0px 0px 0px rgba(239, 68, 68, 0.7)", "0px 0px 0px 20px rgba(239, 68, 68, 0)"] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    onClick={handleSOS}
                    disabled={sosLoading}
                    className="w-32 h-32 rounded-full bg-red-600 text-white font-black text-2xl shadow-xl flex items-center justify-center mx-auto border-4 border-red-400"
                >
                    {sosLoading ? '...' : 'SOS'}
                </motion.button>
            </motion.div>

            {/* --- Request Help Form --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" /> Request Assistance
                </h3>
                <form onSubmit={handleRequestHelp} className="flex flex-col gap-3">
                    <select
                        className="p-3 bg-gray-50 rounded-xl outline-none"
                        value={type} onChange={e => setType(e.target.value)}
                    >
                        <option>Medical</option>
                        <option>Safety</option>
                        <option>Lost Item</option>
                        <option>Other</option>
                    </select>
                    <textarea
                        placeholder="Describe what you need help with..."
                        className="p-3 bg-gray-50 rounded-xl outline-none h-24 resize-none"
                        value={desc} onChange={e => setDesc(e.target.value)}
                        required
                    />
                    <button disabled={loading} className="bg-gray-900 text-white py-3 rounded-xl font-bold">
                        {loading ? 'Posting...' : 'Post Request'}
                    </button>
                </form>
            </div>

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