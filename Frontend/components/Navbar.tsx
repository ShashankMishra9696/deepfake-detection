"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navLink = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${
       pathname === path
         ? "text-cyan-400 underline underline-offset-4"
         : "text-gray-200 hover:text-white hover:underline hover:underline-offset-4"
     }`;

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="bg-gradient-to-r from-[#060B1A] via-[#0B1228] to-[#060B1A] backdrop-blur border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-semibold tracking-wide text-white"
            >
              Deepfake Detector
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {/* Public */}
              <Link href="/about" className={navLink("/about")}>
                About
              </Link>
              <Link
                href="/how-it-works"
                className={navLink("/how-it-works")}
              >
                How It Works
              </Link>

              {user ? (
                <>
                  {/* Protected */}
                  <Link
                    href="/detect"
                    className={navLink("/detect")}
                  >
                    Detect
                  </Link>
                  <Link
                    href="/dashboard"
                    className={navLink("/dashboard")}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className={navLink("/profile")}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="ml-2 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={navLink("/login")}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={navLink("/signup")}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
