
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface StoreLayoutShellProps {
  children: React.ReactNode;
  categories?: any[];
}

export function StoreLayoutShell({ children, categories = [] }: StoreLayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
