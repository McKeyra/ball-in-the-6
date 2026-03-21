import { redirect } from 'next/navigation';

export default function FanPage(): never {
  redirect('/fan/live-scores');
}
