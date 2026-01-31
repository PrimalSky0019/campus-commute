import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'
import EmergencyBoard from '../emergency/EmergencyBoard'
import ProfileSection from './ProfileSection'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, MapPin, Package, Shield, LayoutGrid } from 'lucide-react'

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('travel')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.reload()
  }

  const tabs = [
    { id: 'travel', label: 'Travel', icon: <MapPin size={20} strokeWidth={2.5} /> },
    { id: 'delivery', label: 'Delivery', icon: <Package size={20} strokeWidth={2.5} /> },
    { id: 'safety', label: 'Safety', icon: <Shield size={20} strokeWidth={2.5} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} strokeWidth={2.5} /> },
  ]

  // Animation variants for tab content
  const tabVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }
  }

  return (
      // APPLE GRAY BACKGROUND WITH SUBTLE GRADIENT MESH
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-500/20 selection:text-blue-900 pb-32 md:pb-20 relative overflow-x-hidden">

        {/* Decorative Background Blob */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />

        {/* --- DESKTOP NAVBAR (Sticky & Frosted) --- */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

            {/* Logo Area */}
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setActiveTab('travel')}
            >
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-black/10 group-hover:rotate-6 transition-transform">
                CC
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl tracking-tight text-gray-900 leading-none">CampusCommute</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect • Share • Safe</p>
              </div>
            </div>

            {/* Desktop Tabs (Pill Shape with LayoutId Animation) */}
            <div className="hidden md:flex bg-gray-100/50 p-1.5 rounded-full border border-white/50 backdrop-blur-md">
              {tabs.filter(t => t.id !== 'profile').map(tab => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all z-10 ${
                          activeTab === tab.id ? 'text-black' : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white rounded-full shadow-md border border-gray-100/50 -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                    {tab.icon} {tab.label}
                </span>
                  </button>
              ))}
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
              <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 pr-4 pl-1.5 py-1.5 rounded-full transition-all border ${
                      activeTab === 'profile' ? 'bg-white border-gray-200 shadow-sm' : 'hover:bg-gray-100 border-transparent'
                  }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px] shadow-sm">
                  <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${session.user.email}`}
                      alt="avatar"
                      className="w-full h-full rounded-full bg-white object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 hidden lg:block">
                {session.user.email.split('@')[0]}
              </span>
              </button>

              <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

              <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all"
                  title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

          </div>
        </nav>

        {/* --- CONTENT AREA (Animated Transition) --- */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 mt-8 relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
            >
              {activeTab === 'travel' && <TravelFeed session={session} />}
              {activeTab === 'delivery' && <DeliveryBoard session={session} />}
              {activeTab === 'safety' && <EmergencyBoard session={session} />}
              {activeTab === 'profile' && <ProfileSection session={session} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* --- MOBILE FLOATING DOCK (iOS Style) --- */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-2 flex justify-between items-center relative">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 ${
                          isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {isActive && (
                        <motion.div
                            layoutId="mobileTab"
                            className="absolute inset-0 bg-gray-100 rounded-2xl -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                            {tab.icon}
                        </span>
                    {isActive && (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold mt-1"
                        >
                          {tab.label}
                        </motion.span>
                    )}
                  </button>
              )
            })}
          </div>
        </div>

      </div>
  )
}