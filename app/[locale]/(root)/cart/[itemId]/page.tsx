import CartAddItem from './cart-add-item'

/**
 * Renders the CartAddItemPage component.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ itemId: string }>} props.params - Promise that resolves to an object containing the item ID.
 *
 * @returns {JSX.Element} The CartAddItem component with the resolved item ID.
 */
export default async function CartAddItemPage(props: {
  params: Promise<{ itemId: string }>
}) {
  const { itemId } = await props.params

  return <CartAddItem itemId={itemId} />
}