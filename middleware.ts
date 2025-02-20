// import createMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'

import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const {auth: middleware} = NextAuth(authConfig)

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}

// const publicPages = [
//   '/',
//   '/search',
//   '/sign-in',
//   '/sign-up',
//   '/cart',
//   '/cart/(.*)',
//   '/product/(.*)',
//   '/page/(.*)',
//   // (/secret requires auth)
// ]

// const intlMiddleware = createMiddleware(routing)
// const { auth } = NextAuth(authConfig)

// export default auth((req) => {
//   const publicPathnameRegex = RegExp(
//     `^(/(${routing.locales.join('|')}))?(${publicPages
//       .flatMap((p) => (p === '/' ? ['', '/'] : p))
//       .join('|')})/?$`,
//     'i'
//   )
//   const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

//   if (isPublicPage) {
//     // return NextResponse.next()
//     return intlMiddleware(req)
//   } else {
//     if (!req.auth) {
//       const newUrl = new URL(
//         `/sign-in?callbackUrl=${
//           encodeURIComponent(req.nextUrl.pathname) || '/'
//         }`,
//         req.nextUrl.origin
//       )
//       return Response.redirect(newUrl)
//     } else {
//       return intlMiddleware(req)
//     }
//   }
// })

// export const config = {
//   // Skip all paths that should not be internationalized
//   matcher: ['/((?!api|_next|.*\\..*).*)'],
// }