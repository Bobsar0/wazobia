'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateUserName } from '@/lib/actions/user.actions'
import { UserNameSchema } from '@/lib/validator'


/**
 * ProfileForm is a form for updating the current user's name.
 *
 * It will fetch the current user's name from the session and use it as the default value.
 * When the form is submitted, it will call the `updateUserName` action to update the user's name.
 * If the update is successful, it will update the session and redirect to the user's profile page.
 * If the update fails, it will display an error message.
 */
export const ProfileForm = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
    },
  })
  const { toast } = useToast()

/**
 * Handles the submission of the ProfileForm to update the user's name.
 * It calls the `updateUserName` function with the form values, and if
 * the update is successful, it updates the user's session with the new
 * name and redirects to the account management page. In case of a failure,
 * it displays an error message using a toast notification.
 *
 * @param {z.infer<typeof UserNameSchema>} values - The form values containing the new user name.
 */
  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values)
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })

    const { data, message } = res
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    }
    await update(newSession)
    toast({
      description: message,
    })
    router.push('/account/manage')
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='  flex flex-col gap-5'
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='font-bold'>New name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name'
                    {...field}
                    className='input-field'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}