import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

// The word "default" was missing here!
export default function TravelFeed({ session }) {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)

    // Form State
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [time, setTime] = useState('')
    const [mode, setMode] = useState('Cab')

    // 1. Fetch trips from Supabase
    const fetchPlans = async () => {
        const { data, error } = await supabase
            .from('travel_plans')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setPlans(data)
    }

    // Load trips when the component opens
    useEffect(() => {
        fetchPlans()
    }, [])

    // 2. Handle "Post Trip"
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('travel_plans')
            .insert([
                {
                    user_email: session.user.email,
                    origin,
                    destination,
                    travel_time: time,
                    mode
                }
            ])

        if (error) {
            alert('Error posting trip!')
            console.error(error)
        } else {
            // Clear form and refresh list
            setOrigin('')
            setDestination('')
            fetchPlans()
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto p-4">
            {/* --- The Form --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Post a Travel Plan</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        placeholder="From (e.g. Hostel 1)"
                        className="border p-2 rounded"
                        value={origin} onChange={e => setOrigin(e.target.value)} required
                    />
                    <input
                        placeholder="To (e.g. Airport)"
                        className="border p-2 rounded"
                        value={destination} onChange={e => setDestination(e.target.value)} required
                    />
                    <input
                        placeholder="Time (e.g. 5:00 PM)"
                        className="border p-2 rounded"
                        value={time} onChange={e => setTime(e.target.value)} required
                    />
                    <select
                        className="border p-2 rounded bg-white"
                        value={mode} onChange={e => setMode(e.target.value)}
                    >
                        <option>Cab</option>
                        <option>Auto</option>
                        <option>Walking</option>
                        <option>Bus</option>
                    </select>

                    <button disabled={loading} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        {loading ? 'Posting...' : 'Share Plan'}
                    </button>
                </form>
            </div>

            {/* --- The Feed --- */}
            <h3 className="text-lg font-bold mb-4">Recent Plans</h3>
            <div className="space-y-4">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg">{plan.origin} ➝ {plan.destination}</p>
                                <p className="text-gray-600">⏰ {plan.travel_time} • 🚗 {plan.mode}</p>
                            </div>
                            <span className="text-xs bg-gray-100 p-1 rounded text-gray-500">
                {plan.user_email.split('@')[0]}
              </span>
                        </div>
                    </div>
                ))}
                {plans.length === 0 && <p className="text-gray-500 text-center">No active plans yet.</p>}
            </div>
        </div>
    )
}