import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}

/**
 * Page to sign up a user.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ callbackUrl: string }>} props.searchParams - Promise that resolves to an object containing the callback URL.
 *
 * @returns {JSX.Element} The signup form.
 */
export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams

  const { callbackUrl } = searchParams

  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}