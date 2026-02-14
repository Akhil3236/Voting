"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link href="/" className="navbar-brand">
                    PollStream
                </Link>

                <div className="navbar-links">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="nav-link">
                                Login
                            </Link>
                            <Link href="/signup" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
