import { notFound } from 'next/navigation'

import { getProductById } from '@/lib/actions/product.actions'
import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Product',
}

type UpdateProductProps = {
  params: Promise<{
    id: string
  }>
}

/**
 * Asynchronously fetches a product by ID and renders the ProductForm component for updating the product.
 *
 * @param {UpdateProductProps} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise that resolves to an object containing the product ID.
 *
 * @returns {JSX.Element} The ProductForm component with the product details for updating.
 *
 * This component retrieves the product by ID and checks if the product exists. If the product does not exist, it triggers a notFound.
 */
const UpdateProduct = async (props: UpdateProductProps) => {
  const params = await props.params

  const { id } = params

  const product = await getProductById(id)
  if (!product) notFound()
    
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/products/${product._id}`}>{product._id}</Link>
      </div>

      <div className='my-8'>
        <ProductForm type='Update' product={product} productId={product._id} />
      </div>
    </main>
  )
}

export default UpdateProduct