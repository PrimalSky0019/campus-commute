import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader } from 'lucide-react'
import { supabase } from '../../supabaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        let result
        if (isSignUp) {
            result = await supabase.auth.signUp({ email, password })
        } else {
            result = await supabase.auth.signInWithPassword({ email, password })
        }

        const { error } = result

        if (error) {
            setError(error.message)
        } else {
            if (isSignUp) {
                setError('')
                alert('Account created! Please check your email to verify (if required) or just switch to Login.')
                setIsSignUp(false)
            }
        }
        setLoading(false)
    }

    const inputVariants = {
        focus: { scale: 1.02 },
        blur: { scale: 1 }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
        >
            <motion.div 
                className="p-8 md:p-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-md border-2 border-gray-100"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-8"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00C853] to-[#00b548] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white font-bold text-xl">CC</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Campus Commute</h1>
                    <p className="text-gray-600 font-medium">
                        {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                    </p>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: error ? 1 : 0, height: error ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                >
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}
                </motion.div>

                {/* Form */}
                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    {/* Email Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Email Address</label>
                        <motion.div
                            className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#00C853] focus-within:bg-green-50/30 transition-all"
                            variants={inputVariants}
                        >
                            <Mail size={18} className="text-gray-500" />
                            <input
                                className="flex-1 bg-transparent outline-none text-[#1a1a1a] font-medium placeholder-gray-400"
                                type="email"
                                placeholder="you@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Password</label>
                        <motion.div
                            className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#00C853] focus-within:bg-green-50/30 transition-all"
                            variants={inputVariants}
                        >
                            <Lock size={18} className="text-gray-500" />
                            <input
                                className="flex-1 bg-transparent outline-none text-[#1a1a1a] font-medium placeholder-gray-400"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 text-white bg-gradient-to-r from-[#00C853] to-[#00b548] rounded-xl hover:shadow-xl shadow-lg disabled:opacity-50 font-bold transition-all flex items-center justify-center gap-2 mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                                    <Loader size={18} />
                                </motion.div>
                                Processing...
                            </>
                        ) : (
                            isSignUp ? 'Create Account' : 'Log In'
                        )}
                    </motion.button>
                </form>

                {/* Toggle Auth Mode */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center text-sm"
                >
                    <p className="text-gray-600 font-medium">
                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                        <motion.button
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError('')
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-[#00C853] font-bold hover:text-[#00b548] transition-colors underline"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </motion.button>
                    </p>
                </motion.div>

                {/* Divider */}
                <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.35 }}
                    className="my-6 flex items-center gap-3"
                >
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    <span className="text-xs text-gray-500 font-medium uppercase">or</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent"></div>
                </motion.div>

                {/* Footer Text */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-xs text-gray-500 font-medium"
                >
                    🔒 Your data is encrypted and secure
                </motion.p>
            </motion.div>
        </motion.div>
    )
}