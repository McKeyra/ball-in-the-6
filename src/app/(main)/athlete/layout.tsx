import { SportProvider } from '@/lib/athlete/sport-context';

export default function AthleteLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <SportProvider>{children}</SportProvider>;
}
