import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Public pages that should be accessible without login
  const isPublicPage =
    pathname === "/" ||
    pathname === "/Landing-page" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/about") ||     
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/features")

  // Auth-related pages (should redirect away when logged in)
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // 1. Logged out → force login for protected routes
  if (!session && !isPublicPage) {
    const redirectUrl = new URL("/login", req.url)
    // Optional: add ?redirect=original_path so you can send them back after login
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Logged in → redirect away from login/signup to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // 3. Special case: logged in user hits root → send to dashboard
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // 4. Logged out user hits root → allow (shows landing page)
  //    already covered by isPublicPage

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - static files (.*\\..*)
     * - Next.js internal routes (_next/...)
     * - API routes (api/...)
     * - favicon, robots.txt, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}