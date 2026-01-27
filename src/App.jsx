import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient'
import Login from './features/auth/Login'
import Dashboard from './features/home/Dashboard'
import LandingPage from './features/home/LandingPage'
import Onboarding from './features/auth/Onboarding'

function App() {
    const [session, setSession] = useState(null)
    const [hasProfile, setHasProfile] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // 1. Check Session & Profile on Load
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            
            if (session) {
                // Check if profile row exists in DB
                const { data } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', session.user.id)
                    .single()
                
                if (data) {
                    setHasProfile(true)
                }
            }
            setIsLoading(false)
        }

        checkUser()

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (!session) setHasProfile(false)
        })
        return () => subscription.unsubscribe()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#00C853] border-t-transparent rounded-full"
                />
            </div>
        )
    }

    // SCENARIO 1: User Logged In BUT No Profile -> Show Onboarding
    if (session && !hasProfile) {
        return <Onboarding session={session} onComplete={() => setHasProfile(true)} />
    }

    // SCENARIO 2: User Logged In AND Has Profile -> Show Dashboard
    if (session && hasProfile) {
        return <Dashboard session={session} />
    }

    // SCENARIO 3: Show Login
    if (showLogin) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen w-full flex items-center justify-center bg-[#FDF8F0]"
                >
                    <motion.button 
                        onClick={() => setShowLogin(false)} 
                        whileHover={{ x: -5 }}
                        className="absolute top-6 left-6 z-20 text-gray-600 font-bold hover:text-black transition-colors flex items-center gap-2"
                    >
                        ← Back
                    </motion.button>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Login />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        )
    }

    // SCENARIO 4: Show Landing Page
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full min-h-screen"
            >
                <LandingPage onGetStarted={() => setShowLogin(true)} />
            </motion.div>
        </AnimatePresence>
    )
}

export default App