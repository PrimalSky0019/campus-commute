import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { motion } from 'framer-motion'
import { User, Bell, Leaf, LogOut, MapPin } from 'lucide-react'

export default function ProfileSection({ session }) {
    const [profile, setProfile] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch profile + recent activity
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profileError) throw profileError

                const { data: rides } = await supabase
                    .from('travel_plans')
                    .select('*')
                    .or(
                        `user_email.eq.${session.user.email},passengers.cs.{${session.user.email}}`
                    )
                    .order('created_at', { ascending: false })
                    .limit(5)

                setProfile(profileData)
                setHistory(rides || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [session])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    const toggleNotification = async () => {
        const updated = !profile.notifications_enabled
        setProfile({ ...profile, notifications_enabled: updated })

        await supabase
            .from('profiles')
            .update({ notifications_enabled: updated })
            .eq('id', session.user.id)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-10">
                <div className="max-w-4xl mx-auto animate-pulse space-y-6">
                    <div className="h-8 w-1/3 bg-gray-200 rounded" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="h-24 bg-gray-200 rounded-xl" />
                        <div className="h-24 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="text-gray-400" size={36} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {profile.full_name || 'Anonymous User'}
                        </h2>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                        <span className="inline-block mt-2 text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">
              Student
            </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <StatCard label="Rides Taken" value={history.length} />
                    <StatCard
                        label="Saved Routes"
                        value={profile.frequent_routes?.length || 0}
                    />
                </div>

                {/* Preferences */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Preferences</h3>

                    <SettingRow
                        icon={<Leaf size={18} />}
                        label="Diet Preference"
                        value={profile.diet_preference || 'Not specified'}
                    />

                    <SettingToggle
                        icon={<Bell size={18} />}
                        label="Notifications"
                        enabled={profile.notifications_enabled}
                        onToggle={toggleNotification}
                    />
                </div>

                {/* Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

                    {history.length === 0 && (
                        <p className="text-sm text-gray-500">No recent activity.</p>
                    )}

                    <div className="space-y-3">
                        {history.map(item => (
                            <ActivityItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="mt-10 text-sm text-red-500 hover:underline"
                >
                    Sign out
                </button>
            </motion.div>
        </div>
    )
}

/* ---------- Sub Components ---------- */

function StatCard({ label, value }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    )
}

function SettingRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 text-gray-700">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    )
}

function SettingToggle({ icon, label, enabled, onToggle }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 text-gray-700">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <button
                onClick={onToggle}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    enabled ? 'bg-black' : 'bg-gray-200'
                }`}
            >
                <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    )
}

function ActivityItem({ item }) {
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin size={16} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        Trip to {item.destination}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    )
}
