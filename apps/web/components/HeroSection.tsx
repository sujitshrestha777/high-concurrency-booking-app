export const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 py-16 items-center">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          BUY, TRADE <span className="text-gradient">BTC</span> ON <br />{" "}
          DIGIFINEX
        </h1>
        <p className="text-lg text-gray-300">
          7 years Service Safely • 28 Billion 24h Trading Volume • 700+
          Cryptocurrencies
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Email or Phone"
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 w-full max-w-xs"
          />
          <button className="bg-cyan-400 text-black px-4 py-2 rounded">
            Get Started
          </button>
        </div>
      </div>

      <div className="relative">
        <img
          src="/phone-illustration.png" // Export your 3D phone art to PNG or use an SVG
          alt="Crypto phone"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </section>
  );
};
