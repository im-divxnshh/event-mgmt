'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { auth, db } from '@/utils/firebase';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeNav, setActiveNav] = useState<string>('#home');

    const navItems = [
        { label: 'Home', href: '#home' },
        { label: 'Events', href: '#events' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (showModal || menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal, menuOpen]);

    const registerUser = async (email: string, password: string, name: string) => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name,
            email,
            createdAt: new Date().toISOString(),
        });

        return userCred;
    };

    const loginUser = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logoutUser = () => {
        signOut(auth);
    };

    const getFriendlyMessage = (code: string): string => {
        const map: Record<string, string> = {
            'auth/email-already-in-use': 'This email is already in use. Try logging in.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-not-found': 'No user found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/missing-password': 'Password is required.',
        };
        return map[code] || 'Something went wrong. Please try again.';
    };

    const handleSubmit = async () => {
        if (!email || !password || (isRegistering && !name)) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        try {
            if (isRegistering) {
                const userCred = await registerUser(email, password, name);
                console.log(userCred)
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome aboard!',
                    text: `Hi ${name.split(' ')[0]}, your account has been created.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                await loginUser(email, password);
                Swal.fire({
                    icon: 'success',
                    title: 'Login successful!',
                    text: 'Welcome back!',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            setShowModal(false);
            setEmail('');
            setPassword('');
            setName('');
            setShowPassword(false);
       } catch (error: unknown) {
    const errorCode = (error as { code?: string })?.code || 'unknown-error';

    Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: getFriendlyMessage(errorCode),
    });
}
    };

  useEffect(() => {
    const handleScroll = () => {
        const sections = navItems.map((item) =>
            document.querySelector(item.href) as HTMLElement | null
        );

        const scrollPos = window.scrollY + 100;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (
                section &&
                section.offsetTop <= scrollPos &&
                section.offsetTop + section.clientHeight > scrollPos
            ) {
                setActiveNav(navItems[i].href);
                break;
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);


    return (
        <>
            <nav className="bg-white shadow-md fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        Eventify
                    </Link>

                    <div className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => {
                                    setMenuOpen(false);
                                    setActiveNav(item.href);
                                }}
                                className={`cursor-pointer transition border-b-2 ${activeNav === item.href
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-600 border-transparent hover:text-blue-600'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 cursor-pointer">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logoutUser}
                                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-200 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(true)} className="cursor-pointer text-black">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white z-50 shadow-lg px-6 py-8 space-y-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center">
                                <Link href="/" className="text-xl font-bold text-blue-600">
                                    Eventify
                                </Link>
                                <button onClick={() => setMenuOpen(false)}>
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-4">
                                {navItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setActiveNav(item.href);
                                        }}
                                        className="text-gray-700 hover:text-blue-600"
                                    >
                                        {item.label}
                                    </a>
                                ))}

                                {user ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMenuOpen(false)}
                                            className="text-gray-700 hover:text-blue-600"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logoutUser();
                                                setMenuOpen(false);
                                            }}
                                            className="text-red-500 hover:text-red-600 text-left"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowModal(true);
                                            setMenuOpen(false);
                                        }}
                                        className="text-blue-600 hover:text-blue-700 text-left"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 space-y-6 relative"
                    >
                        <h2 className="text-2xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
                            {isRegistering ? <><UserPlus className="w-5 h-5" /> Create Account</> : <><LogIn className="w-5 h-5" /> Sign In</>}
                        </h2>

                        {isRegistering && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition duration-200 cursor-pointer"
                        >
                            {isRegistering ? 'Register' : 'Login'}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                                {isRegistering ? 'Login' : 'Register'}
                            </button>
                        </p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-red-500 transition duration-200 cursor-pointer"
                        >
                            <X />
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default Navbar;
