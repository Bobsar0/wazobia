import type { NextAuthConfig } from 'next-auth'

// Notice this is only an object, not a full Auth.js instance
// It is used as a middleware, so needs to be edge-compatible.
// Hence it doesnt have any external packages like bcrypt, mongodb adapter etc that cannot be run in edge runtime
export default {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/checkout(\/.*)?/,
        /\/account(\/.*)?/,
        /\/admin(\/.*)?/,
      ]
      const { pathname } = request.nextUrl
      //if path includes checkout, account or admin, check and return if user is authenticated
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth
      // if not in the protected path, return true
      return true
    },
  },
} satisfies NextAuthConfig