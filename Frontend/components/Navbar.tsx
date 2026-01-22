"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const linkClass = (path: string) =>
    pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          Deepfake Detector
        </Link>

        <nav className="navbar-links">
          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
          <Link href="/how-it-works" className={linkClass("/how-it-works")}>
            How It Works
          </Link>

          {user && (
            <>
              <Link href="/detect" className={linkClass("/detect")}>
                Detect
              </Link>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link href="/signup" className={linkClass("/signup")}>
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
