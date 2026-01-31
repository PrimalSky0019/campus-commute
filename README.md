<div align="center">

# 🎓 Campus Commute
### The All-in-One Smart Campus Network

**Connect. Commute. Stay Safe.** *A unified platform for students to share rides, pool deliveries, and ensure campus safety.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<h3>
  <a href="https://campus-commute-woad.vercel.app/">🔴 View Live Demo</a>
  <span> | </span>
  <a href="#-installation--setup">🛠️ Installation Guide</a>
</h3>

</div>

---

## 💡 About The Project

**Campus Commute** solves the fragmentation of student life. Instead of messy WhatsApp groups for rides and deliveries, we provide a centralized, real-time dashboard. 

It features an **Apple-inspired UI** (glassmorphism, clean typography) and a **Live Activity Map** to visualize campus movement instantly.

---

## ✨ Key Features

### 🚗 **Smart Travel Feed (Ride Sharing)**
* **Live Activity Map:** Visualizes active trips and trending destinations with pulsing markers.
* **Sticky Smart Layout:** Optimized UX where the "Post Trip" form stays fixed while you scroll the feed.
* **Real-time Matching:** Instantly find peers heading to the Airport, Railway Station, or City Mall.

### 🚨 **Guardian SOS Network (Safety)**
* **One-Tap SOS:** Instantly broadcasts a distress signal to the network.
* **Live Incident Feed:** Real-time tracking of medical, safety, or lost-item alerts.
* **Geo-Tagging:** Auto-generates Google Maps coordinates for immediate assistance.

### 🍔 **Delivery Pooling**
* **Group Orders:** Combine orders for Zomato/Blinkit to save on delivery fees.
* **Real-time Status:** Track who is ordering from where (Canteen, Night Mess, etc.).

---

## 📸 Interface

| **Live Dashboard** | **Emergency SOS** |
|:---:|:---:|
| <img src="screenshots/dashboard.png" width="400" alt="Dashboard"> | <img src="screenshots/sos.png" width="400" alt="SOS"> |
| *Interactive map & trending rides* | *One-tap safety alerts* |

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Vite
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/PrimalSky0019/campus-commute.git](https://github.com/PrimalSky0019/campus-commute.git)
cd campus-commute
2. Install Dependencies
Bash
npm install
3. Environment Variables
Create a .env file in the root directory and add your Supabase keys:

Code snippet
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
4. Database Setup (Supabase SQL)
Go to your Supabase SQL Editor and paste the following to set up the backend:

SQL
-- 1. Travel Plans Table
create table public.travel_plans (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  origin text not null,
  destination text not null,
  travel_time text not null,
  mode text not null,
  seats_available int default 3,
  status text default 'Open'
);

-- 2. Emergencies Table (New!)
create table public.emergencies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  type text not null, -- 'SOS', 'Medical', etc.
  description text,
  latitude float,
  longitude float,
  is_sos boolean default false,
  status text default 'Active'
);

-- 3. Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  shop_name text not null,
  items text not null,
  status text default 'Open'
);

-- Enable Realtime
alter publication supabase_realtime add table travel_plans;
alter publication supabase_realtime add table emergencies;
alter publication supabase_realtime add table orders;
5. Run the App
Bash
npm run dev
🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

👤 Author
PrimalSky0019 - GitHub: @PrimalSky0019

<div align="center"> <sub>Built with ❤️ for Students. If you like this project, please give it a ⭐!</sub> </div>
