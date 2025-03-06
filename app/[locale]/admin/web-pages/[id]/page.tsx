import { notFound } from 'next/navigation'

import { getWebPageById } from '@/lib/actions/web-page.actions'
import Link from 'next/link'
import WebPageForm from '../web-page-form'

type UpdateWebPageProps = {
  params: Promise<{
    id: string
  }>
}

/**
 * Asynchronously fetches a web page by ID and renders the WebPageForm component for updating the web page.
 *
 * @param {UpdateWebPageProps} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise that resolves to an object containing the web page ID.
 *
 * @returns {JSX.Element} The WebPageForm component with the web page details for updating.
 *
 * This component retrieves the web page by ID and checks if the web page exists. If the web page does not exist, it triggers a notFound.
 */
const UpdateWebPage = async (props: UpdateWebPageProps) => {
  const params = await props.params

  const { id } = params

  const webPage = await getWebPageById(id)
  if (!webPage) notFound()
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/web-pages'>Web Pages</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/web-pages/${webPage._id}`}>{webPage._id}</Link>
      </div>

      <div className='my-8'>
        <WebPageForm type='Update' webPage={webPage} webPageId={webPage._id} />
      </div>
    </main>
  )
}

export default UpdateWebPage