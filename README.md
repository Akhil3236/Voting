# Full-Stack Assignment: Real-Time Poll Rooms

*Candidate Submission*


- **Live Demo**: `https://vote.trackur.org` ✅
---

##  Objective

Build a web application that lets someone create a poll, share it via a link, and collect votes while results update in real-time for all viewers. The goal is to deliver a working product with full-stack capabilities including frontend, backend, database, and real-time communication.

---

##  Required Features (Success Criteria)

### 1. Poll Creation
- A user must be able to create a poll with a question and at least 2 options.
- After creation, the app must generate a shareable link to that poll.
- **Implementation**: Host authentication using JWT, poll creation API endpoint, MongoDB persistence.

### 2. Join by Link
- Anyone with the share link must be able to view the poll and vote on one option (single-choice).
- **Implementation**: Public poll viewing route `/poll/[id]`, no authentication required for voters.

### 3. Real-Time Results
- When any user votes, all other users viewing that poll must see results update without manually refreshing the page.
- **Implementation**: Socket.io WebSocket integration with event-based broadcasting.

### 4. Fairness / Anti-Abuse
The app must include **at least two mechanisms** that reduce repeat/abusive voting:

**Implemented Mechanisms:**

1. **Device Fingerprinting (localStorage VoterID)**
   - Every voter is assigned a unique `voterId` stored in browser's `localStorage`
   - Prevents: Multiple votes from same browser/tab by refreshing
   - Limitation: Can be bypassed by clearing localStorage or using incognito mode

2. **Device-Based Tracking (Removed IP Restriction)**
   - ~~IP Address Tracking~~ (Removed due to false positives on shared networks)
   - Now relies solely on device-specific `voterId` for fairness
   - Prevents: Same device voting multiple times
   - Allows: Multiple people on same WiFi network to vote separately

**Known Limitations:**
- Users can bypass by clearing browser storage
- VPN usage allows multiple votes from different "devices"
- Trade-off made to allow legitimate multiple users on same network

### 5. Persistence
- Polls and votes must be persisted so that refreshing the page does not lose the poll or votes.
- The share link must still work later (not only for the current session).
- **Implementation**: MongoDB database with Mongoose ODM.

### 6. Deployment
- Share a publicly accessible URL where the app can be used.
- **Live Demo**: `https://vote.trackur.org` ✅

---

##  Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Real-Time**: Socket.io Client
- **Styling**: Vanilla CSS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-Time**: Socket.io Server
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: dotenv for configuration

### Real-Time Communication
- **Protocol**: WebSockets via Socket.io
- **Events**: Bidirectional event-based communication
- **Broadcasting**: Poll updates sent to all connected clients

---

##  Getting Started

### Prerequisites
```bash
Node.js v18+
MongoDB (local or cloud instance)
npm or yarn
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following:
```env
PORT=4002
MONGO_DB_URL="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
JWT_Expire=1hr
saltRounds=10
```

4. Start the backend server:
```bash
node index.js
```

**Expected Output:**
```
Server is running on port 4002
MongoDB connected
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:4002"
```

4. Start the development server:
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.6 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.1.9:3000
✓ Ready in 1049ms
```

---

##  Project Structure

```
Voting/
├── Backend/
│   ├── controllers/
│   │   ├── Hostauth.controller.js    # Host authentication logic
│   │   └── poll.controller.js        # Poll CRUD and voting logic
│   ├── Model/
│   │   ├── Host.model.js             # Host schema
│   │   └── poll.model.js             # Poll schema with voters tracking
│   ├── routes/
│   │   ├── Hostauth.route.js         # Auth routes
│   │   ├── poll.host.route.js        # Protected poll routes
│   │   └── poll.public.route.js      # Public poll routes
│   ├── middleware/
│   │   └── auth.middleware.js        # JWT verification
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   └── index.js                      # Express + Socket.io server
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/           # Host login page
│   │   │   │   └── signup/          # Host signup page
│   │   │   ├── dashboard/           # Host dashboard (protected)
│   │   │   ├── poll/[id]/           # Public poll voting page
│   │   │   ├── layout.tsx           # Root layout with navbar
│   │   │   └── page.tsx             # Landing page
│   │   ├── components/
│   │   │   └── Navbar.tsx           # Navigation component
│   │   └── lib/
│   │       └── api.ts               # Axios + Socket.io config
│   └── .env.local                   # Environment variables
```

---

##  Implementation Details

### Database Schema

**Poll Model:**
```javascript
{
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  voters: [
    {
      ip: String,
      deviceId: String
    }
  ],
  host: { type: ObjectId, ref: "Host" },
  createdAt: { type: Date, default: Date.now }
}
```

**Host Model:**
```javascript
{
  username: String,
  email: { type: String, unique: true },
  password: String (hashed with bcrypt)
}
```

### API Endpoints

**Public Routes:**
- `GET /api/public/poll/:id` - Get poll details
- `POST /api/public/poll/:id/vote` - Submit a vote

**Protected Routes (JWT Required):**
- `POST /api/poll/create` - Create new poll
- `GET /api/poll/all` - Get all polls by host
- `PUT /api/poll/edit/:id` - Edit poll
- `DELETE /api/poll/delete/:id` - Delete poll

**Authentication:**
- `POST /api/host/signup` - Register new host
- `POST /api/host/login` - Login and get JWT token

### Real-Time Flow

1. **Vote Submission**:
   - Client sends vote via POST request
   - Backend validates and updates database
   - Backend emits Socket.io event: `pollUpdate:${pollId}`
   - All connected clients listening to that event receive updated poll data

2. **Socket.io Events**:
```javascript
// Backend emits
socket.emit(`pollUpdate:${pollId}`, updatedPoll);

// Frontend listens
socket.on(`pollUpdate:${pollId}`, (data) => {
  setPoll(data);
});
```

---

##  Success Criteria - Completion Status

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| 1. Poll Creation | ✅ Complete | Dashboard with modal, min 2 options, shareable link generation |
| 2. Join by Link | ✅ Complete | `/poll/[id]` route, public access, single-choice voting |
| 3. Real-Time Results | ✅ Complete | Socket.io bidirectional events, instant updates for all viewers |
| 4. Fairness/Anti-Abuse | ✅ Complete | Device fingerprinting via localStorage voterId |
| 5. Persistence | ✅ Complete | MongoDB with Mongoose, all data persisted |
| 6. Deployment | ✅ Complete | Live at https://vote.trackur.org, publicly accessible |

---

##  Testing the Application

### Test Scenario 1: Create and Share Poll
1. Navigate to `https://vote.trackur.org`
2. Click "Sign Up" and create a host account
3. Login with credentials
4. In Dashboard, click "Create Poll"
5. Add question and minimum 2 options
6. Click "Create" button
7. Copy the generated link
8. Share link with others

### Test Scenario 2: Real-Time Voting
1. Open poll link in **Browser 1**
2. Open same poll link in **Browser 2** (or different device)
3. Vote in Browser 1
4. Observe Browser 2 updates **without refresh**
5. Check vote counts increment in real-time

### Test Scenario 3: Fairness Mechanism
1. Vote in a poll
2. Try to vote again in same browser
3. Expected: "You have already voted in this poll" error
4. Open same poll in **incognito/private mode**
5. Able to vote (different device fingerprint)
6. Open poll on **different phone** (same WiFi)
7. Able to vote (different device, even with same IP)

---

##  Known Issues & Future Improvements

### Current Limitations
- No email verification for host signup
- No poll expiration/closing mechanism
- No edit functionality after poll creation (delete only)
- No vote export/analytics dashboard
- No mobile-optimized UI (responsive but not optimized)

### Future Enhancements
- Add poll editing with option to close polls
- Implement vote analytics and export to CSV
- Add poll categories and search functionality
- Implement rate limiting for API endpoints
- Add social sharing preview cards (OG tags)
- Create admin panel for monitoring
- Add email notifications for poll creators
- Implement poll templates

---


---

##  Developer Notes

### Why Device-Only Tracking?
Initially implemented both IP and device tracking. However, IP-based blocking caused issues where multiple legitimate users on the same network (e.g., family, office, school) were prevented from voting. The decision was made to prioritize user experience over strict controls, as the device fingerprinting provides sufficient protection for most use cases.

### Socket.io + HTTP Response
The application uses a hybrid approach:
- Vote endpoint returns updated poll data in HTTP response
- Backend also emits Socket.io event with same data
- Frontend updates from HTTP response immediately
- Socket.io provides redundancy and powers real-time updates for other viewers

This ensures UI updates even if Socket.io connection fails temporarily.

---

**Assignment Status**: ✅ **COMPLETE**  
**Submission Date**: February 15, 2026  
**Live Demo Available**: `https://vote.trackur.org`
