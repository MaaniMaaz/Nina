import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPageById } from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";
import AdminPageEditor from "@/components/admin/AdminPageEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit page | Nina Admin",
  robots: { index: false, follow: false },
};

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/nina/admin");
  }
  if (!isMongoConfigured()) {
    return (
      <div className="p-8 text-ink">
        MongoDB is not configured. Set MONGODB_URI in .env.local.
      </div>
    );
  }
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();

  return <AdminPageEditor page={page} />;
}
