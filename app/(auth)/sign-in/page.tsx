import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// import { auth } from '@/auth'
// import SeparatorWithOr from '@/components/shared/separator-or'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import CredentialsSignInForm from './credentials-signin-form'
import { auth } from '@/auth'
import SeparatorWithOr from '@/components/shared/separator-or'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
// import { GoogleSignInForm } from './google-signin-form'
// import { Button } from '@/components/ui/button'
// import { getSetting } from '@/lib/actions/setting.actions'

export const metadata: Metadata = {
  title: 'Sign In',
}

/**
 * Page to sign in a user.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ callbackUrl: string }>} props.searchParams - Promise that resolves to an object containing the callback URL.
 *
 * @returns {JSX.Element} The signin form and a link to sign up if the user is not signed in.
 */
export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams
  // const { site } = await getSetting()

  const { callbackUrl = '/' } = searchParams

  const session = await auth()
  if (session) {
    return redirect(callbackUrl)
  }

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
            {/* <SeparatorWithOr />
            <div className='mt-4'>
              <GoogleSignInForm />
            </div> */}
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>New to {APP_NAME}?</SeparatorWithOr>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className='w-full' variant='outline'>
          Create your {APP_NAME} account
        </Button>
      </Link>
    </div>
  )
}