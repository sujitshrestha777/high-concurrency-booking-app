"use client";

import { useEffect, useState } from "react";
import {
  MonitorCog,
  UserPen,
  LogOut,
  UserRoundPlus,
  Router,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserDetails } from "lib/auth/getUserDetail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleSignOut } from "lib/auth/handleSignOut";
import { handleGoogleSignIn } from "lib/auth/handleGoogleSignIn";
import { useLock } from "context/SeatLockcontext";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogging, setIslogging] = useState(false);
  const { lock, loading: seatlockloading } = useLock();
  const router = useRouter();

  const onLogin = async () => {
    setIslogging(true);
    try {
      await handleGoogleSignIn();
    } catch (error) {
      setIslogging(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await handleSignOut();
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const details = await getUserDetails();
        console.log("getdetails:", details);
        if (details?.user) {
          setUser(details.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="border-b bg-black text-white backdrop-blur sticky h-16 top-0 z-50">
      <div className="container flex px-6 md:px-32 py-1 items-center justify-between mx-auto">
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">BookIt</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              Home
            </Link>
            <Link
              href="/booking"
              className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              Book Seats
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/booking/myseats")}
            className="relative flex flex-col items-center justify-center p-1 rounded-md 
             bg-gradient-to-b from-zinc-900 to-zinc-800 
             border border-zinc-700 hover:border-amber-300 
             hover:shadow-lg transition-all duration-300 group w-13 h-13"
            title={lock.length > 0 ? "You have a held seat" : "No active hold"}
          >
            {/* Locked badge */}
            {lock.length > 0 && (
              <div
                className="absolute -top-1 -right-1 bg-amber-400 text-zinc-900 
                    rounded-full px-1.5 py-0.5 text-[10px] font-bold 
                    shadow-md border border-zinc-900 animate-pulse"
              >
                {lock.length}
              </div>
            )}

            {/* Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-amber-300 group-hover:text-amber-400 transition-colors"
            >
              <path
                d="M19 13V19H5V13C5 11.9 5.9 11 7 11H17C18.1 11 19 11.9 19 13Z"
                opacity="0.5"
              />
              <path d="M4 19H20V21H4V19Z" />
              <path d="M7 4C7 2.9 7.9 2 9 2H15C16.1 2 17 2.9 17 4V11H7V4Z" />
            </svg>
            <span
              className="text-[9px] font-semibold tracking-wide uppercase 
                   text-zinc-400 group-hover:text-amber-300"
            >
              {lock.length > 0 ? `${lock.length} Locked` : "No Hold"}
            </span>
          </button>

          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-gray-700 rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.role === "ADMIN" && (
                <span className="hidden sm:block text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold uppercase">
                  {user.role}
                </span>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0"
                  >
                    <Avatar className="h-10 w-10 border-2  border-white ">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-gray-800 text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-2 border border-white/10 bg-gray-900"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex gap-2">
                      <Avatar className="h-10 w-10 ">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-gray-800 text-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-base font-medium leading-none text-white">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="group text-white focus:bg-gray-800 focus:text-white cursor-pointer outline-none transition-colors "
                  >
                    <Link href="/profile">
                      {" "}
                      <UserPen className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem
                      asChild
                      className="group text-white focus:bg-gray-800 focus:text-white cursor-pointer outline-none transition-colors "
                    >
                      <Link href="/admin">
                        {" "}
                        <MonitorCog className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="group flex items-center gap-2 px-2 py-2 text-red-400 cursor-pointer outline-none transition-all duration-200 focus:bg-red-500/10 focus:text-red-500 "
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    {isLoggingOut ? (
                      <div className="h-4 w-4 animate-spin border-2 border-red-500 border-t-transparent rounded-full" />
                    ) : (
                      <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    )}
                    <span className="font-medium">
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={() => onLogin()} className="group font-semibold">
              {isLogging ? (
                <div className="h-4 w-4 animate-spin border-2 border-[#4285F4] border-t-transparent rounded-full " />
              ) : (
                <svg
                  className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:-translate-x-1"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{isLogging ? "Logging in..." : "Login with Google"}</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
