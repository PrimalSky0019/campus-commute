import { supabase } from '../../supabaseClient'

export default function Dashboard({ session }) {
    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Welcome, Student!</h1>
                <p className="text-gray-600 mb-6">You are logged in as: <br/>
                    <span className="font-mono text-black">{session.user.email}</span>
                </p>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}