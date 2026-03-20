import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-void">
      {children}
    </div>
  );
}
