'use client';

import React, { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    const PASSWORD = process.env.NEXT_PUBLIC_ROUTE_PASSWORD || 'hacker'; // set in .env

    useEffect(() => {
        const stored = sessionStorage.getItem('route_auth');
        if (stored === PASSWORD) {
            setAuthorized(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === PASSWORD) {
            sessionStorage.setItem('route_auth', PASSWORD);
            setAuthorized(true);
        } else {
            alert('Incorrect password!');
        }
    };

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">🔐 Enter Password</h2>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700 mb-4"
                    />
                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded"
                    >
                        Enter
                    </button>
                </form>
            </div>
        );
    }

    return <>{children}</>;
}
