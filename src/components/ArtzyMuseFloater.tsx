"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type MuseMessage = { id: number; role: "assistant" | "customer"; text: string; action?: { href: string; label: string } };

const quickQuestions = [
  "Help me choose the right product",
  "Plan a meaningful gift",
  "Stock, variants and delivery",
];

const studioAnswers = [
  {
    words: ["gift", "birthday", "anniversary", "wedding", "occasion"],
    answer: "I’d be happy to help you choose something that feels personal. Tell me who it is for, the occasion, your budget and the date you need it. I’ll guide you towards handmade gifts, personalised art, caricatures or a studio-planned hamper.",
    action: { href: "/gifts/#gift-finder", label: "Find a meaningful gift" },
  },
  {
    words: ["custom", "customise", "customized", "personalise", "personalised"],
    answer: "Artzy’s Studio can personalise names, messages, colours, themes, portraits, caricatures, sizes and business branding. Start with the idea that matters to you; the studio will confirm the material, price, production time and what will look best.",
    action: { href: "/personalised/", label: "Explore personalisation" },
  },
  {
    words: ["digital", "print", "abstract", "geometric", "decor"],
    answer: "For wall art, tell me the room, wall size, colours you already have and the feeling you want. Explore modern, floral, geometric and Indian-inspired directions, then use an ArtzyAI concept as a conversation starter with the studio.",
    action: { href: "/digital-prints/#digital-planner", label: "Plan digital art" },
  },
  {
    words: ["caricature", "portrait", "face", "photo"],
    answer: "A caricature is ideal when you want a recognisable, joyful story about a person, couple, family or team. Use a clear front-facing photo and share the occasion, personality, profession, hobbies and preferred style.",
    action: { href: "/caricatures/", label: "Create a caricature brief" },
  },
  {
    words: ["corporate", "bulk", "employee", "client", "branding"],
    answer: "For business gifting or décor, I’ll help turn the purpose, audience, setting, quantity, brand colours, budget and deadline into a clear visual direction. You can create up to five ArtzyAI concepts before asking the studio to develop the strongest one.",
    action: { href: "/for-business/#business-concept", label: "Plan a business concept" },
  },
  {
    words: ["delivery", "dispatch", "stock", "available", "availability", "time"],
    answer: "Live stock and variants come from Artzy ERP and appear on the product page when available. Delivery depends on your PIN code and whether the piece is ready, personalised or made to order. I won’t invent availability—the studio confirms the final date before you commit.",
    action: { href: "/shop/", label: "View current studio products" },
  },
  {
    words: ["visit", "address", "location", "pune", "contact", "whatsapp"],
    answer: "You’re welcome at Artzy’s Studio, Ground Floor, Preetishilp Building, Lane 3, Plot 22, Prashant Society, Paud Road, Kothrud, Pune 411038. For personal guidance, WhatsApp +91 91586 80722 or email artzysstudio@gmail.com.",
    action: { href: "/contact/", label: "See studio and contact details" },
  },
  {
    words: ["name plate", "nameplate", "door", "house name"],
    answer: "A name plate should suit both the family and the entrance. Choose the wording, shape, size, lettering and an Indian art direction such as botanical, Warli, Madhubani, lotus or geometric. ArtzyAI can help you visualise the idea before the studio confirms the practical design.",
    action: { href: "/name-plates/#name-plate-builder", label: "Build a name plate" },
  },
  {
    words: ["artzyai", "ai", "concept", "generate", "preview"],
    answer: "ArtzyAI creates imaginative, clearly labelled concept previews from your completed brief. They help you explore a direction; they are not ERP stock or a production proof. Select the idea you like, then Artzy’s Studio confirms feasibility, finish, price and delivery.",
    action: { href: "/ai-concept-disclosure/", label: "How ArtzyAI concepts work" },
  },
];

const answerQuestion = (question: string) => {
  const normalised = question.toLowerCase();
  const match = studioAnswers.find((entry) => entry.words.some((word) => normalised.includes(word)));
  return match || {
    answer: "I want to guide you accurately, so I won’t guess. Tell me what you are looking for, who it is for, your budget, preferred colours or style, and when you need it. If your question needs a stock, price, production or delivery decision, I’ll take you directly to Deepti’s studio.",
    action: { href: "/contact/", label: "Ask the studio personally" },
  };
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
    { id: 1, role: "assistant", text: "Namaste. I’m Artzy Muse, your senior studio guide. Tell me what you are choosing, who it is for, your budget or where the artwork will live, and I’ll help you find the clearest next step." },
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
    const response = answerQuestion(clean);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "customer", text: clean },
      { id: nextId.current++, role: "assistant", text: response.answer, action: response.action },
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
                <div><p>{message.text}</p>{message.action && <Link className="muse-message-action" href={message.action.href} onClick={() => setIsOpen(false)}>{message.action.label} <span aria-hidden="true">→</span></Link>}</div>
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

          <div className="muse-imagine-links"><span>CREATE AN AI CONCEPT</span><p>Complete a custom brief first, then generate a clearly labelled imaginative preview.</p><div><Link href="/name-plates/#name-plate-builder" onClick={() => setIsOpen(false)}>Name plate preview</Link><Link href="/digital-prints/#digital-planner" onClick={() => setIsOpen(false)}>Digital art preview</Link></div></div>
          <p className="muse-chat-note">Muse helps you choose with confidence. Live stock comes from Artzy ERP; final price, custom feasibility and delivery are confirmed by the studio.</p>
          <Link className="muse-guide-contact" href="/contact" onClick={() => setIsOpen(false)}>
            Speak with Deepti’s studio <span>&rarr;</span>
          </Link>
        </aside>
      </div>
      <style jsx global>{`
        .muse-floater-mark {
          overflow: visible !important;
          background: #a64e52 !important;
          color: #fffaf4 !important;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.32), 0 5px 14px rgba(113,47,52,.18) !important;
        }
        .muse-panel-mark,
        .muse-message > span {
          background: #a64e52 !important;
          color: #fffaf4 !important;
        }
        .muse-flower-petals ellipse {
          fill: none;
          stroke: currentColor;
          stroke-width: 2.15;
        }
        .muse-flower-centre {
          fill: #a64e52;
          stroke: currentColor;
          stroke-width: 2;
        }
        .muse-imagine-links{margin:12px 0;padding:14px;border:1px solid #dfcfc4;background:#fbf3ec}.muse-imagine-links>span{color:#a44a4f;font-size:.57rem;font-weight:800;letter-spacing:.12em}.muse-imagine-links p{margin:6px 0 10px;color:#725f55;font-size:.64rem;line-height:1.4}.muse-imagine-links>div{display:flex;flex-wrap:wrap;gap:6px}.muse-imagine-links a{padding:7px 9px;border:1px solid #b66a6c;border-radius:999px;color:#934147;font-size:.59rem;font-weight:750;text-decoration:none}
        .muse-flower-dot { fill: #f3cf92; stroke: none; }
        .muse-floater-mark::after { border-color: rgba(166,78,82,.25) !important; }
        .muse-quick-questions {
          display: grid !important;
          grid-auto-flow: column;
          grid-auto-columns: max-content;
          justify-content: start;
          width: 100%;
          max-width: 100%;
          overflow-x: auto !important;
          overflow-y: hidden;
          padding: 12px 2px 11px !important;
          scroll-padding-inline: 2px;
          scroll-snap-type: x proximity;
          scrollbar-width: thin !important;
          scrollbar-color: #c98e91 #f1e5dc;
          overscroll-behavior-inline: contain;
          touch-action: pan-x;
        }
        .muse-quick-questions::-webkit-scrollbar { display: block !important; height: 4px; }
        .muse-quick-questions::-webkit-scrollbar-track { background: #f1e5dc; border-radius: 99px; }
        .muse-quick-questions::-webkit-scrollbar-thumb { background: #c98e91; border-radius: 99px; }
        .muse-quick-questions button {
          scroll-snap-align: start;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
