import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { toInputValue } from "@/lib/admin-collections";

export default function ItemForm({ config, action, item = {}, cancelHref }) {
  return (
    <form action={action} className="adm-form">
      {config.fields.map((field) => {
        const value = toInputValue(field, item[field.name]);
        return (
          <div className="adm-field" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="adm-required"> *</span>}
            </label>
            <Input field={field} value={value} />
            {field.hint && <p className="adm-hint">{field.hint}</p>}
          </div>
        );
      })}
      <div className="adm-actions">
        <button type="submit" className="adm-btn adm-btn-primary">Save</button>
        {cancelHref && <Link href={cancelHref} className="adm-btn adm-btn-ghost">Cancel</Link>}
      </div>
    </form>
  );
}

function Input({ field, value }) {
  const common = { id: field.name, name: field.name, required: field.required, placeholder: field.placeholder };
  switch (field.type) {
    case "textarea":
    case "pairs":
      return <textarea {...common} defaultValue={value} rows={field.rows || 5} />;
    case "image":
      return <ImageUpload name={field.name} defaultValue={value} />;
    case "checkbox":
      return <input type="checkbox" id={field.name} name={field.name} defaultChecked={value} className="adm-checkbox" />;
    case "number":
      return <input {...common} type="number" min={field.min} max={field.max} defaultValue={value} />;
    case "select":
      return (
        <select {...common} defaultValue={value || field.options[0]}>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    case "url":
      return <input {...common} type="url" defaultValue={value} placeholder={field.placeholder || "https://"} />;
    case "date":
      return <input {...common} type="date" defaultValue={value} />;
    default:
      return <input {...common} type="text" defaultValue={value} />;
  }
}
