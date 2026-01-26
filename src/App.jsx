import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './features/auth/Login'
import Dashboard from './features/home/Dashboard' // <--- No curly braces!
import LandingPage from './features/home/LandingPage'

function App() {
    const [session, setSession] = useState(null)
    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    // 1. If user is logged in -> Show Dashboard
    if (session) {
        return <Dashboard session={session} />
    }

    // 2. If user wants to login -> Show Login Page
    if (showLogin) {
        return (
            <>
                <div className="absolute top-4 left-4 z-10">
                    <button onClick={() => setShowLogin(false)} className="text-gray-500 text-sm hover:underline">
                        ← Back to Home
                    </button>
                </div>
                <Login />
            </>
        )
    }

    // 3. Default -> Show Landing Page
    return <LandingPage onGetStarted={() => setShowLogin(true)} />
}

export default App