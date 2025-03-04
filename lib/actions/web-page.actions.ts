'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/db'
import WebPage, { IWebPage } from '@/lib/db/models/web-page.model'
import { formatError } from '@/lib/utils'
import { WebPageInputSchema, WebPageUpdateSchema } from '../validator'
import { z } from 'zod'

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

/**
 * Creates a new web page in the database with the provided data.
 *
 * @param {z.infer<typeof WebPageInputSchema>} data - The web page data to create, which includes the web page's title, slug, content, and isPublished.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * @throws {Error} If the provided data is invalid or if an error occurs during the create process.
 */
export async function createWebPage(data: z.infer<typeof WebPageInputSchema>) {
  try {
    const webPage = WebPageInputSchema.parse(data)
    await connectToDatabase()
    await WebPage.create(webPage)
    revalidatePath('/admin/web-pages')
    
    return {
      success: true,
      message: 'WebPage created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Updates an existing web page in the database with the provided data.
 *
 * @param {z.infer<typeof WebPageUpdateSchema>} data - The web page data to update, which includes the web page's title, slug, content, isPublished, and _id.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * @throws {Error} If the provided data is invalid or if an error occurs during the update process.
 */
export async function updateWebPage(data: z.infer<typeof WebPageUpdateSchema>) {
  try {
    const webPage = WebPageUpdateSchema.parse(data)
    await connectToDatabase()
    await WebPage.findByIdAndUpdate(webPage._id, webPage)
    revalidatePath('/admin/web-pages')
    return {
      success: true,
      message: 'WebPage updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}