import React, { type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer';
import { MobileCellNavbar } from './MobileCellNavbar';
import { Toaster } from 'react-hot-toast';
interface MainLayoutProps {
  children: ReactNode;
}
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-grow pb-24 md:pb-0'>
        {children}
      </div>
      <Toaster position="top-right" />
      <Footer />
      <MobileCellNavbar />
    </main>
  )
}
