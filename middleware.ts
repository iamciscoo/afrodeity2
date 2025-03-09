import { auth } from "@/auth"

export default auth((req) => {
  // req.auth // Session
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login')

  if (isAuthPage) {
    if (isAuth) {
      return Response.redirect(new URL('/', req.nextUrl))
    }
    return null
  }

  if (!isAuth && !isAuthPage) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return Response.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl)
    );
  }

  return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 