"use client";

import { useMemo, useState } from "react";
import AIConceptPreview from "@/components/AIConceptPreview";

type BuilderKind = "caricature" | "gift" | "business" | "personalised" | "contact";

const OPTIONS: Record<BuilderKind, { title: string; purpose: string[]; style: string[]; output: string[] }> = {
  caricature: { title: "Shape your caricature idea", purpose: ["Birthday portrait", "Wedding or anniversary", "Family and pet", "Retirement or team tribute"], style: ["Warm watercolour", "Playful editorial", "Elegant minimal", "Colourful story scene"], output: ["Digital file", "Framed print", "Canvas", "Gift presentation"] },
  gift: { title: "Imagine a custom gift direction", purpose: ["Wedding", "Birthday", "Housewarming", "Festival", "Team or client"], style: ["Botanical hand-painted", "Indian folk inspired", "Modern geometric", "Quiet premium"], output: ["One keepsake", "Gift box", "Coordinated set", "Bulk gifting direction"] },
  business: { title: "Visualise a project direction", purpose: ["Corporate gifting", "Office artwork", "Hospitality or retail", "Event or festive programme"], style: ["Brand-aware minimal", "Contemporary Indian", "Botanical warm", "Folk-inspired story"], output: ["Presentation concept", "Gift-set direction", "Wall-art series", "Space mood"] },
  personalised: { title: "Imagine your personal piece", purpose: ["Portrait or memory", "Home artwork", "Occasion gift", "Personal name plate"], style: ["Watercolour", "Botanical", "Modern abstract", "Indian folk inspired"], output: ["Digital artwork", "Framed print", "Canvas", "Hand-painted direction"] },
  contact: { title: "Turn your first idea into a visual brief", purpose: ["Custom artwork", "Personalised gift", "Corporate project", "Art for a space"], style: ["Let Deepti guide me", "Warm botanical", "Modern and calm", "Rich Indian colour"], output: ["Concept image", "Gift direction", "Wall-art direction", "Project mood"] },
};

export default function CreativeConceptBuilder({ kind }: { kind: BuilderKind }) {
  const config = OPTIONS[kind];
  const [purpose, setPurpose] = useState("");
  const [style, setStyle] = useState("");
  const [output, setOutput] = useState("");
  const [story, setStory] = useState("");
  const ready = Boolean(purpose && style && output);
  const message = useMemo(() => [
    "Hello Artzy's Studio, I created an Artzy Muse direction.",
    `Project: ${purpose || "Please guide me"}`,
    `Style: ${style || "Please guide me"}`,
    `Preferred output: ${output || "Please guide me"}`,
    `Story or requirement: ${story.trim() || "I would like Deepti's guidance."}`,
    "The image is an AI concept only. Please confirm feasibility, final design, price and delivery time.",
  ].join("\n"), [purpose, style, output, story]);

  return <section className="creative-concept-builder" aria-labelledby={`${kind}-concept-title`}>
    <header><span>Artzy Muse · guided concept</span><h2 id={`${kind}-concept-title`}>{config.title}.<br/><em>Then make it real with the studio.</em></h2><p>Make three easy choices. Muse creates a clearly labelled inspiration image; Deepti’s studio confirms what can actually be created.</p></header>
    <div className="creative-concept-builder__choices">
      <label><b>1 · Purpose</b><select value={purpose} onChange={(event) => setPurpose(event.target.value)}><option value="">Choose the closest purpose</option>{config.purpose.map(item => <option key={item}>{item}</option>)}</select></label>
      <label><b>2 · Visual feeling</b><select value={style} onChange={(event) => setStyle(event.target.value)}><option value="">Choose a direction</option>{config.style.map(item => <option key={item}>{item}</option>)}</select></label>
      <label><b>3 · Intended result</b><select value={output} onChange={(event) => setOutput(event.target.value)}><option value="">Choose an output</option>{config.output.map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="creative-concept-builder__story"><b>Your story or requirement <small>optional</small></b><textarea rows={3} maxLength={280} value={story} onChange={(event) => setStory(event.target.value)} placeholder="Who it is for, room, occasion, colours, important details or quantity..."/></label>
    </div>
    <AIConceptPreview title={`Artzy Muse · ${purpose || config.title}`} studioMessage={message} enabled={ready} disabledHint="Choose a purpose, visual feeling and intended result to unlock your preview." brief={{ kind: kind === "contact" ? "personalised" : kind, style: style || "Artzy Studio recommendation", palette: "warm terracotta, cream, muted rose and olive", purpose: `${purpose}. ${output}. ${story}` }}/>
  </section>;
}
