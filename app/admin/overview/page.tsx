import { Metadata } from 'next'

import OverviewReport from './overview-report'
import { auth } from '@/auth'
export const metadata: Metadata = {
  title: 'Admin Dashboard',
}
/**
 * Page that renders the admin dashboard.
 *
 * This page will redirect to the login page if the user is not logged in
 * or if the user does not have the 'Admin' role.
 *
 * @returns {JSX.Element}
 */
const DashboardPage = async () => {
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  return <OverviewReport />
}

export default DashboardPage