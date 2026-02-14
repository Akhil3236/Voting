import Link from "next/link";

export default function Home() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px', color: '#1f2937' }}>
        Real-Time Polling Made Simple
      </h1>
      <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '40px' }}>
        Create polls, share links, and watch results update in real-time.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link href="/signup" className="btn btn-primary" style={{ fontSize: '18px', padding: '14px 32px' }}>
          Get Started
        </Link>
        <Link href="/login" className="btn btn-secondary" style={{ fontSize: '18px', padding: '14px 32px' }}>
          Login
        </Link>
      </div>

      <div className="grid grid-cols-3" style={{ marginTop: '80px', gap: '40px' }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>✨ Real-Time</h3>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Results update instantly for all viewers without refreshing.
          </p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>🔒 Fair Voting</h3>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            IP tracking and device fingerprinting prevent duplicate votes.
          </p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>🔗 Easy Sharing</h3>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Get a unique link for each poll to share anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
