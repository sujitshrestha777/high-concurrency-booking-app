"use client";

import { useEffect, useState } from "react";
import { MonitorCog, UserPen, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserDetails } from "lib/auth/getUserDetail";
import { signOut, signIn } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const details = await getUserDetails();
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
      <div className="container flex px-6 md:px-32 py-2 items-center justify-between mx-auto">
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
            <Button onClick={() => signIn("google")} className="font-semibold">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
