"use client";

export default function DeleteButton({ action, label }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${label}"? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="adm-btn adm-btn-danger">Delete</button>
    </form>
  );
}
