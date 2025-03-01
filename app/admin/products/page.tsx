import { Metadata } from 'next'
import AdminProductList from './admin-product-list'

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProduct() {
  return <AdminProductList />
}