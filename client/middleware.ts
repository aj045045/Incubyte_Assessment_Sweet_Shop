import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const path = url.pathname

  const isProtectedRoute = path.startsWith('/u/')

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value
    const role = request.cookies.get('role')?.value

    const isAuthenticated = Boolean(token && role)

    if (!isAuthenticated) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}
