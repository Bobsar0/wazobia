'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/db'
import WebPage, { IWebPage } from '@/lib/db/models/web-page.model'
import { formatError } from '@/lib/utils'

/**
 * Retrieves all web pages from the database.
 *
 * @returns {Promise<IWebPage[]>} An array of web page objects.
 */
export async function getAllWebPages() {
  await connectToDatabase()
  const webPages = await WebPage.find()
  return JSON.parse(JSON.stringify(webPages)) as IWebPage[]
}
export async function getWebPageById(webPageId: string) {
  await connectToDatabase()
  const webPage = await WebPage.findById(webPageId)
  return JSON.parse(JSON.stringify(webPage)) as IWebPage
}

/**
 * Retrieves a web page by its slug.
 *
 * @param {string} slug - The slug to search the web page by.
 * @returns {Promise<IWebPage>} The web page with the given slug.
 * @throws {Error} If the web page is not found.
 */
export async function getWebPageBySlug(slug: string) {
  await connectToDatabase()
  const webPage = await WebPage.findOne({ slug, isPublished: true })
  if (!webPage) throw new Error('WebPage not found')
  return JSON.parse(JSON.stringify(webPage)) as IWebPage
}

/**
 * Deletes a web page by its ID.
 *
 * @param {string} id - The ID of the web page to delete.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * @throws {Error} If the web page is not found.
 */
export async function deleteWebPage(id: string) {
  try {
    await connectToDatabase()
    const res = await WebPage.findByIdAndDelete(id)
    if (!res) throw new Error('WebPage not found')
      
    revalidatePath('/admin/web-pages')

    return {
      success: true,
      message: 'WebPage deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}