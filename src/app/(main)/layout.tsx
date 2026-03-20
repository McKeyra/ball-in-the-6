import { BottomNav } from '@/components/navigation/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-void relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)] opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime/[0.02] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-accent-purple/[0.02] rounded-full blur-[120px] -translate-x-1/3" />
      </div>
      <div className="relative z-10">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
