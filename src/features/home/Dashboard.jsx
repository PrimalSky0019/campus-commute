import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'
import EmergencyBoard from '../emergency/EmergencyBoard'

export default function Dashboard({ session }) {
    const [activeTab, setActiveTab] = useState('travel')

    // --- ROBUST LOGOUT FUNCTION ---
    // This handles the "AuthSessionMissingError" by forcing a cleanup
    const handleLogout = async () => {
        // 1. Try to sign out from Supabase
        const { error } = await supabase.auth.signOut()

        // 2. Log warning if error, but proceed anyway
        if (error) {
            console.warn("Forcing logout despite error:", error.message)
        }

        // 3. CRITICAL: Clear local storage to remove stuck tokens
        localStorage.clear()

        // 4. Force a page reload to reset the App state to "Landing Page"
        window.location.reload()
    }

    return (
        // DARK THEME CONTAINER
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black font-sans">

            {/* --- NAVBAR --- */}
            <nav className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl">
                <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Campus Commute
                </h1>

                <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-400 border border-red-500/30 px-4 py-2 rounded-full hover:bg-red-500/10 hover:text-red-300 transition-all uppercase tracking-wider"
                >
                    Logout
                </button>
            </nav>

            {/* --- TABS --- */}
            <div className="flex justify-center mt-8 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-full p-1.5 flex gap-2 backdrop-blur-md shadow-2xl">
                    {['travel', 'delivery', 'safety'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeTab === tab
                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105'
                                    : 'text-gray-500 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {tab === 'travel' && '🚗 Travel'}
                            {tab === 'delivery' && '🍔 Delivery'}
                            {tab === 'safety' && '🚨 Safety'}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="pb-20 px-2 md:px-6">
                {activeTab === 'travel' && <TravelFeed session={session} />}
                {activeTab === 'delivery' && <DeliveryBoard session={session} />}
                {activeTab === 'safety' && <EmergencyBoard session={session} />}
            </div>
        </div>
    )
}