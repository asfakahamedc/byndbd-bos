export const dynamic = "force-dynamic";

import { getCurrentUser } from '@/actions/auth';
import { redirect } from 'next/navigation';

/**
 * Root Route: Acting as the global traffic director for user sessions.
 * Inspects the current session and auto-routes users to their respective layers.
 */
export default async function Home() {
  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error('Root page exception:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';

    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50 font-sans">
        <div className="w-full max-w-2xl bg-red-50 text-red-900 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide">
            🚨 BOS SYSTEM DIAGNOSTICS CRITICAL
          </h1>
          <p className="mb-4">
            An unexpected server-side exception occurred while executing core routing logic.
          </p>

          <div className="mb-4">
            <h2 className="font-semibold mb-2">Troubleshooting Checklist:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify that your Supabase credentials on Vercel do not contain literal quotes.</li>
              <li>Verify that you have run the database migration DDL scripts in your production Supabase SQL Editor.</li>
              <li>Verify that your Vercel Project has been fully re-deployed after changing any environment variables.</li>
            </ul>
          </div>

          <div className="font-mono text-xs bg-slate-900 text-slate-100 p-4 border border-slate-700 overflow-x-auto w-full max-w-2xl mt-4 whitespace-pre-wrap rounded-none">
            {errorMessage}
            {errorStack ? `\n\n${errorStack}` : ''}
          </div>
        </div>
      </main>
    );
  }

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
