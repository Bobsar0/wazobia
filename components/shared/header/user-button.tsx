import { auth } from '@/auth'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
// import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

/**
 * A dropdown menu that displays the user's name and email address if they are
 * signed in, with links to their account and orders. If the user is not signed
 * in, it displays a link to sign in and a message indicating that they can sign
 * up for an account. Admin users will also have a link to the admin dashboard.
 *
 * @returns A JSX element representing the user button.
 */
export default async function UserButton() {
  // const t = await getTranslations()
  const session = await auth()
  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger className='header-button' asChild>
          <div className='flex items-center'>
            <div className='flex flex-col text-xs text-left'>
              <span>
                {/* {t('Header.Hello')},{' '}
                {session ? session.user.name : t('Header.sign in')} */}
                {/* {t('Header.Hello')},{' '} */}
                Hello, {session ? session.user.name : 'sign in'}
              </span>
              {/* <span className='font-bold'>{t('Header.Account & Orders')}</span> */}
              <span className='font-bold'>Account & Orders</span>
            </div>
            <ChevronDownIcon />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {session.user.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link className='w-full' href='/account'>
                {/* <DropdownMenuItem>{t('Header.Your account')}</DropdownMenuItem> */}
                <DropdownMenuItem>Your account</DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                {/* <DropdownMenuItem>{t('Header.Your orders')}</DropdownMenuItem> */}
                <DropdownMenuItem>Your orders</DropdownMenuItem>
              </Link>

              {session.user.role === 'Admin' && (
                <Link className='w-full' href='/admin/overview'>
                  {/* <DropdownMenuItem>{t('Header.Admin')}</DropdownMenuItem> */}
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem className='p-0 mb-1'>
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full py-4 px-2 h-4 justify-start'
                  variant='ghost'
                >
                  {/* {t('Header.Sign out')} */}
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  className={cn(buttonVariants(), 'w-full')}
                  href='/sign-in'
                >
                  {/* {t('Header.Sign in')} */}
                  Sign in
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className='font-normal'>
                {/* {t('Header.New Customer')}?{' '} */}
                New Customer?{' '}
                {/* <Link href='/sign-up'>{t('Header.Sign up')}</Link> */}
                <Link href='/sign-up'>Sign up</Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}