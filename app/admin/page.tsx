import type { Metadata } from 'next';
import { isAdmin } from '@/lib/cms/auth';
import { getContent } from '@/lib/cms/content';
import { AdminEditor } from './editor';
import { AdminLogin } from './login';
import './admin.css';
export const metadata: Metadata = {
  title: 'Content editor',
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  if (!(await isAdmin()))
    return (
      <div className="admin-shell">
        <AdminLogin />
      </div>
    );
  return (
    <div className="admin-shell">
      <AdminEditor initial={await getContent()} />
    </div>
  );
}
