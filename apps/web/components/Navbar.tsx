"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserDetails } from "lib/auth/getUserDetail";
import { signOut, signIn } from "next-auth/react"; // Assuming Auth.js
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
                    <Avatar className="h-10 w-10 border border-gray-800">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-gray-800 text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Log out
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
