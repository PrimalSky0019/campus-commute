import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Car, ShoppingBag, ShieldAlert, ArrowRight, Heart, Users, Coffee } from 'lucide-react'

// --- MAIN LANDING PAGE COMPONENT ---
export default function LandingPage({ onGetStarted }) {
    return (
        <div className="min-h-screen bg-[#FDF8F0] text-[#1a1a1a] font-sans selection:bg-[#00C853] selection:text-white overflow-hidden">
            <Navbar onGetStarted={onGetStarted} />
            <HeroSection onGetStarted={onGetStarted} />
            <FeatureCards />
            <ImpactSection />
            <CTASection onGetStarted={onGetStarted} />
            <Footer />
        </div>
    )
}

// --- 1. NAVBAR ---
function Navbar({ onGetStarted }) {
    return (
        <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-multiply">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">CC</span>
                </div>
                <span className="font-bold text-lg tracking-tight">CampusCommute</span>
            </div>
            <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-[#1a1a1a] text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
                Login
            </button>
        </nav>
    )
}

// --- 2. HERO SECTION (Big Text + Pill Image) ---
function HeroSection({ onGetStarted }) {
    return (
        <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-[12vw] leading-[0.9] font-black tracking-tighter text-[#1a1a1a] mb-8">
                    Campus <br />
                    <span className="inline-flex items-center align-middle mx-2">
             {/* The "Pill" Image Placeholder */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '150px', opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-[10vw] w-[20vw] rounded-full bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center border-4 border-[#FDF8F0] mx-4"
                        ></motion.div>
          </span>
                    is Living.
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl md:text-2xl text-gray-500 max-w-2xl font-medium mb-12"
            >
                Travel together. Eat together. Stay safe together. <br/>
                The all-in-one platform for student life.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-4"
            >
                <button onClick={onGetStarted} className="px-8 py-4 bg-[#00C853] text-white rounded-full font-bold text-lg hover:bg-[#00b548] transition-colors flex items-center gap-2 shadow-lg shadow-green-200">
                    Get Started <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 bg-white text-[#1a1a1a] border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors">
                    How it Works ↗
                </button>
            </motion.div>
        </section>
    )
}

// --- 3. FEATURE CARDS (The 3 Big Cards) ---
function FeatureCards() {
    return (
        <section className="py-20 px-4 md:px-10">
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">

                {/* Card 1: Travel (Yellow) */}
                <FeatureCard
                    title="Travel Together"
                    desc="Find peers going to the airport or railway station. Split cabs and save money."
                    icon={<Car size={32} />}
                    bg="bg-[#FFF8E1]" // Light Yellow
                    btn="bg-[#FFD740]" // Dark Yellow
                    delay={0.1}
                />

                {/* Card 2: Delivery (Green - Main Focus) */}
                <FeatureCard
                    title="Group Orders"
                    desc="Ordering late night snacks? Start a pool and save on delivery fees instantly."
                    icon={<ShoppingBag size={32} />}
                    bg="bg-[#E8F5E9]" // Light Green
                    btn="bg-[#00C853]" // Dark Green
                    delay={0.2}
                    isTall={true} // Slightly taller for emphasis
                />

                {/* Card 3: Safety (Rose) */}
                <FeatureCard
                    title="Campus Safety"
                    desc="Emergency SOS and location sharing to keep the community secure."
                    icon={<ShieldAlert size={32} />}
                    bg="bg-[#FFEBEE]" // Light Red
                    btn="bg-[#FF5252]" // Red
                    delay={0.3}
                />

            </div>
        </section>
    )
}

function FeatureCard({ title, desc, icon, bg, btn, delay, isTall }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className={`${bg} p-8 rounded-[2.5rem] flex flex-col justify-between ${isTall ? 'md:-mt-10 md:mb-10 shadow-xl' : 'shadow-sm'}`}
        >
            <div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    {icon}
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">{desc}</p>
            </div>

            <button className={`w-14 h-14 ${btn} text-white rounded-full flex items-center justify-center mt-8 self-end transition-transform hover:scale-110`}>
                <ArrowRight size={24} />
            </button>
        </motion.div>
    )
}

// --- 4. IMPACT SECTION (Animated Counters) ---
function ImpactSection() {
    return (
        <section className="py-32 px-6 bg-white rounded-[3rem] mx-4 mb-20 shadow-sm">
            <div className="text-center max-w-4xl mx-auto mb-20">
                <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">Our Impact</span>
                <h2 className="text-5xl md:text-7xl font-black mt-6 tracking-tight text-[#1a1a1a]">
                    Together, We're Making <br/> Campus Smaller.
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 text-center">
                <StatCounter number="31,540" label="Rides Shared" color="text-[#00C853]" />
                <StatCounter number="214" label="Emergencies Resolved" color="text-[#FF5252]" />
                <StatCounter number="$12k+" label="Delivery Fees Saved" color="text-[#FFD740]" />
            </div>
        </section>
    )
}

function StatCounter({ number, label, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
        >
            <h3 className={`text-6xl md:text-8xl font-black ${color} mb-2`}>{number}</h3>
            <p className="text-xl font-bold text-gray-400">{label}</p>
        </motion.div>
    )
}

// --- 5. CTA SECTION (The Donation Form Style) ---
function CTASection({ onGetStarted }) {
    return (
        <section className="py-20 px-6 flex justify-center pb-32">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-[#FDF8F0] p-10 rounded-[3rem] max-w-2xl w-full border-4 border-white shadow-2xl shadow-orange-100/50"
            >
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-black mb-2">Ready to Join?</h3>
                    <p className="text-gray-500 font-medium">Select your role to get started.</p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <button className="flex-1 bg-white py-6 rounded-2xl font-bold text-lg border-2 border-transparent hover:border-[#00C853] shadow-sm transition-all text-left px-6 flex items-center gap-3">
                            <Users className="text-[#00C853]" /> Student
                        </button>
                        <button className="flex-1 bg-white py-6 rounded-2xl font-bold text-lg border-2 border-transparent hover:border-blue-500 shadow-sm transition-all text-left px-6 flex items-center gap-3">
                            <Coffee className="text-blue-500" /> Faculty
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-100">
                        <input type="checkbox" checked readOnly className="w-6 h-6 text-[#00C853] rounded focus:ring-0" />
                        <span className="font-medium text-gray-600">I agree to the Community Guidelines</span>
                    </div>

                    <button
                        onClick={onGetStarted}
                        className="w-full bg-[#1a1a1a] text-white py-6 rounded-2xl font-bold text-xl hover:scale-[1.02] transition-transform shadow-xl"
                    >
                        Create Account
                    </button>
                </div>

            </motion.div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="text-center pb-10 text-gray-400 font-medium text-sm">
            <p>© 2026 Campus Commute. Built with ❤️ for Students.</p>
        </footer>
    )
}