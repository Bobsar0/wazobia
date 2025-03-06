import React from 'react'

/**
 * The account layout component.
 *
 * This component is the root of all account pages. It provides a simple
 * layout with a max-width of 5xl and a space-y-4 margin.
 *
 * @param {React.ReactNode} children The children of the component. This is
 * the main content of the page.
 * @returns {JSX.Element} The component.
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=' flex-1 p-4'>
      <div className='max-w-5xl mx-auto space-y-4'>{children}</div>
    </div>
  )
}