import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'
import EmergencyBoard from '../emergency/EmergencyBoard'

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
        { id: 'safety', label: '🚨 Safety', icon: '🚨' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white selection:bg-yellow-500 selection:text-black font-sans">

            {/* --- NAVBAR --- */}
            <motion.nav 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl shadow-lg"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tight cursor-pointer"
                >
                    Campus Commute
                </motion.div>

                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs font-bold text-red-400 border border-red-500/30 px-4 py-2 rounded-full hover:text-red-300 transition-all uppercase tracking-wider"
                >
                    Logout
                </motion.button>
            </motion.nav>

            {/* --- TABS --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-8 mb-8"
            >
                <ul className="tab-blocks">
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
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`tab-block__item ${
                                    activeTab === tab.id
                                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </motion.button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* --- CONTENT AREA --- */}
            <div className="pb-20 px-2 md:px-6">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'travel' && <TravelFeed session={session} />}
                    {activeTab === 'delivery' && <DeliveryBoard session={session} />}
                    {activeTab === 'safety' && <EmergencyBoard session={session} />}
                </motion.div>
            </div>
        </div>
    )
}