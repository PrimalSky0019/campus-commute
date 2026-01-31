# 🚀 Campus Commute
> The all-in-one smart mobility and safety platform for students.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**🔴 Live Demo:** [https://campus-commute-woad.vercel.app/](https://campus-commute-woad.vercel.app/)

Markdown
<div align="center">

# 🎓 Campus Commute

**Campus Life, Simplified.** *A unified platform for students to coordinate travel plans, pool delivery orders, and help one another.*

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
  </p>

[**View Demo**](https://campus-commute-woad.vercel.app/) </div>

---

## ✨ Features

### 🚗 **Travel Feed (Carpooling)**
* **Post Plans:** Share your Origin, Destination, and Time.
* **Real-time Matching:** Instantly see peers traveling to the same place (e.g., Airport, Railway Station).
* **Smart Filters:** Sort by transport mode (Cab, Auto, Bus).

### 🍔 **Delivery Board (Group Orders)**
* **Start a Pool:** Initiate group orders for Zomato, Blinkit, or Domino's.
* **Collaborate:** Peers can add their specific items to your active order.
* **Save Money:** Split delivery fees and conquer minimum order values together.

### 🎨 **Modern Experience**
* **Authentication:** Secure Email/Password login powered by **Supabase Auth**.
* **Glassmorphism UI:** Trendy frosted-glass aesthetics with gradient backgrounds.
* **Animations:** Smooth entry, hover, and transition effects using **Framer Motion**.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React + Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

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
Go to your Supabase SQL Editor and run these commands:

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

-- Enable Row Level Security
alter table public.travel_plans enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies (Adjust for production)
create policy "Public Access" on public.travel_plans for select using (true);
create policy "Public Insert" on public.travel_plans for insert with check (true);
create policy "Read orders" on public.orders for select using (true);
create policy "Create orders" on public.orders for insert with check (true);
create policy "Read items" on public.order_items for select using (true);
create policy "Add items" on public.order_items for insert with check (true);
5. Run the App
Bash
npm run dev
Open http://localhost:5173 to view it in the browser.

🤝 Contributing
Contributions are always welcome!

Fork the project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
This project is protected under the MIT License. See the LICENSE file for more information.

<div align="center"> <sub>Developed with ❤️ by <a href="https://www.google.com/search?q=https://github.com/YOUR_USERNAME">Your Name</a></sub> </div>


### **Final Step: Save & Push**

Run these commands in your WebStorm terminal to send this beautiful new README to GitHub:

```bash
git add README.md
git commit -m "Updated README with professional badges and formatting"
git push origin master
