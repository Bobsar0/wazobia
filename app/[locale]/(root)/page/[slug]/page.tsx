import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getWebPageBySlug } from '@/lib/actions/web-page.actions'

/**
 * Generates metadata for the web page by slug.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ slug: string }>} props.params - Promise that resolves to an object containing the web page slug.
 *
 * @returns {Promise<{ title: string }>} The metadata to be used for the page, including the web page title.
 */
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  const { slug } = params

  const webPage = await getWebPageBySlug(slug)
  if (!webPage) {
    return { title: 'Web page not found' }
  }
  return {
    title: webPage.title,
  }
}

/**
 * Asynchronously fetches a web page by slug and renders its content.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ slug: string }>} props.params - Promise that resolves to an object containing the web page slug.
 * @param {Promise<{ page: string; color: string; size: string }>} props.searchParams - Unused search parameters.
 *
 * @returns {JSX.Element} The rendered web page content, including the title and content.
 *
 * This component retrieves the web page by slug and checks if the web page exists. If the web page does not exist, it triggers a notFound.
 */
export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const params = await props.params
  const { slug } = params
  const webPage = await getWebPageBySlug(slug)

  if (!webPage) notFound()

  return (
    <div className='p-4 max-w-3xl mx-auto'>
      <h1 className='h1-bold py-4'>{webPage.title}</h1>
      <section className='text-justify text-lg mb-20 web-page-content'>
        <ReactMarkdown>{webPage.content}</ReactMarkdown>
      </section>
    </div>
  )
}