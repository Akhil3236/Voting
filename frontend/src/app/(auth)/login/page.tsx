"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/api/host/login", { email, password });
            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '450px', margin: '60px auto' }}>
            <div className="card">
                <h2 className="card-title text-center" style={{ fontSize: '28px', marginBottom: '24px' }}>
                    Login to Your Account
                </h2>

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: '24px', color: '#6b7280' }}>
                    Don't have an account?{" "}
                    <Link href="/signup" style={{ color: '#4f46e5', fontWeight: '500' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
