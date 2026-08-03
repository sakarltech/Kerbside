import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const role = (session.user as { role?: string })?.role;

  if (role === 'INSTRUCTOR') {
    redirect('/dashboard/instructor');
  } else {
    redirect('/dashboard/student');
  }
}
