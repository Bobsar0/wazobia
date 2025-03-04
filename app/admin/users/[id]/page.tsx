import { notFound } from 'next/navigation'

import { getUserById } from '@/lib/actions/user.actions'

import UserEditForm from './user-edit-form'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit User',
}

/**
 * Page to edit a user.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise that resolves to an object containing the user ID.
 *
 * @returns {JSX.Element} The UserEditForm component with the user details for editing.
 *
 * This component retrieves the user by ID and checks if the user exists. If the user does not exist, it triggers a notFound.
 */
export default async function UserEditPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const user = await getUserById(id)
  if (!user) notFound()
    
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/users'>Users</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/users/${user._id}`}>{user._id}</Link>
      </div>

      <div className='my-8'>
        <UserEditForm user={user} />
      </div>
    </main>
  )
}