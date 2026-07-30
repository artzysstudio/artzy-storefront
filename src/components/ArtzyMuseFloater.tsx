"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type MuseMessage = { id: number; role: "assistant" | "customer"; text: string };

const quickQuestions = [
  "Help me choose a gift",
  "What can be customised?",
  "Delivery and availability",
];

const studioAnswers = [
  {
    words: ["gift", "birthday", "anniversary", "wedding", "occasion"],
    answer: "For a meaningful gift, tell me the occasion, recipient, budget and required date. Artzy’s Studio can suggest personalised art, caricatures, hand-painted pieces, combination gifts or corporate gifting options.",
  },
  {
    words: ["custom", "customise", "customized", "personalise", "personalised"],
    answer: "Custom work can include names, messages, colours, themes, portraits, caricatures, sizes and corporate branding. Final possibilities depend on the chosen product, material and delivery date.",
  },
  {
    words: ["digital", "print", "abstract", "geometric", "decor"],
    answer: "Digital prints can be created for home or corporate décor in modern, abstract, geometric and requirement-led styles. Share your wall size, colour palette and a room photograph for a clearer recommendation.",
  },
  {
    words: ["caricature", "portrait", "face", "photo"],
    answer: "A caricature turns a person, couple, family or team into a character-led artwork. A clear front-facing photograph, preferred theme, names and occasion help the studio prepare the brief.",
  },
  {
    words: ["corporate", "bulk", "employee", "client", "branding"],
    answer: "Corporate gifts can be planned around quantity, budget, branding, recipient type and delivery schedule. The studio confirms samples, production timing and branding feasibility before the order.",
  },
  {
    words: ["delivery", "dispatch", "stock", "available", "availability", "time"],
    answer: "Stock and variants are shown on each product. Ready pieces usually dispatch in 3–5 working days; made-to-order and personalised work receives a studio-confirmed timeline before production.",
  },
  {
    words: ["visit", "address", "location", "pune", "contact", "whatsapp"],
    answer: "Visit Artzy’s Studio at Prashant Society, Preetishilp Building, Ground Floor, Lane 3, Plot 22, Paud Road, Kothrud, Pune 411038. You may also WhatsApp +91 91586 80722 or email artzysstudio@gmail.com.",
  },
];

const answerQuestion = (question: string) => {
  const normalised = question.toLowerCase();
  const match = studioAnswers.find((entry) => entry.words.some((word) => normalised.includes(word)));
  return match?.answer || "I can help with product selection, personalised gifts, digital prints, caricatures, corporate orders, stock, delivery and visiting the studio. Ask in your own words, or contact Deepti’s studio for a personal recommendation.";
};

function MuseMark() {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Artzy Muse floral motif">
      <g className="muse-flower-petals">
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(45 32 32)" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(90 32 32)" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(135 32 32)" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(180 32 32)" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(225 32 32)" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(270 32 32)" />
        <ellipse cx="32" cy="17.5" rx="5.4" ry="10" transform="rotate(315 32 32)" />
      </g>
      <circle className="muse-flower-centre" cx="32" cy="32" r="6.2" />
      <circle className="muse-flower-dot" cx="32" cy="32" r="2.2" />
    </svg>
  );
}

export default function ArtzyMuseFloater() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MuseMessage[]>([
    { id: 1, role: "assistant", text: "Namaste. I’m Artzy Muse, your studio guide. Tell me what you are choosing, who it is for, or where the artwork will live." },
  ]);
  const nextId = useRef(2);
  const conversationEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) conversationEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "customer", text: clean },
      { id: nextId.current++, role: "assistant", text: answerQuestion(clean) },
    ]);
    setQuestion("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    ask(question);
  };

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
        <span className="muse-floater-mark" aria-hidden="true"><MuseMark /></span>
        <span className="muse-floater-copy"><strong>Ask Artzy Muse</strong><small>Your studio guide</small></span>
      </button>

      <div className={`muse-guide-shell${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
        <button className="muse-guide-backdrop" type="button" aria-label="Close Artzy Muse" onClick={() => setIsOpen(false)} />
        <aside id="artzy-muse-guide" className="muse-guide muse-chat" role="dialog" aria-modal="true" aria-labelledby="muse-guide-title">
          <div className="muse-guide-top">
            <div className="muse-guide-brand">
              <span className="muse-panel-mark" aria-hidden="true"><MuseMark /></span>
              <div><strong>Artzy Muse</strong><small>Artzy’s Studio assistant</small></div>
            </div>
            <button type="button" aria-label="Close Artzy Muse" onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="muse-chat-intro">
            <span>ASK • DISCOVER • CREATE</span>
            <h2 id="muse-guide-title">How may I help?</h2>
            <p>Get relevant guidance about the collection, customisation, gifting, delivery and the studio.</p>
          </div>

          <div className="muse-conversation" aria-live="polite">
            {messages.map((message) => (
              <div className={`muse-message ${message.role}`} key={message.id}>
                {message.role === "assistant" && <span aria-hidden="true"><MuseMark /></span>}
                <p>{message.text}</p>
              </div>
            ))}
            <div ref={conversationEnd} />
          </div>

          <div className="muse-quick-questions" aria-label="Suggested questions">
            {quickQuestions.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}</button>)}
          </div>

          <form className="muse-chat-form" onSubmit={submit}>
            <label htmlFor="muse-question">Ask about Artzy’s Studio</label>
            <div>
              <input id="muse-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Type your question…" autoComplete="off" />
              <button type="submit" aria-label="Send question" disabled={!question.trim()}>&rarr;</button>
            </div>
          </form>

          <p className="muse-chat-note">Muse provides general guidance. Stock, final price, custom feasibility and delivery are confirmed by the studio.</p>
          <Link className="muse-guide-contact" href="/contact" onClick={() => setIsOpen(false)}>
            Speak with Deepti’s studio <span>&rarr;</span>
          </Link>
        </aside>
      </div>
    </>
  );
}
