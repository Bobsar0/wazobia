import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Product',
}

/**
 * Page for creating a new product.
 *
 * This page displays a form for creating a new product and submitting it to the server.
 * If the operation is successful, it will toast a success message and redirect to the
 * products list. If the operation fails, it will toast an error message.
 *
 * @returns JSX.Element
 */
const CreateProductPage = () => {
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href='/admin/products/create'>Create</Link>
      </div>

      <div className='my-8'>
        <ProductForm type='Create' />
      </div>
    </main>
  )
}

export default CreateProductPage