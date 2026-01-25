import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './features/auth/Login'
import Dashboard from './features/home/Dashboard'

function App() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        // 1. Check active session when app loads
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        // 2. Listen for changes (login, logout)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    // If logged in, show Dashboard. Otherwise, show Login.
    return (
        <div>
            {session ? <Dashboard session={session} /> : <Login />}
        </div>
    )
}

export default App