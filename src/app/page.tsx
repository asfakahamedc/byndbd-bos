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
        <div className="w-full max-w-2xl bg-red-50 text-red-900 border-2 border-black rounded-[6px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
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

          <div className="font-mono text-xs bg-slate-900 text-slate-100 p-4 border border-slate-700 overflow-x-auto w-full max-w-2xl mt-4 whitespace-pre-wrap rounded-[6px]">
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

  if ((user as any).role === 'Guest' || user.layer > 5) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-[#FAF9F2] font-sans">
        <div className="w-full max-w-md bg-white border border-[#E0E0E0] rounded-lg shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#FF5F0F]/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[#FF5F0F] text-[32px]">pending_actions</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl text-[#1D1D1B] font-poppins font-bold">Account Pending</h1>
            <p className="text-sm text-[#555555] font-ubuntu">
              Your account is successfully authenticated, but has not yet been assigned a workspace role.
            </p>
          </div>
          <div className="p-4 bg-[#FAF9F2] border border-[#E0E0E0] rounded-[6px] text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1B] mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#FF5F0F]">info</span>
              <span>Next Steps:</span>
            </div>
            <p className="text-xs text-[#555555] font-ubuntu leading-relaxed">
              Please contact your system administrator to assign your organizational layer and department. Once assigned, you will automatically access your dashboard upon refreshing.
            </p>
          </div>
        </div>
      </main>
    );
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

export const dynamic = "force-dynamic";
