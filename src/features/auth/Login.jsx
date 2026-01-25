import { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.error_description || error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h1 className="mb-4 text-2xl font-bold text-center text-blue-600">Campus Commute</h1>
                <p className="mb-6 text-center text-gray-500">Sign in via Magic Link</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        className="p-3 border rounded"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="p-3 text-white bg-blue-600 rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </button>
                </form>
            </div>
        </div>
    )
}