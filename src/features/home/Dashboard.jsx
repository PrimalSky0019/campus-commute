import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'
import EmergencyBoard from '../emergency/EmergencyBoard'
import ProfileSection from './ProfileSection'
import { User, LogOut, MapPin, Package, Shield } from 'lucide-react'

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('travel')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.reload()
  }

  const tabs = [
    { id: 'travel', label: 'Travel', icon: <MapPin size={18} /> },
    { id: 'delivery', label: 'Delivery', icon: <Package size={18} /> },
    { id: 'safety', label: 'Safety', icon: <Shield size={18} /> },
  ]

  return (
    // APPLE GRAY BACKGROUND
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* --- FROSTED GLASS NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo Area */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setActiveTab('travel')}
          >
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
               CC
             </div>
             <span className="font-semibold text-lg tracking-tight text-gray-900">
               CampusCommute
             </span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex bg-gray-100/80 p-1 rounded-full">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 hover:bg-gray-100 pr-3 pl-1 py-1 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${session.user.email}`} 
                    alt="avatar"
                    className="w-full h-full rounded-full bg-white object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {session.user.email.split('@')[0]}
              </span>
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
            </button>
          </div>

        </div>
      </nav>

      {/* --- CONTENT AREA --- */}
      <main className="max-w-4xl mx-auto px-4 mt-8 animate-in fade-in duration-500">
        {/* Mobile Tabs */}
        <div className="flex md:hidden justify-between bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-400'
                }`}
              >
                {tab.icon} <span className="mt-1">{tab.label}</span>
              </button>
            ))}
        </div>

        {activeTab === 'travel' && <TravelFeed session={session} />}
        {activeTab === 'delivery' && <DeliveryBoard session={session} />}
        {activeTab === 'safety' && <EmergencyBoard session={session} />}
        {activeTab === 'profile' && <ProfileSection session={session} />}
      </main>
    </div>
  )
}