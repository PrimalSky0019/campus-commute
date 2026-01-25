import { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false) // Toggle between Login and Sign Up

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)

        let result
        if (isSignUp) {
            // 1. Create a new account
            result = await supabase.auth.signUp({
                email,
                password
            })
        } else {
            // 2. Log in to existing account
            result = await supabase.auth.signInWithPassword({
                email,
                password
            })
        }

        const { error } = result

        if (error) {
            alert(error.message)
        } else {
            if (isSignUp) {
                alert('Account created! Please check your email to verify (if required) or just switch to Login.')
                setIsSignUp(false) // Switch to login mode automatically
            }
            // If logging in, the App.jsx will automatically detect the session and switch to Dashboard
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h1 className="mb-2 text-2xl font-bold text-center text-blue-600">Campus Commute</h1>
                <p className="mb-6 text-center text-gray-500">
                    {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </p>

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    <input
                        className="p-3 border rounded focus:outline-none focus:border-blue-500"
                        type="email"
                        placeholder="Email ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="p-3 border rounded focus:outline-none focus:border-blue-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        className="p-3 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 font-bold transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                {/* Toggle between Sign Up and Login */}
                <div className="mt-4 text-center text-sm">
                    <p className="text-gray-600">
                        {isSignUp ? "Already have an ID?" : "Don't have an ID?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-blue-600 font-bold hover:underline"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}