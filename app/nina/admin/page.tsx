import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Nina Ross FM",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const authenticated = await isAdminAuthenticated();
  return <AdminDashboard authenticated={authenticated} />;
}
