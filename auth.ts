import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import client from './lib/db/client'

import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from './auth.config'
import User from './lib/db/model/user.model'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // defines routes to redirect user to
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt', //saves in cookie rather than db
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      
      /**
       * Check if the provided email and password combination is valid and return the matching user, or null if not found.
       * @param {object} credentials - contains email and password
       * @returns {Promise<object|null>} - the user object if found, otherwise null
       */
      async authorize(credentials) {
        await connectToDatabase()
        if (credentials == null) return null

        const user = await User.findOne({ email: credentials.email })

        if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {

    /**
     * Callback to update the JWT token. This is called whenever a user is authorized,
     * and is also used to update the token when the user data is updated in the session.
     * @param {object} param0 - contains token, user, trigger and session
     * @param {object} param0.token - the JWT token to update
     * @param {object} param0.user - the user object from the database
     * @param {string} param0.trigger - whether the callback was triggered by a signin, signup or update
     * @param {object} param0.session - the session object
     * @returns {Promise<object>} - the updated JWT token
     */
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        //use for 3rd party authenticators
        if (!user.name) {
          await connectToDatabase()
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split('@')[0],
            role: 'user',
          })
        }
        token.name = user.name || user.email!.split('@')[0]
        token.role = (user as { role: string }).role
      }

      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },

  /**
   * 
   * Callback to update the session object. This is called whenever a session is created
   * or updated, and is also used to update the session when the user data is updated in the token.
   * 
   * @param {object} param0 - contains session, user, trigger, and token
   * @param {object} param0.session - the session object to update
   * @param {object} param0.user - the user object from the database
   * @param {string} param0.trigger - whether the callback was triggered by an update
   * @param {object} param0.token - the JWT token containing user information
   * @returns {Promise<object>} - the updated session object
   */
    session: async ({ session, user, trigger, token }) => {
      session.user.id = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
  },
})