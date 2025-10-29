// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/onboarding(.*)",
//   "/organization(.*)",
//   "/project(.*)",
//   "/issue(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const authObj = await auth();

//   if (!authObj.userId && isProtectedRoute(req)) {
//     return authObj.redirectToSignIn();
//   }

//   if (
//     auth().userId &&
//     !auth().orgId &&
//     req.nextUrl.pathname !== "/onboarding" &&
//     req.nextUrl.pathname !== "/"
//   ) {
//     return NextResponse.redirect(new URL("/onboarding", req.url));
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();

  // Redirect to sign-in if user is not authenticated and accessing protected route
  if (!authObj.userId && isProtectedRoute(req)) {
    return authObj.redirectToSignIn();
  }

  // Redirect to onboarding if user is authenticated but not in an organization
  if (
    authObj.userId &&
    !authObj.orgId &&
    req.nextUrl.pathname !== "/onboarding" &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
