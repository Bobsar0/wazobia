import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import React from 'react'

/**
 * The root layout component for the home page.
 *
 * This component is server-side rendered and should not be used on the
 * client-side.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The main content of the page.
 * @returns {JSX.Element} The component.
 */
const layout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 flex flex-col'>{children}</main>
      <Footer />
    </div>
  )
}

export default layout