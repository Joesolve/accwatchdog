import { Providers } from "@/components/Providers";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export const metadata = {
  title: {
    default: "Admin Portal | ACC Sierra Leone",
    template: "%s | ACC Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </Providers>
  );
}
