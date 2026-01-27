import { useState, useEffect } from 'react'
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
        return <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center font-bold text-gray-400">Loading CampusCommute...</div>
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