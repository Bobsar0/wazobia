import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/model/product.model'

  /**
   * Gets a list of products that are either in the user's browsing history (if `type=history`) or
   * are related to the user's browsing history (if `type=related`). The list of products
   * is given by the `ids` parameter, and the categories are given by the `categories`
   * parameter.
   *
   * If `type=history`, the products are sorted by the order they were viewed in.
   *
   * @param {NextRequest} request - the Next request object
   * @returns {Promise<NextResponse>} - a JSON response containing the list of products
   */
export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get('type') || 'history'
  const productIdsParam = request.nextUrl.searchParams.get('ids')
  const categoriesParam = request.nextUrl.searchParams.get('categories')

  if (!productIdsParam || !categoriesParam) {
    return NextResponse.json([])
  }

  const productIds = productIdsParam.split(',')
  const categories = categoriesParam.split(',')
  const filter =
    listType === 'history'
      ? {
          _id: { $in: productIds },
        }
      : { category: { $in: categories }, _id: { $nin: productIds } }

  await connectToDatabase()
  
  const products = await Product.find(filter)
  if (listType === 'history')
    return NextResponse.json(
      products.sort(
        (a, b) =>
          productIds.indexOf(a._id.toString()) -
          productIds.indexOf(b._id.toString())
      )
    )
  return NextResponse.json(products)
}