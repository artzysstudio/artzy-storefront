"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";

type MuseMessage = { id: number; role: "assistant" | "customer"; text: string; action?: { href: string; label: string } };
type MuseLanguage = "en" | "hi" | "mr";
const conversationStorageKey = "artzy-muse-conversation-v4";

const greetings: Record<MuseLanguage, string> = {
  en: "Namaste. I’m Artzy Muse, your studio guide. Tell me what you’re looking for, and I’ll help one step at a time.",
  hi: "नमस्ते। मैं Artzy Muse, आपकी स्टूडियो गाइड हूँ। बताइए आप किसके लिए चुन रहे हैं, आपका बजट क्या है और आप कैसा एहसास चाहते हैं। मैं सरल मार्गदर्शन दूँगी।",
  mr: "नमस्कार. मी Artzy Muse, तुमची स्टुडिओ गाइड आहे. तुम्ही कोणासाठी निवडत आहात, बजेट आणि अपेक्षित भावना सांगा. मी सोपे मार्गदर्शन करेन.",
};

const pageContext = (path: string) => {
  if (path.startsWith("/shop")) return "Ask me to compare a piece or check what suits your need.";
  if (path.startsWith("/gifts")) return "For a gift, start with who it is for.";
  if (path.startsWith("/name-plates")) return "For a name plate, start with the wording or entrance style.";
  if (path.startsWith("/caricatures")) return "For a caricature, start with the person and occasion.";
  if (path.startsWith("/digital-prints")) return "For wall art, start with the room or feeling.";
  if (path.startsWith("/for-business")) return "For business work, start with the purpose and quantity.";
  if (path.startsWith("/artzy-world")) return "I can help you place art confidently in your room.";
  return "Ask me about art, gifts or personalisation.";
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
  { words: ["delivery", "dispatch", "stock", "available", "availability", "time"], answer: "Live stock and variants appear on product pages when available. Delivery depends on your PIN code and whether the piece is ready, personalised or made to order. The studio confirms the final date before you commit.", action: { href: "/shop/", label: "View current studio products" } },
  { words: ["visit", "address", "location", "pune", "contact", "whatsapp"], answer: "You’re welcome at Artzy’s Studio, Ground Floor, Preetishilp Building, Lane 3, Plot 22, Prashant Society, Paud Road, Kothrud, Pune 411038. For personal guidance, WhatsApp +91 91586 80722.", action: { href: "/contact/", label: "See studio and contact details" } },
  { words: ["name plate", "nameplate", "door", "house name"], answer: "A name plate should suit both the family and the entrance. Choose the wording, shape, size, lettering and an Indian art direction such as botanical, Warli, Madhubani, lotus or geometric.", action: { href: "/name-plates/#name-plate-builder", label: "Build a name plate" } },
  { words: ["artzyai", "ai", "concept", "generate", "preview"], answer: "ArtzyAI creates imaginative, clearly labelled concept previews from your completed brief. They are not catalogue stock or a production proof. The studio confirms feasibility, finish, price and delivery.", action: { href: "/ai-concept-disclosure/", label: "How ArtzyAI concepts work" } },
];

const answerQuestion = (question: string, path: string) => {
  const normalised = question.toLowerCase();
  const amountMatch = normalised.match(/(?:₹|rs\.?|inr)?\s*(\d[\d,]{2,})\s*(?:\/-)?/i);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : 0;
  const isBudgetMessage = amount > 0 && (/budget|₹|rs\.?|inr|\/-/i.test(normalised) || /^\s*[\d,]+\s*$/.test(normalised));

  if (isBudgetMessage) {
    const formatted = `₹${amount.toLocaleString("en-IN")}`;
    if (path.startsWith("/for-business")) return {
      answer: `${formatted} is noted. To make that budget useful, tell me the number of recipients and the occasion or business purpose. I’ll help you judge whether a ready gift, a simple personalised piece or a studio quotation is the best fit.`,
      action: { href: "/for-business/#business-concept", label: "Plan within this budget" },
    };
    if (path.startsWith("/name-plates")) return {
      answer: `${formatted} is noted for your name plate. The final fit depends on size, material and painting detail. Choose those three options in the builder and I’ll keep the estimate clear before you send it to the studio.`,
      action: { href: "/name-plates/#name-plate-builder", label: "Build within this budget" },
    };
    if (path.startsWith("/digital-prints") || path.startsWith("/artzy-world")) return {
      answer: `${formatted} is noted for your art. Tell me the room or purpose and the size you need; then I can guide you towards a suitable ready piece or a simpler custom direction without pretending an unavailable item will fit.`,
      action: { href: "/digital-prints/#digital-planner", label: "Plan art within this budget" },
    };
    return {
      answer: `${formatted} is a helpful gift budget, and I’ll remember it. Who is the gift for?`,
      action: { href: "/gifts/#gift-finder", label: `Find a gift within ${formatted}` },
    };
  }
  return studioAnswers.find((entry) => entry.words.some((word) => normalised.includes(word))) || {
    answer: "I’m here with you. What would you like help choosing today?",
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
  const [isThinking, setIsThinking] = useState(false);
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
    const savedConversation = sessionStorage.getItem(conversationStorageKey);
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

  useEffect(() => { sessionStorage.setItem(conversationStorageKey, JSON.stringify(messages.slice(-12))); }, [messages]);

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
      // Give the conversation enough room to feel like a real assistant on phones.
      // The previous 56% sheet left only a few lines for messages once the header,
      // shortcuts and composer were visible.
      const compactHeight = height;
      dialogRef.current?.style.setProperty("--muse-sheet-height", `${Math.round(compactHeight)}px`);
      dialogRef.current?.style.setProperty("--muse-expanded-height", `${Math.round(height)}px`);
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
  const ask = async (text: string) => {
    const clean = text.trim();
    if (!clean || isThinking) return;
    const history = messages.slice(-10).map(({ role, text: historyText }) => ({ role, text: historyText }));
    setMessages((current) => [...current, { id: nextId.current++, role: "customer", text: clean }]);
    setQuestion("");
    setIsThinking(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 18_000);
    try {
      const customerToken = localStorage.getItem("artzy_customer_access_token");
      const response = await fetch("/api/muse", {
        method: "POST",
        credentials: "same-origin",
        signal: controller.signal,
        headers: { "content-type": "application/json", ...(customerToken ? { "x-artzy-customer-token": customerToken } : {}) },
        body: JSON.stringify({ message: clean, page: window.location.pathname, language, history }),
      });
      const result = await response.json() as { reply?: string; action?: { href?: string; label?: string } };
      if (!response.ok || !result.reply?.trim()) throw new Error("Muse unavailable");
      const action = result.action?.href && result.action?.label ? { href: result.action.href, label: result.action.label } : undefined;
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: result.reply!.trim(), action }]);
    } catch {
      const fallback = answerQuestion(clean, window.location.pathname);
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: `${fallback.answer} I’m using my studio guidance while the live assistant reconnects.`, action: fallback.action }]);
    } finally {
      window.clearTimeout(timeout);
      setIsThinking(false);
    }
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void ask(question); };
  const onComposerKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(question); } };
  const resizeComposer = (value: string) => { setQuestion(value); const textarea = textareaRef.current; if (textarea) { textarea.style.height = "auto"; textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`; } };
  const hasStarted = messages.some((message) => message.role === "customer");

  return <>
    <button ref={triggerRef} className={`muse-floater${isOpen ? " open" : ""}`} type="button" aria-label="Ask Artzy Muse" aria-expanded={isOpen} aria-controls="artzy-muse-guide" onClick={() => isOpen ? closeMuse() : setIsOpen(true)}><span className="muse-floater-mark" aria-hidden="true"><MuseMark /></span><span className="muse-floater-copy"><strong>Ask Artzy Muse</strong><small>Your studio guide</small></span></button>
    <div className={`muse-guide-shell${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
      <button className="muse-guide-backdrop" type="button" aria-label="Close Artzy Muse" onClick={closeMuse} />
      <aside ref={dialogRef} id="artzy-muse-guide" className={`muse-guide muse-chat${isExpanded ? " is-expanded" : ""}${hasStarted ? " has-conversation" : ""}`} role="dialog" aria-modal="true" aria-labelledby="muse-guide-title">
        <button className="muse-sheet-handle" type="button" aria-label={isExpanded ? "Return Artzy Muse to compact view" : "Expand Artzy Muse"} aria-pressed={isExpanded} onClick={() => setIsExpanded((value) => !value)}><span /></button>
        <header className="muse-guide-top"><div className="muse-guide-brand"><span className="muse-panel-mark" aria-hidden="true"><MuseMark /></span><div><strong>Artzy Muse</strong><small>Artzy’s Studio assistant</small></div></div><button className="muse-close" type="button" aria-label="Close Artzy Muse" onClick={closeMuse}>×</button></header>
        <div className="muse-chat-intro"><span>ASK · DISCOVER · CREATE</span><h2 id="muse-guide-title">How may I help?</h2><p>Find art, meaningful gifts, personalised creations, or get help with your order.</p></div>
        {!hasStarted && <div className="muse-quick-questions" aria-label="Quick ways Artzy Muse can help">{quickActions.map((item) => <button type="button" key={item.label} disabled={isThinking} onClick={() => void ask(item.question)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div>}
        <div ref={conversationRef} className="muse-conversation" aria-live="polite" aria-busy={isThinking} aria-relevant="additions text">{messages.map((message) => <div className={`muse-message ${message.role}`} key={message.id}>{message.role === "assistant" && <span aria-hidden="true"><MuseMark /></span>}<div><p>{message.text}</p>{message.action && <Link className="muse-message-action" href={message.action.href} onClick={closeMuse}>{message.action.label} <span aria-hidden="true">→</span></Link>}</div></div>)}{isThinking && <div className="muse-message assistant muse-thinking"><span aria-hidden="true"><MuseMark /></span><div><p>Thinking about the best next step…</p></div></div>}</div>
        <footer className="muse-chat-footer">
          <form className="muse-chat-form" onSubmit={submit}><label htmlFor="muse-question">Ask Artzy Muse</label><div><textarea ref={textareaRef} id="muse-question" rows={1} value={question} disabled={isThinking} onFocus={() => setIsExpanded(true)} onChange={(event) => resizeComposer(event.target.value)} onKeyDown={onComposerKeyDown} placeholder={isThinking ? "Artzy Muse is thinking…" : "Type your question…"} autoComplete="off" /><button type="submit" aria-label="Send question" disabled={isThinking || !question.trim()}>→</button></div></form>
          <details className="muse-more-help"><summary>Language, listening &amp; more help</summary><div className="muse-language-row"><label htmlFor="muse-language">Language</label><select id="muse-language" value={language} onChange={(event) => changeLanguage(event.target.value as MuseLanguage)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select><button type="button" onClick={speakGreeting} aria-label="Listen to Artzy Muse greeting">Listen <span aria-hidden="true">♪</span></button></div><div className="muse-imagine-links"><span>CREATE AN AI CONCEPT</span><p>Complete a custom brief, then create a clearly labelled imaginative preview.</p><div><Link href="/name-plates/#name-plate-builder" onClick={closeMuse}>Name plate</Link><Link href="/digital-prints/#digital-planner" onClick={closeMuse}>Digital art</Link></div></div><p className="muse-chat-note">Live stock comes from the studio catalogue. Final price, feasibility and delivery are confirmed by the studio.</p></details>
          <Link className="muse-guide-contact" href="/contact" onClick={closeMuse}>Need a person? <strong>Speak with Deepti’s studio</strong><span aria-hidden="true">→</span></Link>
        </footer>
      </aside>
    </div>
    <style jsx global>{`.muse-flower-petals ellipse{fill:none;stroke:currentColor;stroke-width:2.15}.muse-flower-centre{fill:#a64e52;stroke:currentColor;stroke-width:2}.muse-flower-dot{fill:#f3cf92;stroke:none}`}</style>
  </>;
}
