import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page instead of dashboard
  redirect('/login');
}
