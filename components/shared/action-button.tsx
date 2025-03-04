'use client'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

/**
 * A button that performs an asynchronous action and displays
 * a toast when the action is completed.
 *
 * @param {string} caption The text to display on the button
 * @param {() => Promise<{ success: boolean; message: string }>} action
 *   The action to perform when the button is clicked. The promise
 *   should resolve to an object with a `success` property (a boolean)
 *   and a `message` property (a string).
 * @param {string} [className='w-full'] Additional CSS classes to apply
 *   to the button.
 * @param {'default' | 'outline' | 'destructive'} [variant='default']
 *   The variant of the button to display.
 * @param {'default' | 'sm' | 'lg'} [size='default']
 *   The size of the button to display.
 *
 * @example
 * import { ActionButton } from '@/components/shared/action-button'
 *
 * function MyComponent() {
 *   const action = async () => {
 *     // perform an asynchronous action here
 *     return { success: true, message: 'Success!' }
 *   }
 *
 *   return (
 *     <ActionButton
 *       caption='Click me!'
 *       action={action}
 *     />
 *   )
 * }
 */
export default function ActionButton({
  caption,
  action,
  className = 'w-full',
  variant = 'default',
  size = 'default',
}: {
  caption: string
  action: () => Promise<{ success: boolean; message: string }>
  className?: string
  variant?: 'default' | 'outline' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  return (
    <Button
      type='button'
      className={cn('rounded-full', className)}
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await action()
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          })
        })
      }
    >
      {isPending ? 'processing...' : caption}
    </Button>
  )
}