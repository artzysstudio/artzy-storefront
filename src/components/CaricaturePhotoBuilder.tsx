"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

const STYLES = ["Warm watercolour", "Playful editorial", "Elegant minimal", "Colourful story scene"];
const OCCASIONS = ["Birthday", "Wedding or anniversary", "Family memory", "Retirement or team tribute", "Just for fun"];

async function preparePhoto(file: File): Promise<{ preview: string; base64: string }> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this photo."));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("This image could not be opened."));
    element.src = source;
  });
  const scale = Math.min(1, 896 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(256, Math.round(image.width * scale));
  canvas.height = Math.max(256, Math.round(image.height * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  const preview = canvas.toDataURL("image/jpeg", 0.86);
  return { preview, base64: preview.split(",")[1] };
}

export default function CaricaturePhotoBuilder() {
  const [photo, setPhoto] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [concept, setConcept] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (concept.startsWith("blob:")) URL.revokeObjectURL(concept); }, [concept]);
  const whatsapp = useMemo(() => `https://wa.me/919158680722?text=${encodeURIComponent(["Hello Artzy's Studio, I created a caricature direction.", `Occasion: ${occasion}`, `Style: ${style}`, `Personal details: ${details || "Please guide me"}`, "I understand the AI image is an imaginative likeness concept, not the final artwork or production proof."].join("\n"))}`, [details, occasion, style]);

  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    setError(""); setConcept("");
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 8 * 1024 * 1024) { setError("Choose a JPG, PNG or WebP photo up to 8 MB."); return; }
    try { const prepared = await preparePhoto(file); setPhoto(prepared.preview); setImageBase64(prepared.base64); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not prepare this photo."); }
  }

  async function generate() {
    if (!imageBase64 || !consent || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/muse/caricature", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image_b64: imageBase64, style, occasion, details }) });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || "The concept could not be generated.");
      setConcept(URL.createObjectURL(await response.blob()));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The concept could not be generated."); }
    finally { setBusy(false); }
  }

  return <section className="caricature-builder" id="caricature-builder" aria-labelledby="caricature-builder-title">
    <div className="caricature-builder__intro"><span className="service-eyebrow">Try it with your photograph</span><h2 id="caricature-builder-title">From a familiar face<br/><em>to a playful first concept.</em></h2><p>Upload a clear photograph, choose a feeling and add the details that make the person special. Artzy Muse creates a likeness concept for discussion; Deepti’s studio refines the final composition and confirms production.</p><ul><li>Your upload is used for this generation request and is not saved by the storefront.</li><li>Use a front-facing, well-lit photo with every face fully visible.</li><li>AI can change facial details. The final likeness is reviewed with the studio.</li></ul></div>
    <div className="caricature-builder__panel">
      <div className="caricature-builder__fields">
        <label className="caricature-upload"><b>1 · Add a reference photo</b><span>{photo ? "Choose another photo" : "Take or upload a photo"}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto}/><small>JPG, PNG or WebP · maximum 8 MB</small></label>
        <label><b>2 · Occasion</b><select value={occasion} onChange={event => setOccasion(event.target.value)}>{OCCASIONS.map(item => <option key={item}>{item}</option>)}</select></label>
        <label><b>3 · Illustration feeling</b><select value={style} onChange={event => setStyle(event.target.value)}>{STYLES.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="caricature-builder__details"><b>4 · What makes them, them? <small>optional</small></b><textarea maxLength={240} rows={3} value={details} onChange={event => setDetails(event.target.value)} placeholder="Hobbies, profession, favourite colours, pet, memorable place or gift message…"/></label>
        <label className="caricature-builder__consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/><span>I have permission from everyone shown. For a child’s photo, I am their parent or guardian.</span></label>
        <button type="button" onClick={generate} disabled={!photo || !consent || busy}>{busy ? "Creating your concept…" : "Create AI caricature concept"}</button>
        {error && <p className="caricature-builder__error" role="alert">{error}</p>}
      </div>
      <div className="caricature-builder__comparison">
        <figure className={!photo ? "is-empty" : ""}>{photo ? <img src={photo} alt="Customer reference preview"/> : <div><span>01</span><b>Your reference photo</b><small>Upload a photograph to begin</small></div>}<figcaption>Reference photo · visible only for this preview</figcaption></figure>
        <span className="caricature-builder__arrow" aria-hidden="true">→</span>
        <figure className={!concept ? "is-empty" : ""}>{concept ? <img src={concept} alt="AI-generated caricature likeness concept"/> : <div><span>02</span><b>Your caricature concept</b><small>Choose your direction, then generate</small></div>}<figcaption>AI likeness concept · not a final artwork</figcaption></figure>
      </div>
      {concept && <div className="caricature-builder__actions"><a href={concept} download="artzy-caricature-concept.png">Download concept</a><a href={whatsapp} target="_blank" rel="noreferrer">Ask the studio on WhatsApp</a></div>}
    </div>
  </section>;
}
