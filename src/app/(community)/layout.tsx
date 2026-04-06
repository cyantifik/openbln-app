import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen text-black flex flex-col">
      <Nav variant="light" />
      <main className="flex-1">{children}</main>
      <Footer variant="light" />
    </div>
  );
}
