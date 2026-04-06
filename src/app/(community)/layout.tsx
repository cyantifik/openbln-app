import Nav from "@/components/Nav";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen text-black">
      <Nav />
      <main className="min-h-screen">{children}</main>
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2026{" "}
            <span className="font-bold">OPEN</span>{" "}
            <span className="font-light">BLN</span> — A community for
            Berlin&apos;s creative professionals &nbsp;&hearts;&nbsp; All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
