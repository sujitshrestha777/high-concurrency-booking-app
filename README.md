✈️ Real-Time Airline Booking Engine

A high-concurrency seat reservation system built using a distributed locking architecture.
This project ensures exactly-once booking using Redis locks, background job queues, and real-time synchronization.

🚀 Key Features
⚡ Real-Time Seat Map
Interactive UI with instant updates across all users using WebSockets.
🔒 Distributed Locking (No Double Booking)
Uses Redis SETNX to ensure only one user can reserve a seat at a time.
⏳ Automatic Seat Expiration
Seats are locked for a limited time (e.g., 10 minutes). If payment is not completed, they are automatically released.
💳 Secure Payment Integration
Full integration with Stripe using Payment Intents and webhook verification.
📦 Queue-Based Background Processing
Uses BullMQ to handle retries, failures, and delayed jobs.
🌐 Scalable Architecture
Separate services for frontend, backend, workers, and real-time communication.
🖼️ Screenshots
🎫 Seat Selection UI

🔄 Real-Time Updates

💳 Payment Flow

📌 Place your screenshots inside a /screenshots folder in your repo.

🏗️ System Design & Architecture

This system follows a Lock → Verify → Commit pattern to handle concurrency safely.

🔁 Architectural Flow
Seat Selection
User selects a seat → sent to backend
Seat Locking
Backend:
Locks seat in Redis (with TTL)
Adds delayed job to queue (for expiration)
Real-Time Sync
WebSocket broadcasts:
SEAT_LOCKED to all users
Payment
User completes payment via Stripe
Webhook Confirmation
Stripe sends webhook → backend verifies payment
Final Booking
Worker:
Stores booking in database
Removes Redis lock
Broadcast Update
WebSocket sends:
SEAT_BOOKED to all clients
🧠 Architecture Diagram

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js (App Router), Tailwind CSS
Backend	Node.js / Next.js API
Database	PostgreSQL + Prisma ORM
Cache	Redis
Queue	BullMQ
Real-Time	WebSocket (ws)
Payments	Stripe
Deployment	Vercel (Frontend), Railway (Backend & Workers)
🛠️ Local Setup & Installation
1️⃣ Clone Repository
git clone https://github.com/your-username/booking-system.git
cd booking-system
pnpm install
2️⃣ Environment Variables

Create a .env file:

DATABASE_URL="postgresql://user:pass@localhost:5432/db"
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
3️⃣ Database Setup
cd apps/web
npx prisma generate
npx prisma db push
4️⃣ Start Development
pnpm dev
⚠️ Concurrency & Safety Mechanisms
✅ Redis SETNX ensures only one lock per seat
✅ TTL prevents deadlocks (auto-release)
✅ Queue handles delayed expiration
✅ Database enforces final consistency
✅ Idempotent webhook handling prevents duplicate bookings
🔧 Troubleshooting
🪟 Windows Issues (EPERM / Lock Errors)
taskkill /f /im node.exe

Then delete .next:

Remove-Item -Recurse -Force .next
🔌 WebSocket Issues
Ensure:
Local: ws://localhost:8080
Production: your deployed WebSocket URL
📚 Learning & Concepts Covered

This project demonstrates:

Distributed Systems Design
Concurrency Control (Double Booking Problem)
Event-Driven Architecture
Background Job Processing
Real-Time Systems
Payment Integration
🎯 Why This Project Matters

Most booking systems fail under concurrency.
This system is designed to handle:

High traffic
Race conditions
Payment reliability

👉 Making it closer to real-world production systems like airline or ticket platforms.
