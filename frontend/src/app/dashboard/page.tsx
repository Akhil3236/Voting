"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
    const [polls, setPolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const { data } = await api.get("/api/poll/all");
            setPolls(data.polls);
        } catch (err) {
            console.error("Failed to fetch polls");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePoll = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/poll/create", {
                question,
                options: options.filter(o => o.trim()).map(text => ({ text }))
            });
            setShowModal(false);
            setQuestion("");
            setOptions(["", ""]);
            fetchPolls();
        } catch (err) {
            alert("Failed to create poll");
        }
    };

    const handleDeletePoll = async (id: string) => {
        if (confirm("Delete this poll?")) {
            try {
                await api.delete(`/api/poll/delete/${id}`);
                fetchPolls();
            } catch (err) {
                alert("Failed to delete poll");
            }
        }
    };

    const copyLink = (id: string) => {
        const link = `${window.location.origin}/poll/${id}`;
        navigator.clipboard.writeText(link);
        alert("Link copied!");
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Your Polls</h1>
                    <p style={{ color: '#6b7280' }}>Manage and track your polls</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    + Create Poll
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : polls.length === 0 ? (
                <div className="card text-center">
                    <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>No polls yet</h3>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>Create your first poll to get started</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        Create Poll
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {polls.map((poll) => (
                        <div key={poll._id} className="card">
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                                {poll.question}
                            </h3>

                            {poll.options.map((opt: any, i: number) => (
                                <div key={i} style={{ marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                    • {opt.text} ({opt.votes} votes)
                                </div>
                            ))}

                            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                                <Link href={`/poll/${poll._id}`} className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>
                                    View
                                </Link>
                                <button onClick={() => copyLink(poll._id)} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>
                                    Copy Link
                                </button>
                                <button onClick={() => handleDeletePoll(poll._id)} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '13px' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h2 className="card-title">Create New Poll</h2>
                        <form onSubmit={handleCreatePoll}>
                            <div className="form-group">
                                <label className="form-label">Question</label>
                                <input
                                    className="form-input"
                                    placeholder="What's your question?"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Options</label>
                                {options.map((opt, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            className="form-input"
                                            placeholder={`Option ${i + 1}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...options];
                                                newOpts[i] = e.target.value;
                                                setOptions(newOpts);
                                            }}
                                            style={{ flex: 1 }}
                                            required
                                        />
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOpts = options.filter((_, index) => index !== i);
                                                    setOptions(newOpts);
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                                                style={{
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    minWidth: '40px',
                                                    transition: 'all 0.2s'
                                                }}
                                                title="Delete this option"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setOptions([...options, ""])}
                                    style={{ color: '#4f46e5', fontSize: '14px', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    + Add option
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
