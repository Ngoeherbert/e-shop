import { AccountLayout } from "@/components/account/AccountLayout";
import { StoreLayout } from "@/components/layout/StoreLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreLayout>
      <AccountLayout>{children}</AccountLayout>
    </StoreLayout>
  );
}
