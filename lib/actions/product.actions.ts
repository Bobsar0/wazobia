'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '../db/model/product.model'


/**
 * Returns an array of strings representing all the categories of products.
 */
export async function getAllCategories() {
  await connectToDatabase()
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  )
  return categories
}

/**
 * Retrieves a list of products for a given tag, limited by the number provided.
 * @param {Object} param
 * @param {string} param.tag - The tag to search products by.
 * @param {number} [param.limit=4] - The maximum number of products to return.
 * @returns {Promise<IProductForCard[]>}
 */
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1, //get image name
      href: { $concat: ['/product/', '$slug'] }, //concatenate product path and slug
      image: { $arrayElemAt: ['$images', 0] }, //get first item of image array
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}

/**
 * Retrieves a list of products for a given tag, limited by the number provided.
 * @param {{tag: string, limit?: number}} param
 * @param {string} param.tag - The tag to search products by.
 * @param {number} [param.limit=10] - The maximum number of products to return.
 * @returns {Promise<IProduct[]>}
 */
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
  ).sort({ createdAt: 'desc' })
   .limit(limit)

  return JSON.parse(JSON.stringify(products)) as IProduct[]
}
