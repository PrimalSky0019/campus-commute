import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabaseClient'
import Login from './features/auth/Login'
import Dashboard from './features/home/Dashboard'
import LandingPage from './features/home/LandingPage'
import Onboarding from './features/auth/Onboarding'

function App() {
    const [session, setSession] = useState(null)
    const [hasProfile, setHasProfile] = useState(null) // Start as null (loading state)
    const [showLogin, setShowLogin] = useState(false)

    // 1. Reusable function to check profile
    const checkProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single()

            if (data) {
                setHasProfile(true)
            } else {
                setHasProfile(false)
            }
        } catch (error) {
            console.error("Profile check failed:", error)
            setHasProfile(false)
        }
    }

    useEffect(() => {
        // 2. Initial Session Check on Load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) {
                checkProfile(session.user.id)
            } else {
                setHasProfile(false)
            }
        })

        // 3. Listen for Login/Logout Events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                // User just logged in? CHECK PROFILE NOW!
                checkProfile(session.user.id)
            } else {
                // User logged out
                setHasProfile(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    // --- RENDERING LOGIC ---

    // 1. Loading State (Prevent flickering)
    if (hasProfile === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-white to-[#F5F5F5] flex flex-col items-center justify-center font-sans relative overflow-hidden">
                {/* Animated background orbs */}
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

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col items-center gap-8"
                >
                    {/* Logo Animation */}
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-[#00C853] to-[#00b548] rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xl"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        🏫
                    </motion.div>

                    {/* Loading Text */}
                    <div className="text-center">
                        <motion.h2 
                            className="text-3xl font-black text-[#1a1a1a] mb-2"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Campus Commute
                        </motion.h2>
                        <p className="text-gray-500 font-medium text-sm">Connecting your campus one ride at a time</p>
                    </div>

                    {/* Loading Spinner */}
                    <motion.div 
                        className="flex gap-2"
                    >
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-[#00C853] rounded-full"
                                animate={{ y: [0, -12, 0] }}
                                transition={{ delay: i * 0.15, duration: 0.8, repeat: Infinity }}
                            />
                        ))}
                    </motion.div>

                    <p className="text-gray-400 text-xs font-medium">Loading your experience...</p>
                </motion.div>
            </div>
        )
    }

    // 2. Dashboard (Logged in + Has Profile)
    if (session && hasProfile) {
        return <Dashboard session={session} />
    }

    // 3. Onboarding (Logged in + NO Profile)
    if (session && !hasProfile) {
        return <Onboarding session={session} onComplete={() => setHasProfile(true)} />
    }

    // 4. Login Screen
    if (showLogin) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#FDF8F0]">
                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => setShowLogin(false)} className="text-gray-500 font-bold hover:text-black">← Back</button>
                </div>
                <Login />
            </div>
        )
    }

    // 5. Landing Page (Default)
    return (
        <div className="w-full min-h-screen">
            <LandingPage onGetStarted={() => setShowLogin(true)} />
        </div>
    )
}

export default App