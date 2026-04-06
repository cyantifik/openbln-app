export default function Home() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6">
      {/* Floating wordmark */}
      <div className="logo-float text-center mb-10">
        <h1 className="text-5xl md:text-7xl tracking-wide">
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
        </h1>
      </div>

      {/* Soft description */}
      <p className="text-lg md:text-xl text-gray-400 max-w-md text-center leading-relaxed mb-12">
        A space for Berlin&apos;s creative community to connect, collaborate, and grow together.
      </p>

      {/* Subtle entry point */}
      <div className="flex gap-4 text-sm">
        <a
          href="/auth/login"
          className="px-6 py-3 border border-gray-200 rounded-full text-gray-600 hover:text-black hover:border-gray-400 transition-all duration-300"
        >
          Sign in
        </a>
        <a
          href="/auth/signup"
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
        >
          Request access
        </a>
      </div>
    </div>
  );
}
