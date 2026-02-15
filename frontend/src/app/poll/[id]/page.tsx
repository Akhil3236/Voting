"use client";

import { useEffect, useState, use } from "react";
import { api, socket, getVoterId } from "@/lib/api";

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const pollId = resolvedParams.id;
    const [poll, setPoll] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPoll();

        // Socket connection event listeners
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error(' Socket connection error:', error);
        });

        const eventName = `pollUpdate:${pollId}`;
        socket.on(eventName, (updatedPoll) => {
            console.log(' Real-time poll update received:', updatedPoll);
            setPoll(updatedPoll);
        });

        return () => {
            socket.off(eventName);
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, [pollId]);

    const fetchPoll = async () => {
        try {
            const { data } = await api.get(`/api/public/poll/${pollId}`);
            setPoll(data.poll);

            const voterId = getVoterId();
            if (data.poll.voters.some((v: any) => v.deviceId === voterId)) {
                setVoted(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Poll not found");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedOption) return;

        try {
            const voterId = getVoterId();
            console.log('🗳️ Voting with:', { pollId, optionId: selectedOption, voterId });

            const response = await api.post(`/api/public/poll/${pollId}/vote`, {
                optionId: selectedOption,
                voterId: voterId
            });

            console.log('✅ Vote successful:', response.data);

            // Update the poll state immediately with the response
            if (response.data.success && response.data.poll) {
                setPoll(response.data.poll);
            }

            setVoted(true);
            setError(""); // Clear any previous errors
        } catch (err: any) {
            console.error('❌ Vote failed:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.error || "Failed to vote");
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (error && !poll) return <div className="container"><div className="alert alert-error">{error}</div></div>;

    const totalVotes = poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0);

    return (
        <div className="container" style={{ maxWidth: '700px', margin: '40px auto' }}>
            <div className="card">
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{poll.question}</h1>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>{totalVotes} total votes</p>

                {error && <div className="alert alert-error">{error}</div>}

                <div>
                    {poll.options.map((option: any) => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                        return (
                            <div key={option._id} style={{ marginBottom: '16px' }}>
                                {voted ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                                            <span style={{ fontWeight: '500' }}>{option.text}</span>
                                            <span style={{ color: '#6b7280' }}>{option.votes} votes ({percentage}%)</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className={`vote-option ${selectedOption === option._id ? 'selected' : ''}`}
                                        onClick={() => setSelectedOption(option._id)}
                                    >
                                        <span>{option.text}</span>
                                        {selectedOption === option._id && <span style={{ fontWeight: '700', color: '#4f46e5' }}>✓</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {!voted && (
                    <button
                        onClick={handleVote}
                        disabled={!selectedOption}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '24px' }}
                    >
                        Submit Vote
                    </button>
                )}

                {voted && (
                    <div className="alert alert-success" style={{ marginTop: '24px' }}>
                        ✓ Your vote has been recorded! Results update in real-time.
                    </div>
                )}
            </div>
        </div>
    );
}
