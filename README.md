# PollStream - Real-Time Voting Platform

PollStream is a full-stack real-time voting application built as a part of a coding assessment. It allows hosts to create and manage polls, while anyone with a shareable link can vote and watch results update instantly.

## 🚀 Features

- **Poll Creation**: Hosts can create polls with a question and at least 2 options.
- **Real-Time Results**: Voting results update in real-time for all connected clients using **Socket.io**.
- **Public Voting**: Anyone with a unique link can view and participate in a poll.
- **Host Dashboard**: A secure area for hosts to manage their polls, view results, and share links.
- **Fairness & Anti-Abuse**: Multi-layered mechanisms to prevent duplicate voting.

## 🛡️ Fairness / Anti-Abuse Mechanisms

To ensure data integrity and prevent abusive voting, PollStream implements two primary controls:

1.  **Device Fingerprinting (Local Identification)**:
    - Every voter is assigned a unique `voterId` which is stored in their browser's `localStorage` upon their first visit.
    - When a vote is cast, this ID is sent to the backend and stored in the poll's `voters` registry.
    - **What it prevents**: Prevents a user from simply refreshing the page or using multiple tabs to vote again in the same browser session.

2.  **IP Address Tracking**:
    - The backend captures the IP address of every voter using `req.ip` (and common proxy headers).
    - **What it prevents**: Prevents multiple votes coming from the same internet connection, making it significantly harder for a single person to skew results using multiple devices on the same network.

**Known Limitations**:
- Users can bypass these controls by using a VPN or clearing their browser's local storage.
- Users on public Wi-Fi (e.g., a university) might be limited if the IP address is shared.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io, MongoDB (Mongoose).
- **Real-Time**: WebSockets via Socket.io for bi-directional communication.
- **Authentication**: JWT (JSON Web Tokens) for host security.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a cloud instance)

### Backend Setup
1. Navigate to the `Backend` directory.
2. Create a `.env` file based on the environment needs (MONGO_URI, JWT_SECRET, PORT=4002).
3. Run `npm install`.
4. Run `npm run dev`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Create a `.env.local` file: `NEXT_PUBLIC_API_URL=http://localhost:4002`.
3. Run `npm install`.
4. Run `npm run dev`.

## 📈 Success Criteria Met
1. ✅ **Poll Creation**: Create polls with min 2 options and get shareable links.
2. ✅ **Join by Link**: Public access to polls via `poll/[id]` route.
3. ✅ **Real-Time Results**: Dynamic updates using Socket.io emitters.
4. ✅ **Fairness**: IP tracking + LocalStorage VoterID implemented.
5. ✅ **Persistence**: All data stored in MongoDB.
6. ✅ **Deployment Ready**: Standardised environment configuration.
