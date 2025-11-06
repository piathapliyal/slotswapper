SlotSwapper is a peer-to-peer time-slot scheduling and swapping platform.
Users can create events in their personal calendar, mark certain events as swappable, view swappable slots from others, and request swaps.
When a swap is accepted, the system exchanges ownership of the two slots.

This project demonstrates full-stack development including authentication, stateful UI, API design, data modeling, and transaction-safe swap logic.

🧰 Tech Stack
Layer	Technology
Frontend:React (Vite), React Router, React Query, TailwindCSS
Backend:Node.js, Express.js
Database:MongoDB + Mongoose
Auth:JWT (Bearer Token)

📦 Features
**Core Functionality
User Signup + Login (JWT auth)
Create and manage personal calendar events
Mark events as SWAPPABLE
View other users’ swappable slots
Initiate swap requests
Accept / Reject incoming swap requests
Automatic calendar updates after swap acceptance

Swap Logic
Prevents multiple swaps while pending
Ensures both events are swappable
Ensures no user swaps with themselves
Atomically exchanges event ownership on accept

Data Models
name, email, password (hashed)

Event
title, startTime, endTime, status (BUSY | SWAPPABLE | SWAP_PENDING), owner


SwapRequest
requester, responder, mySlot, theirSlot, status (PENDING | ACCEPTED | REJECTED)



🛣 API Endpoints Summary
Method	Endpoint	Auth	Description
POST	: /api/auth/signup	
POST	: /api/auth/login	
GET   :	/api/events	✅	List my events
POST	: /api/events	✅	Create event
PATCH	:/api/events/:id	✅	Update event (e.g. mark swappable)
GET   :	/api/swappable-slots	✅	View others’ swappable slots
POST	: /api/swap-request	✅	Request a swap
GET	  :/api/requests/incoming	✅	View requests sent to me
GET	  : /api/requests/outgoing	✅	View requests I initiated
POST	 :/api/swap-response/:id	✅	Accept / reject swap


Run Locally

1) Clone Repo
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper

2) Backend Setup
cd backend
npm install

Create .env:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/slotswapper
JWT_SECRET=your_secret_here

Run backend:
npm run dev


3) Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend runs at:
http://localhost:5173


📝 Notes / Design Decisions

React Query was chosen for automatic UI updates after swaps.
Event ownership swap is atomic, preventing partial updates.
No third-party UI library was used to maintain code clarity.

🎯 Future Improvements

Real-time notifications (WebSockets)
Calendar grid UI
Conflict detection (overlapping time validation)
