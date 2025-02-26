import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.actions'
// import { IProduct } from '@/lib/db/models/product.model'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import { getFilterUrl, toSlug } from '@/lib/utils'
import Rating from '@/components/shared/product/rating'

import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { IProduct } from '@/lib/db/model/product.model'

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to high' },
  { value: 'price-high-to-low', name: 'Price: High to low' },
  { value: 'newest-arrivals', name: 'Newest arrivals' },
  { value: 'avg-customer-review', name: 'Avg. customer review' },
  { value: 'best-selling', name: 'Best selling' },
]

const prices = [
  {
    name: `${CURRENCY_SYMBOL}1 to ${CURRENCY_SYMBOL}20`,
    value: '1-20',
  },
  {
    name: `${CURRENCY_SYMBOL}21 to ${CURRENCY_SYMBOL}50`,
    value: '21-50',
  },
  {
    name: `${CURRENCY_SYMBOL}51 to ${CURRENCY_SYMBOL}1000`,
    value: '51-1000',
  },
]

/**
 * Generates metadata for the search page based on provided search parameters.
 *
 * @param {Object} props - The component props.
 * @param {Promise<Object>} props.searchParams - Promise resolving to an object containing search parameters.
 * @param {string} props.searchParams.q - The search query.
 * @param {string} props.searchParams.category - The category to filter by.
 * @param {string} props.searchParams.tag - The tag to filter by.
 * @param {string} props.searchParams.price - The price range to filter by.
 * @param {string} props.searchParams.rating - The rating to filter by.
 * @param {string} props.searchParams.sort - The sort order.
 * @param {string} props.searchParams.page - The page number.
 *
 * @returns {Promise<Object>} The metadata for the search page, including dynamic title based on search criteria.
 */

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams
  // const t = await getTranslations()
  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
  } = searchParams

  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      // title: `${t('Search.Search')} ${q !== 'all' ? q : ''}
      //     ${category !== 'all' ? ` : ${t('Search.Category')} ${category}` : ''}
      //     ${tag !== 'all' ? ` : ${t('Search.Tag')} ${tag}` : ''}
      //     ${price !== 'all' ? ` : ${t('Search.Price')} ${price}` : ''}
      //     ${rating !== 'all' ? ` : ${t('Search.Rating')} ${rating}` : ''}`,
      title: `Search ${q !== 'all' ? q : ''}
      ${category !== 'all' ? ` : Category ${category}` : ''}
      ${tag !== 'all' ? ` : Tag ${tag}` : ''}
      ${price !== 'all' ? ` : Price ${price}` : ''}
      ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
    }
  } else {
    return {
      // title: t('Search.Search Products'),
      title: 'Search Products',
    }
  }
}

/**
 * Renders the search page with filtering and sorting options.
 *
 * @param {Object} props - The component props.
 * @param {Promise<Object>} props.searchParams - Promise resolving to an object
 * containing search parameters such as query, category, tag, price, rating,
 * sort order, and page number.
 *
 * @returns {JSX.Element} The search page component, which includes product
 * listings based on the search criteria, pagination controls, and filtering
 * options for category, tag, price, and rating.
 *
 * This component fetches categories, tags, and products based on search
 * criteria, renders a list of products, and provides options for sorting and
 * filtering the results. If no products match the search criteria, a message
 * is displayed. 
 */
export default async function SearchPage(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
  } = searchParams

  const params = { q, category, tag, price, rating, sort, page }

  const categories = await getAllCategories()
  const tags = await getAllTags()
  const data = await getAllProducts({
    category,
    tag,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  })
  // const t = await getTranslations()
  return (
    <div>
      <div className='my-2 bg-card md:border-b  flex-between flex-col md:flex-row '>
        <div className='flex items-center'>
          {data.totalProducts === 0
            // ? t('Search.No')
            ? 'No'
            // : `${data.from}-${data.to} ${t('Search.of')} ${
            : `${data.from}-${data.to} of ${
                data.totalProducts
              }`}{' '}
          {/* {t('Search.results')} */}
          results
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all'
            // ? ` ${t('Search.for')} `
            ? ' for '
            : null}
          {q !== 'all' && q !== '' && '"' + q + '"'}
          {category !== 'all' &&
            category !== '' &&
            // `   ${t('Search.Category')}: ` + category}
            `   Category: ` + category}
          {/* {tag !== 'all' && tag !== '' && `   ${t('Search.Tag')}: ` + tag}
          {price !== 'all' && `    ${t('Search.Price')}: ` + price}
          {rating !== 'all' &&
            `    ${t('Search.Rating')}: ` + rating + ` & ${t('Search.up')}`} */}
          
          {tag !== 'all' && tag !== '' && `   Tag: ` + tag}
          {price !== 'all' && `    Price: ` + price}
          {rating !== 'all' &&
            `    Rating: ` + rating + ` & up`}

          &nbsp;
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all' ? (
            <Button variant={'link'} asChild>
              {/* <Link href='/search'>{t('Search.Clear')}</Link> */}
              <Link href='/search'>Clear</Link>
            </Button>
          ) : null}
        </div>
        <div>
          <ProductSortSelector
            sortOrders={sortOrders}
            sort={sort}
            params={params}
          />
        </div>
      </div>
      <div className='bg-card grid md:grid-cols-5 md:gap-4'>
        {/* <CollapsibleOnMobile title={t('Search.Filters')}> */}
        <CollapsibleOnMobile title='Filters'>
          <div className='space-y-4'>
            <div>
              {/* <div className='font-bold'>{t('Search.Department')}</div> */}
              <div className='font-bold'>Department</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === category || '' === category) && 'text-primary'
                    }`}
                    href={getFilterUrl({ category: 'all', params })}
                  >
                    {/* {t('Search.All')} */}
                    All
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && 'text-primary'}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* <div className='font-bold'>{t('Search.Price')}</div> */}
              <div className='font-bold'>Price</div>
              <ul>
                <li>
                  <Link
                    className={`${'all' === price && 'text-primary'}`}
                    href={getFilterUrl({ price: 'all', params })}
                  >
                    {/* {t('Search.All')} */}
                    All
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params })}
                      className={`${p.value === price && 'text-primary'}`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* <div className='font-bold'>{t('Search.Customer Review')}</div> */}
              <div className='font-bold'>Customer Review</div>
              <ul>
                <li>
                  <Link
                    href={getFilterUrl({ rating: 'all', params })}
                    className={`${'all' === rating && 'text-primary'}`}
                  >
                    {/* {t('Search.All')} */}
                    All
                  </Link>
                </li>

                <li>
                  <Link
                    href={getFilterUrl({ rating: '4', params })}
                    className={`${'4' === rating && 'text-primary'}`}
                  >
                    <div className='flex'>
                      {/* <Rating size={4} rating={4} /> {t('Search.& Up')} */}
                      <Rating size={4} rating={4} /> & Up
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              {/* <div className='font-bold'>{t('Search.Tag')}</div> */}
              <div className='font-bold'>Tag</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === tag || '' === tag) && 'text-primary'
                    }`}
                    href={getFilterUrl({ tag: 'all', params })}
                  >
                    {/* {t('Search.All')} */}
                    All
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && 'text-primary'}`}
                      href={getFilterUrl({ tag: t, params })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className='md:col-span-4 space-y-4'>
          <div>
            {/* <div className='font-bold text-xl'>{t('Search.Results')}</div> */}
            <div className='font-bold text-xl'>Results</div>
            <div>
              {/* {t('Search.Check each product page for other buying options')} */}
              Check each product page for other buying options
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  '>
            {data.products.length === 0 && (
              // <div>{t('Search.No product found')}</div>
              <div>No product found</div>
            )}
            {data.products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}