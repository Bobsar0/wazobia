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

/**
 * Retrieves a single product by its slug.
 * @param {string} slug - The slug to search the product by.
 * @returns {Promise<IProduct>} The product with the given slug.
 * @throws {Error} If the product is not found.
 */
export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true })
  if (!product) throw new Error('Product not found')
  return JSON.parse(JSON.stringify(product)) as IProduct
}

/**
 * Retrieves a list of related products based on the category, excluding the current product.
 * Paginated results are provided based on the specified limit and page number.
 *
 * @param {Object} param
 * @param {string} param.category - The category to search related products by.
 * @param {string} param.productId - The ID of the current product to exclude from results.
 * @param {number} [param.limit=4] - The maximum number of products to return.
 * @param {number} [param.page=1] - The page number for pagination.
 * @returns {Promise<{ data: IProduct[], totalPages: number }>} An object containing the related products and total number of pages.
 */

export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = 4,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  // const {
  //   common: { pageSize },
  // } = await getSetting()
  // limit = limit || pageSize
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }
  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const productsCount = await Product.countDocuments(conditions)
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}