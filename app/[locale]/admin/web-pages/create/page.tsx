import { Metadata } from 'next'
import WebPageForm from '../web-page-form'

export const metadata: Metadata = {
  title: 'Create WebPage',
}

/**
 * Renders the create web page form.
 *
 * @returns {JSX.Element} The create web page form component.
 */
export default function CreateWebPagePage() {
  return (
    <>
      <h1 className='h1-bold'>Create WebPage</h1>

      <div className='my-8'>
        <WebPageForm type='Create' />
      </div>
    </>
  )
}