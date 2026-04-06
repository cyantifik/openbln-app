import type { Metadata } from "next";
import CommunityShell from "./CommunityShell";

export const metadata: Metadata = {
  title: "Space",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommunityShell>{children}</CommunityShell>;
}
