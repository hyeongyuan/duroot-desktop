import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-[#22272e] text-[#adbac7] h-screen rounded-md overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
