import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getCollection } from "@/lib/admin-collections";
import { adminModels } from "@/lib/admin-models";
import { saveItem, deleteItem } from "@/app/admin/actions";
import ItemForm from "@/components/admin/ItemForm";
import DeleteButton from "@/components/admin/DeleteButton";
import Flash from "@/components/admin/Flash";

export default async function CollectionPage({ params, searchParams }) {
  await requireAdmin();
  const { collection } = await params;
  const flash = await searchParams;
  const config = getCollection(collection);
  if (!config) notFound();

  await connectDB();
  const Model = adminModels[collection];

  if (config.singleton) {
    const item = (await Model.findOne().lean()) || {};
    return (
      <>
        <h1>{config.label}</h1>
        <Flash {...flash} />
        <ItemForm config={config} action={saveItem.bind(null, collection, null)} item={item} />
      </>
    );
  }

  const items = await Model.find().sort(config.sort).lean();

  return (
    <>
      <div className="adm-head">
        <h1>{config.label}</h1>
        <Link href={`/admin/${collection}/new`} className="adm-btn adm-btn-primary">+ Add {config.singular}</Link>
      </div>
      <Flash {...flash} />
      {items.length === 0 ? (
        <p className="adm-sub">Nothing here yet.</p>
      ) : (
        <ul className="adm-list">
          {items.map((item) => {
            const id = item._id.toString();
            const title = item[config.titleField] || "(untitled)";
            return (
              <li key={id} className="adm-card adm-row">
                <Link href={`/admin/${collection}/${id}`} className="adm-row-main">
                  <span className="adm-row-title">{title}</span>
                  {item[config.subtitleField] && <span className="adm-row-sub">{item[config.subtitleField]}</span>}
                </Link>
                <Link href={`/admin/${collection}/${id}`} className="adm-btn adm-btn-ghost">Edit</Link>
                <DeleteButton action={deleteItem.bind(null, collection, id)} label={title} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
