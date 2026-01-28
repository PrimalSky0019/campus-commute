import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, ShieldAlert, CheckCircle, AlertCircle, Trash2, Check } from 'lucide-react'
import { toast } from 'sonner'

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
            .neq('status', 'Resolved')
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
                toast.success("SOS Broadcasted! Help is on the way.")
            }, (error) => {
                toast.warning("Could not get location. Posting without GPS.")
                setSosLoading(false)
            })
        } else {
            toast.error("Geolocation not supported.")
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

    // --- UPDATED: RESOLVE (SOFT DELETE) ---
    const handleResolve = async (id, alertEmail) => {
        // Security check: Only allow the creator to resolve their alert
        if (session.user.email !== alertEmail) {
            toast.error('You can only resolve your own alerts!')
            return
        }

        if (window.confirm('Are you sure you want to resolve this alert?')) {
            // Instead of .delete(), we update the status
            const { error } = await supabase
                .from('emergencies')
                .update({ status: 'Resolved' }) // Mark as resolved
                .eq('id', id)
            
            if (error) {
                toast.error("Error resolving: " + error.message)
            } else {
                // Remove from the active view immediately
                setAlerts(alerts.filter(a => a.id !== id))
                toast.success('Alert resolved successfully.')
            }
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">

            {/* --- THE SOS BUTTON --- */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden"
            >
                {/* Animated background */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-600/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="relative bg-gradient-to-br from-red-50 via-red-50/80 to-orange-50 p-12 rounded-3xl border-2 border-red-300 text-center shadow-2xl shadow-red-500/20">
                    <motion.div 
                        className="flex justify-center mb-6"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-red-600"
                        >
                            <ShieldAlert size={48} strokeWidth={1.5} />
                        </motion.div>
                    </motion.div>

                    <h2 className="text-5xl md:text-6xl font-black text-red-700 mb-2 tracking-tight">
                        🚨 EMERGENCY SOS
                    </h2>
                    <p className="text-red-600 mb-10 text-lg font-bold leading-relaxed">
                        Instantly share your live location with campus security & nearby students
                    </p>

                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        animate={{ 
                            boxShadow: ["0px 0px 0px 0px rgba(239, 68, 68, 0.7)", "0px 0px 0px 30px rgba(239, 68, 68, 0)"],
                            scale: [1, 1.03, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        onClick={handleSOS}
                        disabled={sosLoading}
                        className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-black text-6xl md:text-7xl shadow-2xl shadow-red-600/50 flex items-center justify-center mx-auto border-4 border-red-500 hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                    >
                        {sosLoading ? (
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-4xl"
                            >
                                ⟳
                            </motion.div>
                        ) : (
                            'SOS'
                        )}
                    </motion.button>

                    <motion.p 
                        className="text-xs md:text-sm text-red-600 mt-8 font-black uppercase tracking-widest"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ⚠️ ONLY TAP IF YOU'RE IN IMMEDIATE DANGER
                    </motion.p>
                </div>
            </motion.div>

            {/* --- Request Help Form --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-3xl shadow-[0_8px_32px_rgba(249,115,22,0.1)] border-2 border-orange-100/50 backdrop-blur-sm relative overflow-hidden group"
            >
                <motion.div
                    className="absolute top-0 right-0 w-40 h-40 bg-orange-200 rounded-full opacity-10 blur-3xl"
                    animate={{ x: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                        <motion.div 
                            className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <AlertCircle className="text-orange-600" size={24} />
                        </motion.div>
                        Request Assistance
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 font-medium">Non-emergency help request</p>

                    <form onSubmit={handleRequestHelp} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-3 block">Type of Help Needed</label>
                            <motion.select
                                whileFocus={{ scale: 1.02 }}
                                className="w-full p-4 bg-white/70 backdrop-blur border-2 border-orange-200 rounded-2xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300 font-bold transition-all text-gray-900"
                                value={type} 
                                onChange={e => setType(e.target.value)}
                            >
                                <option>🏥 Medical</option>
                                <option>🔒 Safety</option>
                                <option>📦 Lost Item</option>
                                <option>❓ Other</option>
                            </motion.select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-3 block">Description</label>
                            <motion.textarea
                                whileFocus={{ scale: 1.02 }}
                                placeholder="Tell us what help you need... (Be specific for faster response)"
                                className="w-full p-4 bg-white/70 backdrop-blur border-2 border-orange-200 rounded-2xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300 h-28 resize-none font-medium transition-all text-gray-900 placeholder-gray-500"
                                value={desc} 
                                onChange={e => setDesc(e.target.value)}
                                required
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 uppercase tracking-wide"
                        >
                            {loading ? '📤 Posting...' : '📤 Post Request'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>

            {/* --- Active Alerts Feed --- */}
            <div className="px-2">
                <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-black text-white mb-4 flex items-center gap-3"
                >
                    <motion.div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
                    Active Alerts
                    <span className="text-sm font-medium text-gray-400 ml-auto">{alerts.length} active</span>
                </motion.h3>
            </div>

            <div className="space-y-4 px-2">
                {alerts.length === 0 && (
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
                            ✅
                        </motion.div>
                        <p className="text-gray-400 font-medium">Campus is safe. No active alerts.</p>
                    </motion.div>
                )}

                {alerts.map((alert, idx) => {
                    const isAlertCreator = session.user.email === alert.user_email
                    return (
                        <motion.div
                            key={alert.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -4 }}
                            className={`p-6 rounded-3xl border-l-4 shadow-lg transition-all overflow-hidden group relative ${
                                alert.is_sos 
                                    ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-500 shadow-red-500/20' 
                                    : 'bg-gradient-to-br from-orange-50 to-yellow-50/50 border-orange-400 shadow-orange-500/10'
                            }`}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.8 }}
                            />

                            <div className="flex justify-between items-start gap-4 relative z-10">
                                <div className="flex-1">
                                    <motion.h4 
                                        className={`font-black text-lg ${alert.is_sos ? 'text-red-700' : 'text-orange-700'}`}
                                        whileHover={{ letterSpacing: "0.05em" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {alert.is_sos ? '🚨 SOS SIGNAL - IMMEDIATE HELP NEEDED!' : `📋 ${alert.type}`}
                                    </motion.h4>
                                    <p className="text-gray-700 text-sm mt-2 font-medium">{alert.description}</p>
                                    <p className="text-xs text-gray-500 mt-3 font-semibold">
                                        Posted by <span className="text-red-600 font-bold">{alert.user_email.split('@')[0]}</span>
                                    </p>

                                    {/* Show Location if available */}
                                    {alert.latitude && (
                                        <motion.a
                                            whileHover={{ scale: 1.05, x: 5 }}
                                            href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-600 text-sm mt-4 font-bold hover:text-blue-700 bg-blue-100 px-4 py-2 rounded-full transition-all"
                                        >
                                            <MapPin size={16} /> 📍 View Location
                                        </motion.a>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                    <motion.span 
                                        className="text-xs bg-white px-3 py-1.5 rounded-full text-gray-600 font-bold border border-gray-300"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </motion.span>

                                    {/* Delete/Resolve button - Only show if user created this alert */}
                                    {isAlertCreator && (
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleResolve(alert.id, alert.user_email)}
                                            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all border-2 border-green-300"
                                        >
                                            <Check size={14} /> Resolved
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}