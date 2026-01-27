import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'
import EmergencyBoard from '../emergency/EmergencyBoard'
import ProfileSection from './ProfileSection'
import { User, LogOut, Heart } from 'lucide-react'

export default function Dashboard({ session }) {
    const [activeTab, setActiveTab] = useState('travel')
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    // Robust Logout function
    const handleLogout = async () => {
        await supabase.auth.signOut()
        localStorage.clear()
        window.location.reload()
    }

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-white to-[#F5F5F5] text-[#1a1a1a] font-sans selection:bg-[#00C853] selection:text-white pb-20">

            {/* --- ANIMATED BACKGROUND ORBS --- */}
            <motion.div
                className="fixed top-0 right-0 w-96 h-96 bg-[#00C853]/5 rounded-full blur-3xl pointer-events-none"
                animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="fixed bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"
                animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            {/* --- FLOATING NAVBAR --- */}
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="sticky top-6 z-50 px-6 mb-8"
            >
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl px-6 py-4 flex justify-between items-center max-w-6xl mx-auto transition-all hover:shadow-xl hover:bg-white/80 duration-300">

                    {/* LEFT: Logo */}
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setActiveTab('travel')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div 
                            className="w-11 h-11 bg-gradient-to-br from-[#00C853] to-[#00b548] rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                        >
                            🏫
                        </motion.div>
                        <div>
                            <div className="font-black text-lg tracking-tight bg-gradient-to-r from-[#00C853] to-[#00b548] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                Campus Commute
                            </div>
                            <div className="text-xs text-gray-500 font-medium">Connected & Secure</div>
                        </div>
                    </motion.div>

                    {/* CENTER: Main Tabs (Travel, Delivery, Safety) */}
                    <div className="hidden md:flex bg-gray-100/60 backdrop-blur p-1.5 rounded-xl border border-gray-200/50">
                        {[
                            { id: 'travel', label: '🚗 Travel', desc: 'Share rides' },
                            { id: 'delivery', label: '🍔 Delivery', desc: 'Pool orders' },
                            { id: 'safety', label: '🚨 Safety', desc: 'Emergency SOS' }
                        ].map(tab => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title={tab.desc}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-white shadow-md text-black'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* MOBILE ONLY TABS (Icons Only) */}
                    <div className="flex md:hidden bg-gray-100/60 backdrop-blur p-1 rounded-lg border border-gray-200/50 mx-2">
                        {[
                            { id: 'travel', icon: '🚗' },
                            { id: 'delivery', icon: '🍔' },
                            { id: 'safety', icon: '🚨' }
                        ].map(tab => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2.5 rounded-lg text-lg transition-all ${
                                    activeTab === tab.id ? 'bg-white shadow-md' : 'text-gray-500'
                                }`}
                            >
                                {tab.icon}
                            </motion.button>
                        ))}
                    </div>

                    {/* RIGHT: User Area (Profile & Logout) */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">

                        {/* Profile Button */}
                        <motion.button
                            onClick={() => setActiveTab('profile')}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            title="View Profile"
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-full transition-all duration-300 ${
                                activeTab === 'profile'
                                    ? 'bg-gradient-to-r from-[#00C853] to-[#00b548] text-white shadow-lg'
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <motion.div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    activeTab === 'profile'
                                        ? 'bg-white/20'
                                        : 'bg-gradient-to-br from-orange-400 to-pink-500'
                                }`}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <User size={16} />
                            </motion.div>
                            <span className="text-sm font-bold hidden lg:block">
                                {session.user.email.split('@')[0]}
                            </span>
                        </motion.button>

                        {/* Logout Button */}
                        <motion.div className="relative">
                            <motion.button
                                onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Logout"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                            >
                                <LogOut size={18} />
                            </motion.button>

                            {/* Logout Confirmation Popup */}
                            {showLogoutConfirm && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-max"
                                >
                                    <p className="text-sm font-medium text-gray-700 mb-3">Sure you want to logout?</p>
                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={() => setShowLogoutConfirm(false)}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            onClick={handleLogout}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all"
                                        >
                                            Logout
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                </div>
            </motion.nav>

            {/* --- CONTENT AREA --- */}
            <motion.div 
                className="px-4 max-w-7xl mx-auto"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                key={activeTab}
            >
                {activeTab === 'travel' && <TravelFeed session={session} />}
                {activeTab === 'delivery' && <DeliveryBoard session={session} />}
                {activeTab === 'safety' && <EmergencyBoard session={session} />}
                {activeTab === 'profile' && <ProfileSection session={session} />}
            </motion.div>

            {/* --- FOOTER HINT --- */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-6 left-6 text-xs text-gray-400 font-medium max-w-xs hidden lg:block"
            >
                <p className="flex items-center gap-2">
                    <Heart size={14} className="text-red-400" />
                    Made with care for campus
                </p>
            </motion.div>
        </div>
    )
}