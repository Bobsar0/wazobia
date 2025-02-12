import { HomeCarousel } from '@/components/home/home-carousel'
import { HomeCards } from '@/components/shared/home/home-cards'
import {
  getAllCategories,
  getProductsForCard,
} from '@/lib/actions/product.actions'
import data from '@/lib/data'
import { toSlug } from '@/lib/utils'

export default async function Home() {
  const categories = (await getAllCategories()).slice(0, 4)
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
    limit: 4,
  })
  const featuredProducts = await getProductsForCard({
    tag: 'featured',
    limit: 4,
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
    limit: 4,
  })

  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
      items: newArrivals,
    },
    {
      title: 'Discover Best Sellers',
      link: {
        text: 'View All',
        href: '/search?tag=best-seller',
      },
      items: bestSellers,
    },
    {
      title: 'Featured Products',
      link: {
        text: 'Shop Now',
        href: '/search?tag=featured',
      },
      items: featuredProducts,
    },
  ]
  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCards cards={cards} />
      </div>
    </>
  )
}
