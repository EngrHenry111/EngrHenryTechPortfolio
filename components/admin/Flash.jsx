export default function Flash({ saved, deleted, error }) {
  if (error) return <p className="adm-flash adm-flash-error">{error}</p>;
  if (saved) return <p className="adm-flash">Saved. Your portfolio is updated.</p>;
  if (deleted) return <p className="adm-flash">Deleted.</p>;
  return null;
}
