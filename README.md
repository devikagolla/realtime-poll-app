# Real-Time Poll Room App

A real-time polling application using React and Node.js with WebSockets. Users can create or join shared poll rooms, vote on one of two options (e.g., "Cats vs Dogs"), and view live results.

---

## 📁 Folder Structure

- `/client`: React frontend
- `/server`: NodeJS backend using WebSocket (no database)

---

## 🚀 Features

✅ Create or join a poll room using a code  
✅ Enter your name (unique per room)  
✅ Vote on a question with 2 options  
✅ See real-time vote counts update as others vote  
✅ Prevent re-voting and persist vote using `localStorage`  
✅ Countdown timer: voting ends after 60 seconds  
✅ Multiple users and rooms supported simultaneously

---

## 🧠 Vote State & Room Management

- The **backend stores room and vote state in memory** using a JavaScript object.
- Each room has:
  - A unique room code (e.g., `X7G2HL`)
  - A question and two voting options
  - A `users` map to track who has voted and for which option
  - A `timer` that disables voting after 60 seconds
- The **backend broadcasts** updated vote counts to all users in the room using WebSocket.

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js and npm
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/poll-room-app.git
cd poll-room-app
```
