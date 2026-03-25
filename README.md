# ✈️ Real-Time Airline Booking Engine

A high-concurrency seat reservation system built using a distributed locking architecture.  
This project ensures **exactly-once booking** using Redis locks, background job queues, and real-time synchronization.

---

## 🚀 Key Features

- ⚡ Real-Time Seat Map  
  Interactive UI with instant updates across all users using WebSockets.

- 🔒 Distributed Locking (No Double Booking)  
  Uses Redis `SETNX` to ensure only one user can reserve a seat at a time.

- ⏳ Automatic Seat Expiration  
  Seats are locked for a limited time (e.g., 3 minutes). If payment is not completed, they are automatically released.

- 💳 Secure Payment Integration  
  Full integration with Stripe using Payment Intents and webhook verification.

- 📦 Queue-Based Background Processing  
  Uses BullMQ to handle retries, failures, and delayed jobs.

- 🌐 Scalable Architecture  
  Separate services for frontend, backend, workers, and real-time communication.

---

## 🖼️ Screenshots

### 🎫 Seat Selection UI
![Seat Selection](./screenshots/seat-selection.png)

### 🔄 Real-Time Updates
![Realtime Updates](./screenshots/realtime.png)

### 💳 Payment Flow
![Payment Flow](./screenshots/payment.png)

> Place your screenshots inside a `/screenshots` folder.

---

## 🏗️ System Design & Architecture

This system follows a **Lock → Verify → Commit** pattern to handle concurrency safely.

---

### 🔁 Architectural Flow

1. **Seat Selection**  
   User selects a seat → request sent to backend

2. **Seat Locking**  
   Backend:
   - Locks seat in Redis (with TTL)
   - Adds delayed job to queue for expiration

3. **Real-Time Sync**  
   WebSocket broadcasts `SEAT_LOCKED` event to all clients

4. **Payment**  
   User completes checkout using Stripe

5. **Webhook Confirmation**  
   Stripe sends webhook → backend verifies payment

6. **Final Booking**  
   Worker:
   - Stores booking in database
   - Removes Redis lock

7. **Broadcast Update**  
   WebSocket sends `SEAT_BOOKED` to all users

---

## 🧠 Architecture Diagram

![Architecture](./screenshots/architecture.png)

---

## 🛠️ Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | Next.js (App Router), Tailwind CSS |
| Backend      | Node.js / Next.js API |
| Database     | PostgreSQL + Prisma ORM |
| Cache        | Redis |
| Queue        | BullMQ |
| Real-Time    | WebSocket (`ws`) |
| Payments     | Stripe |
| Deployment   | Vercel (Frontend), Railway (Backend & Workers) |

---

## 🛠️ Local Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/booking-system.git
cd booking-system
pnpm install
