'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '../db/model/product.model'
import { PAGE_SIZE } from '../constants'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'


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
 * Returns a list of products that match the given query, category, tag, price, and rating filters.
 *
 * The `query` parameter is a search query string that will be matched against the product name.
 * The `category` parameter is the category of the product.
 * The `tag` parameter is a tag of the product.
 * The `price` parameter is the price of the product in the format of 'min-max'.
 * The `rating` parameter is the average rating of the product.
 * The `sort` parameter is the sorting order of the products.
 *
 * The function returns an object with the following properties:
 * - `products`: an array of products that match the filters.
 * - `totalPages`: the total number of pages of products that match the filters.
 * - `totalProducts`: the total number of products that match the filters.
 * - `from`: the number of the first product in the current page.
 * - `to`: the number of the last product in the current page.
 */
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  tag: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  // const {
  //   common: { pageSize },
  // } = await getSetting()
  limit = limit || PAGE_SIZE
  await connectToDatabase()

  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i', //incase-sensitive
          },
        }
      : {}
  const categoryFilter = category && category !== 'all' ? { category } : {}
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {}
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 } //descending
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const isPublished = { isPublished: true }
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  }
}

/**
 * Returns an array of unique tags used in all products.
 * The tags are sorted alphabetically and formatted
 * as space-separated words with the first letter of
 * each word capitalized.
 * @returns {Promise<string[]>}
 */
export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ])
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  )
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

/**
 * Deletes a product by its ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * @throws {Error} If the product is not found.
 */
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()
    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')
    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ALL PRODUCTS FOR ADMIN

/**
 * Retrieves a paginated list of products for admin view based on a search query, sort order, and page number.
 *
 * @param {Object} param - The parameters for retrieving products.
 * @param {string} param.query - A search query string to filter products by name.
 * @param {number} [param.page=1] - The page number for pagination.
 * @param {string} [param.sort='latest'] - The sort order for the products. Options include 'best-selling', 'price-low-to-high', 'price-high-to-low', 'avg-customer-review', and 'latest'.
 * @param {number} [param.limit] - The maximum number of products to return per page.
 * @returns {Promise<{ products: IProduct[], totalPages: number, totalProducts: number, from: number, to: number }>} An object containing the list of products, total pages, total number of products, and the range of products in the current page.
 */

export async function getAllProductsForAdmin({
  query,
  page = 1,
  sort = 'latest',
  limit,
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  await connectToDatabase()

  const pageSize = limit || PAGE_SIZE
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}

  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const products = await Product.find({
    ...queryFilter,
  })
    .sort(order)
    .skip(pageSize * (Number(page) - 1))
    .limit(pageSize)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / pageSize),
    totalProducts: countProducts,
    from: pageSize * (Number(page) - 1) + 1,
    to: pageSize * (Number(page) - 1) + products.length,
  }
}