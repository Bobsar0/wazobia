import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'

const PAGE_TITLE = 'Change Your Name'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

/**
 * ProfilePage is a Next.js page component that allows users to update their
 * name. It fetches the current user's session and uses it to populate the
 * ProfileForm component. When the form is submitted, it will call the
 * updateUserName action to update the user's name.
 *
 * @returns {JSX.Element} The ProfilePage component.
 */
export default async function ProfilePage() {
  const session = await auth()
  // const { site } = await getSetting()
  const site = { name: APP_NAME }
  
  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <Link href='/account/manage'>Login & Security</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card className='max-w-2xl'>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <p className='text-sm py-2'>
              If you want to change the name associated with your {site.name}
              &apos;s account, you may do so below. Be sure to click the Save
              Changes button when you are done.
            </p>
            <ProfileForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}