// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Prompt } from 'next/font/google';
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import FutsalNavbar from "./components/Futsal-Navbar";
import { getServerSession } from "next-auth";
import authOptions from "./lib/configs/auth/authOptions";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
});

export const metadata: Metadata = {
  title: "SDN FUTSAL No L CUP",
  description: "โค้ชผู้สร้างแรงบันดาลใจ",
  keywords: ["ฟุตซอล", "กีฬา", "ฝึกซ้อม", "SDN FUTSAL", "No L CUP"],
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ดึงข้อมูล session จาก server
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="th" className="scroll-smooth">
      <body className={`${inter.variable} ${prompt.variable} font-prompt antialiased`}>
        <SessionProvider session={session}>
          <FutsalNavbar />
          <main>
            {children}
          </main>
          <Toaster position="top-center" expand={true} richColors />
        </SessionProvider>
      </body>
    </html>
  );
}