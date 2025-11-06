
SlotSwapper is a peer-to-peer time-slot scheduling and swapping platform.
Users can create events in their personal calendar, mark certain events as swappable, view swappable slots from others, and request swaps.
When a swap is accepted, the system exchanges ownership of the two slots.

This project demonstrates full-stack development including authentication, stateful UI, API design, data modeling, and transaction-safe swap logic.

**Tech Stack**
Layer	Technology
Frontend	React (Vite), React Router, React Query, TailwindCSS
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Auth	JWT (Bearer Token)
Deployment	Render (API) + Vercel (UI)


**Features**
_Core Functionality_
User Signup + Login (JWT auth)
Create and manage personal calendar events
Mark events as SWAPPABLE
View other users’ swappable slots
Initiate swap requests
Accept / Reject incoming swap requests
Automatic calendar updates after swap acceptance

_Swap Logic_
Prevents multiple swaps while pending
Ensures both events are swappable
Ensures no user swaps with themselves
Atomically exchanges event ownership on accept



**Data Models**
_User_
name, email, password (hashed)

_Event_
title, startTime, endTime, status (BUSY | SWAPPABLE | SWAP_PENDING), owner

_SwapRequest_
requester, responder, mySlot, theirSlot, status (PENDING | ACCEPTED | REJECTED)



**API Endpoints Summary**

POST	  /api/auth/signup	
POST	  /api/auth/login	
GET	    /api/events	✅	List my events
POST	  /api/events	✅	Create event
PATCH	  /api/events/:id	✅	Update event (e.g. mark swappable)
GET   	/api/swappable-slots	✅	View others’ swappable slots
POST	  /api/swap-request	✅	Request a swap
GET	    /api/requests/incoming	✅	View requests sent to me
GET	    /api/requests/outgoing	✅	View requests I initiated
POST	  /api/swap-response/:id	✅	Accept / reject swap



**Run Locally**
1)_ Clone Repo_
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper

2)_ Backend Setup_
cd backend
npm install


_Create .env:_
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/slotswapper
JWT_SECRET=your_secret_here


Run backend:
npm run dev

3) _Frontend Setup_
cd ../frontend
npm install
npm run dev


Frontend runs at:
http://localhost:5173


**Postman Collection (API Testing)**

This project includes a ready-to-use Postman collection so reviewers can test the API quickly without manually constructing requests.
Import into Postman
Open Postman
Click Import

Select the two files:

1-slotswapper_postman_collection.json	    Contains all API endpoints (Auth, Events, Swaps)
2-slotswapper_local_environment.json	   Stores variables such as base_url, TOKEN, event IDs
Download Files




Collection: slotswapper_postman_collection.json
Environment: slotswapper_local_environment.json

**How to Use**
Import both files.
Select environment: SlotSwapper – Local
Run Auth → Login → this automatically saves your TOKEN for all requests.

Proceed to:
Create Events
Mark as Swappable
View Marketplace
Request Swap
Accept / Reject Swap

**Notes / Design Decisions**
React Query was chosen for automatic UI updates after swaps.
Event ownership swap is atomic, preventing partial updates.
No third-party UI library was used to maintain code clarity.

**Future Improvements**
Real-time notifications (WebSockets)
Calendar grid UI
Conflict detection (overlapping time validation)
