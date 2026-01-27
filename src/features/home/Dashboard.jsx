import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'
import EmergencyBoard from '../emergency/EmergencyBoard'
import ActivityHistory from './ActivityHistory'
import ProfileSection from './ProfileSection'

export default function Dashboard({ session }) {
    const [activeTab, setActiveTab] = useState('travel')

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.warn("Forcing logout despite error:", error.message)
        }
        localStorage.clear()
        window.location.reload()
    }

    const tabs = [
        { id: 'travel', label: '🚗 Travel', icon: '🚗' },
        { id: 'delivery', label: '🍔 Delivery', icon: '🍔' },
        { id: 'safety', label: '🚨 Safety', icon: '🚨' },
        { id: 'profile', label: '👤 Profile', icon: '👤' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white selection:bg-green-400 selection:text-black font-sans">

            {/* --- NAVBAR --- */}
            <motion.nav 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-white/5 via-white/5 to-transparent border-b border-white/10 p-4 md:p-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,200,83,0.05)]"
            >
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-green-500/20"
                    >
                        🏫
                    </motion.div>
                    <div>
                        <div className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 tracking-tight">
                            Campus Commute
                        </div>
                        <div className="text-xs text-gray-400 font-medium">Connected & Secure</div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-400 font-medium"
                    >
                        Welcome, <span className="text-green-400">{session.user.email.split('@')[0]}</span>
                    </motion.div>
                    
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs font-bold text-red-400 border border-red-500/30 px-4 py-2 rounded-full hover:text-red-300 hover:border-red-500/50 transition-all uppercase tracking-wider bg-red-500/5"
                    >
                        Logout
                    </motion.button>
                </div>
            </motion.nav>

            {/* --- TABS --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-center mt-8 mb-8 px-4"
            >
                <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-xl border border-white/10 shadow-lg">
                    <ul className="tab-blocks" style={{ background: 'transparent' }}>
                        {tabs.map((tab, idx) => (
                            <motion.li
                                key={tab.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`tab-block ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                <motion.button
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`tab-block__item font-bold transition-all rounded-xl px-6 py-3 ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-black shadow-[0_8px_32px_rgba(0,200,83,0.4)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {tab.label}
                                </motion.button>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.div>

            {/* --- CONTENT AREA --- */}
            <div className="pb-20 px-2 md:px-6">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-7xl mx-auto"
                >
                    {activeTab === 'travel' && <TravelFeed session={session} />}
                    {activeTab === 'delivery' && <DeliveryBoard session={session} />}
                    {activeTab === 'safety' && <EmergencyBoard session={session} />}
                    {activeTab === 'profile' && <ProfileSection session={session} />}
                </motion.div>
            </div>

            {/* --- FLOATING ACTION INFO --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-8 right-8 bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-4 backdrop-blur-xl max-w-xs hidden lg:block"
            >
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <p className="text-sm text-green-100 font-medium">
                        <span className="text-green-400">💡 Tip:</span> Your posts auto-delete after 24 hours for privacy.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}