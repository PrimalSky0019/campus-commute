import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import TravelFeed from '../travel/TravelFeed'
import DeliveryBoard from '../delivery/DeliveryBoard'

export default function Dashboard({ session }) {
    const [activeTab, setActiveTab] = useState('travel')

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-blue-600">Campus Commute</h1>
                <button onClick={() => supabase.auth.signOut()} className="text-sm text-red-500 font-semibold">
                    Logout
                </button>
            </nav>

            {/* Tabs */}
            <div className="flex justify-center mt-4 mb-6">
                <div className="bg-white rounded-full p-1 shadow-sm border">
                    <button
                        onClick={() => setActiveTab('travel')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'travel' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        🚗 Travel
                    </button>
                    <button
                        onClick={() => setActiveTab('delivery')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === 'delivery' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        🍔 Delivery
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="pb-20">
                {activeTab === 'travel' ? <TravelFeed session={session} /> : <DeliveryBoard session={session} />}
            </div>
        </div>
    )
}