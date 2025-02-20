import { ReactNode } from 'react'

/**
 * A horizontal separator with the word "or" in the middle.
 *
 * This separator is useful for separating two parts of a form or a page.
 * You can provide a custom text as a child of this component.
 *
 * @example
 * <SeparatorWithOr />
 *
 * @example
 * <SeparatorWithOr>Custom text</SeparatorWithOr>
 *
 * @param {ReactNode} [children] - The text to be displayed in the middle of the separator.
 * If not provided, "or" will be used.
 *
 * @returns The separator component.
 */
const SeparatorWithOr = ({ children }: { children?: ReactNode }) => {
  return (
    <div className='h-5 border-b my-5 text-center w-full'>
      <span className='bg-background absolute left-1/2 -translate-x-1/2 mt-2 text-gray-500'>
        {children ?? 'or'}
      </span>
    </div>
  )
}

export default SeparatorWithOr