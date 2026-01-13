import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'EXIM Bank Services | Next.js',
  description: 'ระบบบริการธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <ChatWidget />
      </body>
    </html>
  );
}
