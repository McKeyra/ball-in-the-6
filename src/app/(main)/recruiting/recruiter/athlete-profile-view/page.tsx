import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Athlete Profile - Recruiter' };

export default function Page(): never {
  redirect('/recruiting/recruiter/athlete-search');
}
