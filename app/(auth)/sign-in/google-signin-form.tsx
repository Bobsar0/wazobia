'use client'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { SignInWithGoogle } from '@/lib/actions/user.actions'

/**
 * A form to sign in with Google.
 *
 * This form will redirect to Google to sign in. After a successful signin, it
 * will redirect back to the current URL.
 *
 * @return {JSX.Element} The signin form.
 */
export function GoogleSignInForm() {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className='w-full' variant='outline'>
        {pending ? 'Redirecting to Google...' : 'Sign In with Google'}
      </Button>
    )
  }
  return (
    <form action={SignInWithGoogle}>
      <SignInButton />
    </form>
  )
}