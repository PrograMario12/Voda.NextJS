import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const isAuthPage = nextUrl.pathname.startsWith("/api/auth") || nextUrl.pathname === "/login";

      if (isAuthPage) {
        return true;
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL("/api/auth/signin", nextUrl));
      }

      // RBAC checks
      if (role === "GUEST" && (nextUrl.pathname.startsWith("/new") || nextUrl.pathname.startsWith("/settings"))) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (role === "USER" && nextUrl.pathname.startsWith("/settings")) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    }
  }
}).auth;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};