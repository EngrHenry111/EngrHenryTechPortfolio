import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getCollection } from "@/lib/admin-collections";
import { adminModels } from "@/lib/admin-models";
import { saveItem } from "@/app/admin/actions";
import ItemForm from "@/components/admin/ItemForm";
import Flash from "@/components/admin/Flash";

export default async function EditItemPage({ params, searchParams }) {
  await requireAdmin();
  const { collection, id } = await params;
  const config = getCollection(collection);
  if (!config || config.singleton || !mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const item = await adminModels[collection].findById(id).lean();
  if (!item) notFound();

  return (
    <>
      <h1>Edit {config.singular}</h1>
      <Flash {...(await searchParams)} />
      <ItemForm
        config={config}
        action={saveItem.bind(null, collection, id)}
        item={item}
        cancelHref={`/admin/${collection}`}
      />
    </>
  );
}
