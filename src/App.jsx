import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient'
import Login from './features/auth/Login'
import Dashboard from './features/home/Dashboard'
import LandingPage from './features/home/LandingPage'

function App() {
    const [session, setSession] = useState(null)
    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setIsLoading(false)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
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

    // Logged In -> Dashboard
    if (session) {
        return <Dashboard session={session} />
    }

    // Login Screen
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

    // Landing Page
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