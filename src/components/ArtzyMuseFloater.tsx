"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";

type MuseMessage = { id: number; role: "assistant" | "customer"; text: string; action?: { href: string; label: string } };
type MuseLanguage = "en" | "hi" | "mr";

const greetings: Record<MuseLanguage, string> = {
  en: "Namaste. I’m Artzy Muse, your studio guide. Tell me who or what you are choosing for, your budget, or the feeling you want to create. I’ll suggest the clearest next step.",
  hi: "नमस्ते। मैं Artzy Muse, आपकी स्टूडियो गाइड हूँ। बताइए आप किसके लिए चुन रहे हैं, आपका बजट क्या है और आप कैसा एहसास चाहते हैं। मैं सरल मार्गदर्शन दूँगी।",
  mr: "नमस्कार. मी Artzy Muse, तुमची स्टुडिओ गाइड आहे. तुम्ही कोणासाठी निवडत आहात, बजेट आणि अपेक्षित भावना सांगा. मी सोपे मार्गदर्शन करेन.",
};

const pageContext = (path: string) => {
  if (path.startsWith("/shop")) return "I can help you compare current ERP products, stock, variants and delivery questions.";
  if (path.startsWith("/gifts")) return "Tell me the recipient, occasion, budget and required date, and I’ll help narrow the gift direction.";
  if (path.startsWith("/name-plates")) return "I can help you choose wording, size, shape, lettering and an Indian art direction for the entrance.";
  if (path.startsWith("/caricatures")) return "I can help turn a photo, personality and occasion into a clear caricature brief.";
  if (path.startsWith("/digital-prints")) return "Tell me about the room, wall size, colours and mood, and I’ll help shape the art direction.";
  if (path.startsWith("/for-business")) return "I can organise your business purpose, audience, quantity, budget and deadline into a useful brief.";
  if (path.startsWith("/artzy-world")) return "I can help you preview art in a room and understand scale, placement and colour mood.";
  return "I can help you discover handmade pieces, meaningful gifts, personalised art and studio services.";
};

const quickActions = [
  { icon: "🎁", label: "Find a Gift", question: "Help me find a meaningful gift" },
  { icon: "🎨", label: "Personalise", question: "What can I personalise?" },
  { icon: "🖼️", label: "Explore Art", question: "Help me explore art for my space" },
  { icon: "📦", label: "Order Help", question: "I need help with stock, delivery or an order" },
];

const studioAnswers = [
  { words: ["gift", "birthday", "anniversary", "wedding", "occasion"], answer: "I’d be happy to help you choose something personal. Tell me who it is for, the occasion, your budget and the date you need it. I’ll guide you towards handmade gifts, personalised art, caricatures or a studio-planned hamper.", action: { href: "/gifts/#gift-finder", label: "Find a meaningful gift" } },
  { words: ["custom", "customise", "customized", "personalise", "personalised"], answer: "Artzy’s Studio can personalise names, messages, colours, themes, portraits, caricatures, sizes and business branding. Start with the idea that matters to you; the studio will confirm the material, price, production time and what will look best.", action: { href: "/personalised/", label: "Explore personalisation" } },
  { words: ["digital", "print", "abstract", "geometric", "decor", "explore art", "wall art"], answer: "For wall art, tell me the room, wall size, colours you already have and the feeling you want. Explore modern, floral, geometric and Indian-inspired directions, then use an ArtzyAI concept as a conversation starter with the studio.", action: { href: "/digital-prints/#digital-planner", label: "Plan digital art" } },
  { words: ["caricature", "portrait", "face", "photo"], answer: "A caricature is ideal when you want a recognisable, joyful story about a person, couple, family or team. Use a clear front-facing photo and share the occasion, personality, profession, hobbies and preferred style.", action: { href: "/caricatures/", label: "Create a caricature brief" } },
  { words: ["corporate", "bulk", "employee", "client", "branding"], answer: "For business gifting or décor, I’ll help turn the purpose, audience, setting, quantity, brand colours, budget and deadline into a clear visual direction.", action: { href: "/for-business/#business-concept", label: "Plan a business concept" } },
  { words: ["order", "tracking", "track", "status"], answer: "For an existing order, open your account to see the latest confirmed information. If you cannot find it, I can take you to the studio for personal help.", action: { href: "/account/", label: "View account and orders" } },
  { words: ["delivery", "dispatch", "stock", "available", "availability", "time"], answer: "Live stock and variants come from Artzy ERP and appear on product pages when available. Delivery depends on your PIN code and whether the piece is ready, personalised or made to order. The studio confirms the final date before you commit.", action: { href: "/shop/", label: "View current studio products" } },
  { words: ["visit", "address", "location", "pune", "contact", "whatsapp"], answer: "You’re welcome at Artzy’s Studio, Ground Floor, Preetishilp Building, Lane 3, Plot 22, Prashant Society, Paud Road, Kothrud, Pune 411038. For personal guidance, WhatsApp +91 91586 80722.", action: { href: "/contact/", label: "See studio and contact details" } },
  { words: ["name plate", "nameplate", "door", "house name"], answer: "A name plate should suit both the family and the entrance. Choose the wording, shape, size, lettering and an Indian art direction such as botanical, Warli, Madhubani, lotus or geometric.", action: { href: "/name-plates/#name-plate-builder", label: "Build a name plate" } },
  { words: ["artzyai", "ai", "concept", "generate", "preview"], answer: "ArtzyAI creates imaginative, clearly labelled concept previews from your completed brief. They are not ERP stock or a production proof. The studio confirms feasibility, finish, price and delivery.", action: { href: "/ai-concept-disclosure/", label: "How ArtzyAI concepts work" } },
];

const answerQuestion = (question: string) => {
  const normalised = question.toLowerCase();
  return studioAnswers.find((entry) => entry.words.some((word) => normalised.includes(word))) || {
    answer: "Tell me what you are looking for, who it is for, your budget, preferred colours or style, and when you need it. If your question needs a stock, price, production or delivery decision, I’ll take you directly to Deepti’s studio.",
    action: { href: "/contact/", label: "Ask the studio personally" },
  };
};

function MuseMark() {
  return <svg viewBox="0 0 64 64" role="img" aria-label="Artzy Muse floral motif"><g className="muse-flower-petals">{[0,45,90,135,180,225,270,315].map((angle) => <ellipse key={angle} cx="32" cy="17.5" rx="5.4" ry="10" transform={`rotate(${angle} 32 32)`} />)}</g><circle className="muse-flower-centre" cx="32" cy="32" r="6.2" /><circle className="muse-flower-dot" cx="32" cy="32" r="2.2" /></svg>;
}

export default function ArtzyMuseFloater() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState<MuseLanguage>("en");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MuseMessage[]>([{ id: 1, role: "assistant", text: greetings.en }]);
  const nextId = useRef(2);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closeMuse = () => { setIsOpen(false); setIsExpanded(false); window.setTimeout(() => triggerRef.current?.focus(), 0); };

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("artzy-muse-language") as MuseLanguage | null;
    const selectedLanguage = savedLanguage && savedLanguage in greetings ? savedLanguage : "en";
    setLanguage(selectedLanguage);
    const savedConversation = sessionStorage.getItem("artzy-muse-conversation");
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation) as MuseMessage[];
        if (Array.isArray(parsed) && parsed.length) { setMessages(parsed.slice(-12)); nextId.current = Math.max(...parsed.map((item) => item.id), 1) + 1; }
      } catch { /* Start a fresh conversation. */ }
    } else setMessages([{ id: 1, role: "assistant", text: `${greetings[selectedLanguage]} ${pageContext(window.location.pathname)}` }]);
    if (!sessionStorage.getItem("artzy-muse-welcomed")) {
      const timer = window.setTimeout(() => { setIsOpen(true); sessionStorage.setItem("artzy-muse-welcomed", "yes"); }, 2800);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => { sessionStorage.setItem("artzy-muse-conversation", JSON.stringify(messages.slice(-12))); }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("artzy-muse-open");
    const getFocusable = () => dialogRef.current ? Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])')).filter((item) => !item.hasAttribute("hidden") && item.getClientRects().length > 0) : [];
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeMuse(); return; }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => getFocusable()[0]?.focus(), 20);
    return () => { document.body.style.overflow = previousOverflow; document.body.classList.remove("artzy-muse-open"); window.removeEventListener("keydown", handleKeyDown); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const viewport = window.visualViewport;
    const update = () => {
      const height = viewport?.height ?? window.innerHeight;
      const keyboardOpen = document.activeElement === textareaRef.current && window.innerHeight - height > 140;
      dialogRef.current?.style.setProperty("--muse-sheet-height", `${Math.round(window.innerHeight * 0.7)}px`);
      dialogRef.current?.style.setProperty("--muse-expanded-height", `${Math.round(keyboardOpen ? height : window.innerHeight)}px`);
      if (keyboardOpen) setIsExpanded(true);
    };
    update(); viewport?.addEventListener("resize", update); viewport?.addEventListener("scroll", update);
    return () => { viewport?.removeEventListener("resize", update); viewport?.removeEventListener("scroll", update); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !conversationRef.current) return;
    conversationRef.current.scrollTo({ top: conversationRef.current.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (messages.length > 5) setIsExpanded(true);
  }, [isOpen, messages]);

  const changeLanguage = (next: MuseLanguage) => { setLanguage(next); sessionStorage.setItem("artzy-muse-language", next); setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: greetings[next] }]); };
  const speakGreeting = () => { if (!("speechSynthesis" in window)) return; window.speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(greetings[language]); speech.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN"; speech.rate = .92; window.speechSynthesis.speak(speech); };
  const ask = (text: string) => { const clean = text.trim(); if (!clean) return; const response = answerQuestion(clean); setMessages((current) => [...current, { id: nextId.current++, role: "customer", text: clean }, { id: nextId.current++, role: "assistant", text: response.answer, action: response.action }]); setQuestion(""); if (textareaRef.current) textareaRef.current.style.height = "auto"; };
  const submit = (event: FormEvent) => { event.preventDefault(); ask(question); };
  const onComposerKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(question); } };
  const resizeComposer = (value: string) => { setQuestion(value); const textarea = textareaRef.current; if (textarea) { textarea.style.height = "auto"; textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`; } };

  return <>
    <button ref={triggerRef} className={`muse-floater${isOpen ? " open" : ""}`} type="button" aria-label="Ask Artzy Muse" aria-expanded={isOpen} aria-controls="artzy-muse-guide" onClick={() => isOpen ? closeMuse() : setIsOpen(true)}><span className="muse-floater-mark" aria-hidden="true"><MuseMark /></span><span className="muse-floater-copy"><strong>Ask Artzy Muse</strong><small>Your studio guide</small></span></button>
    <div className={`muse-guide-shell${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
      <button className="muse-guide-backdrop" type="button" aria-label="Close Artzy Muse" onClick={closeMuse} />
      <aside ref={dialogRef} id="artzy-muse-guide" className={`muse-guide muse-chat${isExpanded ? " is-expanded" : ""}`} role="dialog" aria-modal="true" aria-labelledby="muse-guide-title">
        <button className="muse-sheet-handle" type="button" aria-label={isExpanded ? "Return Artzy Muse to compact view" : "Expand Artzy Muse"} aria-pressed={isExpanded} onClick={() => setIsExpanded((value) => !value)}><span /></button>
        <header className="muse-guide-top"><div className="muse-guide-brand"><span className="muse-panel-mark" aria-hidden="true"><MuseMark /></span><div><strong>Artzy Muse</strong><small>Artzy’s Studio assistant</small></div></div><button className="muse-close" type="button" aria-label="Close Artzy Muse" onClick={closeMuse}>×</button></header>
        <div className="muse-chat-intro"><span>ASK · DISCOVER · CREATE</span><h2 id="muse-guide-title">How may I help?</h2><p>Find art, meaningful gifts, personalised creations, or get help with your order.</p></div>
        <div className="muse-quick-questions" aria-label="Quick ways Artzy Muse can help">{quickActions.map((item) => <button type="button" key={item.label} onClick={() => ask(item.question)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div>
        <div ref={conversationRef} className="muse-conversation" aria-live="polite" aria-relevant="additions text">{messages.map((message) => <div className={`muse-message ${message.role}`} key={message.id}>{message.role === "assistant" && <span aria-hidden="true"><MuseMark /></span>}<div><p>{message.text}</p>{message.action && <Link className="muse-message-action" href={message.action.href} onClick={closeMuse}>{message.action.label} <span aria-hidden="true">→</span></Link>}</div></div>)}</div>
        <footer className="muse-chat-footer">
          <form className="muse-chat-form" onSubmit={submit}><label htmlFor="muse-question">Ask Artzy Muse</label><div><textarea ref={textareaRef} id="muse-question" rows={1} value={question} onFocus={() => setIsExpanded(true)} onChange={(event) => resizeComposer(event.target.value)} onKeyDown={onComposerKeyDown} placeholder="Type your question…" autoComplete="off" /><button type="submit" aria-label="Send question" disabled={!question.trim()}>→</button></div></form>
          <div className="muse-language-row"><label htmlFor="muse-language">Language</label><select id="muse-language" value={language} onChange={(event) => changeLanguage(event.target.value as MuseLanguage)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select><button type="button" onClick={speakGreeting} aria-label="Listen to Artzy Muse greeting">Listen <span aria-hidden="true">♪</span></button></div>
          <details className="muse-more-help"><summary>More ways I can help</summary><div className="muse-imagine-links"><span>CREATE AN AI CONCEPT</span><p>Complete a custom brief, then create a clearly labelled imaginative preview.</p><div><Link href="/name-plates/#name-plate-builder" onClick={closeMuse}>Name plate</Link><Link href="/digital-prints/#digital-planner" onClick={closeMuse}>Digital art</Link></div></div><p className="muse-chat-note">Live stock comes from Artzy ERP. Final price, feasibility and delivery are confirmed by the studio.</p></details>
          <Link className="muse-guide-contact" href="/contact" onClick={closeMuse}>Need a person? <strong>Speak with Deepti’s studio</strong><span aria-hidden="true">→</span></Link>
        </footer>
      </aside>
    </div>
    <style jsx global>{`.muse-flower-petals ellipse{fill:none;stroke:currentColor;stroke-width:2.15}.muse-flower-centre{fill:#a64e52;stroke:currentColor;stroke-width:2}.muse-flower-dot{fill:#f3cf92;stroke:none}`}</style>
  </>;
}
