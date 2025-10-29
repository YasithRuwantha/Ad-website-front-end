import type { User } from "./auth-context"

export const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/ads",
  "/admin/users",
  "/admin/support",
  "/admin/analytics",
  "/admin/settings",
]

export const USER_ROUTES = ["/dashboard", "/ads", "/products", "/earnings", "/referrals", "/support"]

export const isAdminRoute = (pathname: string): boolean => {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route))
}

export const isUserRoute = (pathname: string): boolean => {
  return USER_ROUTES.some((route) => pathname.startsWith(route))
}

export const canAccessRoute = (user: User | null, pathname: string): boolean => {
  if (!user) return false

  if (user.role === "admin") {
    return isAdminRoute(pathname)
  }

  return isUserRoute(pathname)
}

export const getRedirectPath = (user: User | null): string => {
  if (!user) return "/"
  return user.role === "admin" ? "/admin/dashboard" : "/dashboard"
}
