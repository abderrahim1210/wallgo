import React, { type ReactNode } from 'react'
import { Navbar } from './layouts/Navbar'
import { Footer } from './layouts/Footer';
interface MainLayoutProps {
  children: ReactNode;
}
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-grow'>
        {children}
      </div>
      <Footer />
    </main>
  )
}
