import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black px-4 sm:px-32">
      {/* Left side - Subtle dark */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-900" />

      {/* Right side - Vibrant neon focus */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2">
        {/* Animated gradient orbs - concentrated on right */}
        {/* <div className="absolute top-20 right-10 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob" /> */}
        {/* <div className="absolute top-40 right-32 w-80 h-80 bg-sky-800 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000" /> */}
        {/* <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" /> */}
      </div>

      {/* Grid pattern - fades from left to right */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold text-purple-400 tracking-wider uppercase">
                  Next Generation Booking
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                Book Your
                <br />
                Perfect{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Seat
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 blur-sm" />
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Experience seamless seat booking with real-time availability
                updates and intelligent recommendations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50 transition-all hover:shadow-purple-500/70"
              >
                <Link href="/booking">
                  Book Now
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-gray-700 hover:bg-white/5 hover:border-purple-500/50 transition-all"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-800">
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          {/* Right visual element */}
          {/* <div className="relative hidden lg:block">
            <div className="relative">
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-60" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">
                        Booking Confirmed
                      </div>
                      <div className="text-white font-semibold">Seat A-24</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">Nov 15, 2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Time</span>
                      <span className="text-white">2:30 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                      <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50" />
                      <div className="flex-1 h-2 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 top-1/4 bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                ✨ Real-time Updates
              </div>
              <div className="absolute -right-6 bottom-1/4 bg-pink-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                🚀 Instant Booking
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
