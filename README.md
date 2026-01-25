# 🎓 Campus Commute

**Campus Life, Simplified.** A unified platform for students to coordinate travel plans, pool delivery orders, and help one another. Built with React, Supabase, and modern animations.

![Project Status](https://img.shields.io/badge/Status-Active_Development-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🚗 **Travel Feed (Carpooling)**
- Students can post their travel plans (Origin, Destination, Time).
- View real-time listings of peers traveling to the same place (e.g., Airport, Railway Station).
- Filter by transport mode (Cab, Auto, Bus).

### 🍔 **Delivery Board (Group Orders)**
- Start a "Pool" for orders from Zomato, Blinkit, or Domino's.
- Others can add their items to the active order.
- Reduces delivery fees and minimum order anxiety.

### 🎨 **Modern Experience**
- **Authentication:** Secure Email/Password login via Supabase.
- **Glassmorphism UI:** Beautiful frosted-glass cards and modern gradients.
- **Animations:** Smooth entry and hover effects using Framer Motion.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/campus-commute.git](https://github.com/YOUR_USERNAME/campus-commute.git)
cd campus-commute
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add your Supabase keys:

Code snippet
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
4. Database Setup (Supabase)
Go to your Supabase SQL Editor and run these commands to create the necessary tables:

SQL
-- 1. Travel Plans Table
create table public.travel_plans (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  origin text not null,
  destination text not null,
  travel_time text not null,
  mode text not null
);

-- 2. Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  platform text not null,
  location text not null,
  status text default 'Open'
);

-- 3. Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  user_email text not null,
  item_name text not null
);

-- Enable RLS (Security)
alter table public.travel_plans enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Allow public access (Simplest for demo purposes)
create policy "Public Access" on public.travel_plans for select using (true);
create policy "Public Insert" on public.travel_plans for insert with check (true);
-- (Repeat similar policies for orders and order_items)
5. Run the App
Bash
npm run dev
Open http://localhost:5173 to view it in the browser.

🤝 Contributing
Contributions are welcome!

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Developed with ❤️ by [Your Name]

### **One Last Step: Push the README**
Once you save this file, run these commands in your terminal to update your GitHub page:

```bash
git add README.md
git commit -m "Added professional documentation"
git push origin master