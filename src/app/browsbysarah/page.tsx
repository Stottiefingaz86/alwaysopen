import type { Metadata } from "next";
import { BrowsBySarahDemo } from "@/components/browsbysarah/browsbysarah-demo";

export const metadata: Metadata = {
  title: "Brows by Sarah, AI demo",
  description: "Live AI receptionist demo for Brows by Sarah.",
  robots: { index: false, follow: false },
};

export default function BrowsBySarahPage() {
  return <BrowsBySarahDemo />;
}
