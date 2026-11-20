import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RF Attendance",
  description: "Cloud RFID attendance tracker"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
