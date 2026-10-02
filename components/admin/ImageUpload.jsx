"use client";
import { useState } from "react";
import { getUploadSignature } from "@/app/admin/actions";

export default function ImageUpload({ name, defaultValue = "" }) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const sig = await getUploadSignature();
      if (sig.error) throw new Error(sig.error);

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", sig.timestamp);
      body.append("folder", sig.folder);
      body.append("signature", sig.signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: "POST",
        body
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Upload failed");
      setUrl(json.secure_url);
      setStatus("Uploaded — remember to click Save.");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="adm-image">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="adm-image-preview" />
      )}
      <div className="adm-image-controls">
        <label className="adm-btn adm-btn-ghost">
          {busy ? "Uploading…" : url ? "Replace image" : "Upload image"}
          <input type="file" accept="image/*" onChange={handleFile} disabled={busy} hidden />
        </label>
        {url && (
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setUrl("")}>
            Remove
          </button>
        )}
      </div>
      <input
        type="text"
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste an image URL"
      />
      {status && <p className="adm-hint">{status}</p>}
    </div>
  );
}
