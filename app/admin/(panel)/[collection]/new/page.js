import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCollection } from "@/lib/admin-collections";
import { saveItem } from "@/app/admin/actions";
import ItemForm from "@/components/admin/ItemForm";
import Flash from "@/components/admin/Flash";

export default async function NewItemPage({ params, searchParams }) {
  await requireAdmin();
  const { collection } = await params;
  const config = getCollection(collection);
  if (!config || config.singleton) notFound();

  return (
    <>
      <h1>Add {config.singular}</h1>
      <Flash {...(await searchParams)} />
      <ItemForm
        config={config}
        action={saveItem.bind(null, collection, null)}
        cancelHref={`/admin/${collection}`}
      />
    </>
  );
}
