"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ARTZY_LOGO } from "@/components/layout/Header";

const musePaths = [
  // Keep each route direct and descriptive for first-time mobile shoppers.
  {
    title: "Find the right piece",
    hint: "Tell us the room, colour mood or budget you have in mind.",
    href: "/shop",
    label: "Explore the collection",
  },
  {
    title: "Create a personal gift",
    hint: "Share the occasion, recipient and story you want the gift to carry.",
    href: "/contact?type=personalised",
    label: "Plan a personal gift",
  },
  {
    title: "Discuss custom or corporate work",
    hint: "Ask about quantities, timelines, themes, branding and custom artwork.",
    href: "/contact?type=corporate",
    label: "Start a conversation",
  },
];

export default function ArtzyMuseFloater() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        className={`muse-floater${isOpen ? " open" : ""}`}
        type="button"
        aria-label={isOpen ? "Close Artzy Muse" : "Ask Artzy Muse"}
        aria-expanded={isOpen}
        aria-controls="artzy-muse-guide"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="muse-floater-mark" aria-hidden="true">
          <img src={ARTZY_LOGO} alt="" draggable="false" />
        </span>
        <span className="muse-floater-copy"><strong>Ask me</strong><small>Artzy Muse</small></span>
      </button>

      <div className={`muse-guide-shell${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
        <button className="muse-guide-backdrop" type="button" aria-label="Close Artzy Muse" onClick={() => setIsOpen(false)} />
        <aside id="artzy-muse-guide" className="muse-guide" role="dialog" aria-modal="true" aria-labelledby="muse-guide-title">
          <div className="muse-guide-top">
            <div className="muse-guide-brand">
              <img src={ARTZY_LOGO} alt="Artzy's Studio" draggable="false" />
              <span>Artzy Muse</span>
            </div>
            <button type="button" aria-label="Close Artzy Muse" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="muse-guide-intro">
            <span>Your studio guide</span>
            <h2 id="muse-guide-title">A little help choosing something meaningful.</h2>
            <p>
              Artzy Muse helps you understand the collection, narrow down gift ideas
              and prepare a clear brief for Deepti and the studio.
            </p>
            <small>
              This guided assistant does not replace personal advice. For custom
              artwork, availability or delivery commitments, the studio confirms every detail.
            </small>
          </div>

          <div className="muse-guide-paths">
            {musePaths.map((path, index) => (
              <Link href={path.href} key={path.title} onClick={() => setIsOpen(false)}>
                <span>0{index + 1}</span>
                <div><strong>{path.title}</strong><small>{path.hint}</small></div>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>

          <div className="muse-guide-hints">
            <strong>Helpful details to keep ready</strong>
            <ul>
              <li>A room or reference photograph</li>
              <li>Your preferred size, colours and budget</li>
              <li>The occasion and required delivery date</li>
            </ul>
          </div>

          <Link className="muse-guide-contact" href="/contact" onClick={() => setIsOpen(false)}>
            Ask the studio directly <span>→</span>
          </Link>
        </aside>
      </div>
    </>
  );
}
