import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BrowsingHistory = {
  products: { id: string; category: string }[]
}
const initialState: BrowsingHistory = {
  products: [],
}

export const browsingHistoryStore = create<BrowsingHistory>()(
  persist(() => initialState, {
    name: 'browsingHistoryStore',
  })
)

/**
 * Hook to interact with the browsing history store.
 *
 * @returns an object containing the current list of products in the browsing history, as well as
 * functions to add a product to the history and to clear the history.
 */
export default function useBrowsingHistory() {
  const { products } = browsingHistoryStore()
  return {
    products,
/**
 * Adds a product to the browsing history.
 * 
 * This function checks if the product already exists in the browsing history.
 * If it does, the existing product is removed to avoid duplicates. The product
 * is then added to the beginning of the history. If the history exceeds 10 items,
 * the oldest item is removed to maintain the limit.
 * 
 * @param product - The product to be added, containing an id and category.
 */

    addItem: (product: { id: string; category: string }) => {
      const index = products.findIndex((p) => p.id === product.id)
      if (index !== -1) products.splice(index, 1) // Remove duplicate if it exists
      products.unshift(product) // Add id to the start

      if (products.length > 10) products.pop() // Remove excess items if length exceeds 10

      browsingHistoryStore.setState({
        products,
      })
    },

    clear: () => {
      browsingHistoryStore.setState({
        products: [],
      })
    },
  }
}