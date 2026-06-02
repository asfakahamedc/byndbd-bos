import { getCurrentUser } from '@/actions/auth';
import { redirect } from 'next/navigation';

/**
 * Root Route: Acting as the global traffic director for user sessions.
 * Inspects the current session and auto-routes users to their respective layers.
 */
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  let redirectPath = '/login';
  switch (user.layer) {
    case 0:
      redirectPath = '/owner';
      break;
    case 1:
    case 2:
      redirectPath = '/ceo';
      break;
    case 3:
      redirectPath = '/operations';
      break;
    case 4:
      redirectPath = '/executive';
      break;
    case 5:
      redirectPath = '/host';
      break;
    default:
      redirectPath = '/login';
  }

  redirect(redirectPath);
}
