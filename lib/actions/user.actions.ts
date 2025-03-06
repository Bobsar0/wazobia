'use server'

import { auth, signIn, signOut } from '@/auth'
import { IUserName, IUserSignIn, IUserSignUp } from '@/types'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { UserSignUpSchema, UserUpdateSchema } from '../validator'
import User, { IUser } from '../db/models/user.model'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSetting } from './setting.actions'

/**
 * Signs in a user with the provided credentials.
 * @param user - The user object containing name, email and password.
 * @returns The user object if the signin is successful, otherwise null.
 * @throws {Error} If the user is not found or password is incorrect.
 */
export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}

/**
 * Signs in the user with Google
 *
 * @returns {Promise<void>}
 */
export const SignInWithGoogle = async () => {
  await signIn('google')
}

/**
 * Signs out the current user and redirects to the page specified
 * in the next-auth session.
 */
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

// CREATE

export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectToDatabase()
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

/**
 * Deletes a user by its ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string.
 * @throws {Error} If the user is not found.
 */
export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const res = await User.findByIdAndDelete(id)
    if (!res) throw new Error('Use not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Updates a user by its ID.
 *
 * @param {z.infer<typeof UserUpdateSchema>} user - The user object to update, containing the user's ID and fields to be updated.
 * @returns {Promise<{ success: boolean, message: string, data?: IUser }>} A promise resolving to an object containing a success boolean, a message string, and the updated user object if the update is successful.
 * @throws {Error} If the user is not found.
 */
export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user._id)
    if (!dbUser) throw new Error('User not found')
    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.role = user.role
    const updatedUser = await dbUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Updates the current user's name.
 * @param user - The user object with the new name.
 * @returns The updated user object if the update is successful, otherwise an error message.
 */
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase()

    const session = await auth()
    const currentUser = await User.findById(session?.user?.id)
    if (!currentUser) throw new Error('User not found')
    currentUser.name = user.name
    const updatedUser = await currentUser.save()

    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Retrieves a paginated list of all users.
 *
 * @param {{ limit?: number, page: number }} param - The parameters for retrieving users.
 * @param {number} [param.limit] - The maximum number of users to return per page. Defaults to the common page size setting if not provided.
 * @param {number} param.page - The page number for pagination.
 * @returns {Promise<{ data: IUser[], totalPages: number }>} An object containing the list of users and the total number of pages.
 */
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()

  const skipAmount = (Number(page) - 1) * limit
  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const usersCount = await User.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  }
}

/**
 * Retrieves a user by their ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<IUser>} A promise that resolves to the user object.
 * @throws {Error} If the user is not found.
 */
export async function getUserById(userId: string) {
  await connectToDatabase()
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return JSON.parse(JSON.stringify(user)) as IUser
}
