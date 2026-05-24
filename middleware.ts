import { withAuth } from 'next-auth/middleware';

// Protects everything under /admin/* except the login page.
// Unauthenticated admins are redirected to /admin/login automatically.
export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export const config = {
  matcher: [
    // Protect /admin (dashboard) exactly.
    '/admin',
    // Protect all /admin/* routes except /admin/login.
    '/admin/((?!login).*)',
  ],
};
