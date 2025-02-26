/**
 * A Next.js page that displays a loading message.
 *
 * This page is intended to be used as a loading indicator while the user is
 * waiting for a route change to complete. It is not meant to be used as a final
 * destination.
 *
 * @returns A React component that displays a loading message.
 */
export default async function LoadingPage() {
  // const t = await getTranslations()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        {/* {t('Loading.Loading')} */}
        Loading
      </div>
    </div>
  )
}