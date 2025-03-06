import React from 'react'

import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

/**
 * The root layout component.
 *
 * This component provides a basic page structure with a header, main content, and footer.
 * It is designed to be the top-level wrapper for any pages in the application.
 *
 * This component is server-side rendered and should not be used on the client-side.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The main content of the page.
 * @returns {JSX.Element} The component.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 flex flex-col p-4'>{children}</main>
      <Footer />
    </div>
  )
}