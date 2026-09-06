"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";

type MuseMessage = { id: number; role: "assistant" | "customer"; text: string; action?: { href: string; label: string } };
type MuseLanguage = "en" | "hi" | "mr";
type QuickAction = { icon: string; label: string; question: string };
type PageGuide = { description: string; prompt: string; actions: QuickAction[] };

const conversationStorageKey = "artzy-muse-conversation-v5";
const voiceStorageKey = "artzy-muse-voice";

const greetings: Record<MuseLanguage, string> = {
  en: "Namaste. I’m Artzy Muse. Tell me what you need, and I’ll guide you one step at a time.",
  hi: "नमस्ते। मैं Artzy Muse हूँ। बताइए आपको क्या चाहिए, मैं एक-एक कदम पर मार्गदर्शन दूँगी।",
  mr: "नमस्कार. मी Artzy Muse आहे. तुम्हाला काय हवे आहे ते सांगा; मी प्रत्येक टप्प्यावर सोपे मार्गदर्शन करेन.",
};

const actions = (...items: Array<[string, string, string]>): QuickAction[] =>
  items.map(([icon, label, question]) => ({ icon, label, question }));

const pageGuide = (path: string): PageGuide => {
  if (path.startsWith("/shop")) return {
    description: "Compare suitable studio pieces, variants, stock and delivery.",
    prompt: "Tell me what you need, your budget and where it will be used.",
    actions: actions(["↔", "Compare", "Help me compare suitable products"], ["●", "Check stock", "Check current stock and variants"], ["₹", "Use a budget", "Help me choose within my budget"], ["⌂", "Choose for a room", "Help me choose something for my room"]),
  };
  if (path.startsWith("/gifts")) return {
    description: "Choose a thoughtful gift without guessing.",
    prompt: "Start with who it is for, the occasion, budget and date.",
    actions: actions(["♡", "Who it’s for", "Help me choose a gift for someone"], ["₹", "Use a budget", "Help me find a gift within my budget"], ["✦", "Personalise", "Suggest a personalised gift"], ["▣", "Plan a hamper", "Help me plan a gift hamper"]),
  };
  if (path.startsWith("/name-plates")) return {
    description: "Shape your wording, entrance style and finish into one clear brief.",
    prompt: "Start with the name, entrance type or style you like.",
    actions: actions(["Aa", "Wording", "Help me choose name plate wording"], ["✿", "Choose style", "Help me choose a name plate art style"], ["₹", "Estimate", "Explain the name plate estimate"], ["→", "Start builder", "Guide me through the name plate builder"]),
  };
  if (path.startsWith("/caricatures")) return {
    description: "Turn a person and occasion into a recognisable, joyful concept.",
    prompt: "Start with who is in the picture and the occasion.",
    actions: actions(["☺", "Occasion", "Help me plan a caricature for an occasion"], ["▧", "Photo tips", "What photo should I upload for a caricature?"], ["✎", "Choose style", "Help me choose a caricature style"], ["→", "Start brief", "Guide me through the caricature brief"]),
  };
  if (path.startsWith("/digital-prints")) return {
    description: "Plan art for a wall, gift or personal story with a clear purpose.",
    prompt: "Start with the room, size, colours or feeling you want.",
    actions: actions(["⌂", "Choose purpose", "Help me choose the purpose for my digital art"], ["◫", "Plan my wall", "Help me plan digital art for my wall"], ["✦", "Choose style", "Help me choose an Indian or modern art style"], ["→", "Start planner", "Guide me through the digital art planner"]),
  };
  if (path.startsWith("/for-business") || path.startsWith("/custom-corporate")) return {
    description: "Turn a business purpose, audience and quantity into a practical direction.",
    prompt: "Start with the purpose, recipients, quantity, budget and deadline.",
    actions: actions(["◎", "Choose purpose", "Help me define my business project purpose"], ["▦", "Corporate gifts", "Help me plan corporate gifting"], ["▧", "Art for a space", "Help me plan art for a business space"], ["₹", "Plan a budget", "Help me plan this business request within a budget"]),
  };
  if (path.startsWith("/artzy-world")) return {
    description: "Place suitable art in a sample room or your own wall photo.",
    prompt: "Choose a room first, then a suitable available piece or concept.",
    actions: actions(["⌂", "Choose room", "Help me choose the right room preview"], ["▧", "Use my wall", "How should I photograph my wall?"], ["↔", "Check size", "Help me compare artwork size and placement"], ["→", "Start preview", "Guide me through Artzy World"]),
  };
  if (path.startsWith("/original-art")) return {
    description: "Discover original work by mood, room and the story it carries.",
    prompt: "Tell me the room, colours and feeling you want to create.",
    actions: actions(["⌂", "Choose for room", "Help me choose original art for a room"], ["◐", "Choose a mood", "Help me choose art by mood and colour"], ["▣", "Check size", "Help me choose an artwork size"], ["✦", "Ask the artist", "Help me prepare a question for Deepti’s studio"]),
  };
  if (path.startsWith("/personalised") || path.startsWith("/personalized")) return {
    description: "Turn a name, photograph, memory or idea into a studio-ready brief.",
    prompt: "Start with who it is for and what should feel personal.",
    actions: actions(["♡", "Share the story", "Help me describe the story behind my idea"], ["▧", "Use a photo", "What photo should I use for personalisation?"], ["✦", "Choose format", "Help me choose the right personalised format"], ["→", "Start a brief", "Guide me through a personalised brief"]),
  };
  if (path.startsWith("/checkout")) return {
    description: "Review the bag, stock, address and delivery before payment.",
    prompt: "Tell me which checkout step is unclear.",
    actions: actions(["▣", "Review bag", "Help me review my shopping bag"], ["●", "Stock", "Explain the stock shown in my bag"], ["⌖", "Delivery", "Help me understand delivery"], ["?", "Payment help", "I need help before payment"]),
  };
  if (path.startsWith("/account")) return {
    description: "Find confirmed account and order information.",
    prompt: "Tell me whether you need sign-in, order or delivery help.",
    actions: actions(["○", "Sign in", "Help me sign in to my account"], ["▣", "My orders", "Help me find my orders"], ["⌖", "Track delivery", "Help me understand my order delivery"], ["?", "Studio help", "I need personal help with my account"]),
  };
  if (path.startsWith("/contact") || path.startsWith("/about")) return {
    description: "Meet Deepti’s studio or prepare one clear question for the team.",
    prompt: "Tell me whether you want to visit, enquire or understand the studio.",
    actions: actions(["⌖", "Visit studio", "Show me how to visit the studio"], ["✦", "Meet the artist", "Tell me about Deepti and the studio"], ["▧", "Prepare brief", "Help me prepare a clear studio brief"], ["→", "Contact", "Help me contact Artzy Studio"]),
  };
  return {
    description: "Find art, meaningful gifts and personalised creations.",
    prompt: "Tell me who or what you are choosing for and your budget.",
    actions: actions(["♡", "Find a gift", "Help me find a meaningful gift"], ["✦", "Personalise", "What can I personalise?"], ["▧", "Explore art", "Help me explore art for my space"], ["?", "Order help", "I need help with stock, delivery or an order"]),
  };
};

const studioAnswers = [
  { words: ["gift", "birthday", "anniversary", "wedding", "occasion"], answer: "Tell me who it is for, your budget and when you need it. I’ll narrow the choice to a ready gift, personalised piece, caricature or studio-planned hamper.", action: { href: "/gifts/#gift-finder", label: "Find the right gift" } },
  { words: ["custom", "customise", "customized", "personalise", "personalised"], answer: "You can personalise names, messages, colours, themes, portraits, caricatures, sizes and business branding. Start with the part that matters most.", action: { href: "/personalised/", label: "Explore personalisation" } },
  { words: ["digital", "print", "abstract", "geometric", "decor", "explore art", "wall art"], answer: "Tell me the room, wall size, existing colours and feeling you want. I’ll help you choose a suitable art direction before you create a concept.", action: { href: "/digital-prints/#digital-planner", label: "Plan digital art" } },
  { words: ["caricature", "portrait", "face", "photo"], answer: "Use a clear front-facing photo, then add the occasion, personality, profession, hobbies and preferred style. The concept should remain recognisable and respectful.", action: { href: "/caricatures/", label: "Create a caricature brief" } },
  { words: ["corporate", "bulk", "employee", "client", "branding"], answer: "Share the purpose, audience, quantity, brand colours, budget and deadline. I’ll turn them into one practical business brief.", action: { href: "/for-business/#business-concept", label: "Plan a business concept" } },
  { words: ["order", "tracking", "track", "status"], answer: "Open your account for confirmed order information. If it is not shown there, contact the studio with your enquiry or order reference.", action: { href: "/account/", label: "View account and orders" } },
  { words: ["delivery", "dispatch", "stock", "available", "availability", "time"], answer: "Product pages show current stock and variants when available. Final delivery depends on your PIN code and whether the piece is ready or made to order.", action: { href: "/shop/", label: "View current studio products" } },
  { words: ["visit", "address", "location", "pune", "contact", "whatsapp"], answer: "Artzy’s Studio is at Ground Floor, Preetishilp Building, Lane 3, Plot 22, Prashant Society, Paud Road, Kothrud, Pune 411038.", action: { href: "/contact/", label: "See contact details" } },
  { words: ["name plate", "nameplate", "door", "house name"], answer: "Start with the exact wording and entrance type. Then compare shape, size, lettering and an art direction such as botanical, Warli, Madhubani, lotus or geometric.", action: { href: "/name-plates/#name-plate-builder", label: "Build a name plate" } },
  { words: ["artzyai", "ai", "concept", "generate", "preview"], answer: "ArtzyAI creates a clearly labelled imaginative concept from your brief. It is not catalogue stock or a production proof; the studio confirms feasibility, finish, price and delivery.", action: { href: "/ai-concept-disclosure/", label: "How ArtzyAI concepts work" } },
];

const answerQuestion = (question: string, path: string) => {
  const normalised = question.toLowerCase();
  if (/^(hi|hello|hey|namaste|what are you doing)[.!?\s]*$/.test(normalised)) return { answer: `${greetings.en} ${pageGuide(path).prompt}` };
  const amountMatch = normalised.match(/(?:₹|rs\.?|inr)?\s*(\d[\d,]{2,})\s*(?:\/-)?/i);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : 0;
  const isBudgetMessage = amount > 0 && (/budget|₹|rs\.?|inr|\/-/i.test(normalised) || /^\s*[\d,]+\s*$/.test(normalised));
  if (isBudgetMessage) {
    const formatted = `₹${amount.toLocaleString("en-IN")}`;
    if (path.startsWith("/for-business")) return { answer: `${formatted} is noted. How many recipients, and what is the occasion?`, action: { href: "/for-business/#business-concept", label: "Plan within this budget" } };
    if (path.startsWith("/name-plates")) return { answer: `${formatted} is noted. Choose the size, material and painting detail to see a useful estimate.`, action: { href: "/name-plates/#name-plate-builder", label: "Build within this budget" } };
    if (path.startsWith("/digital-prints") || path.startsWith("/artzy-world")) return { answer: `${formatted} is noted. Which room and size are you planning for?`, action: { href: "/digital-prints/#digital-planner", label: "Plan art within this budget" } };
    return { answer: `${formatted} is noted. Who is the gift for?`, action: { href: "/gifts/#gift-finder", label: `Find a gift within ${formatted}` } };
  }
  return studioAnswers.find((entry) => entry.words.some((word) => normalised.includes(word))) || { answer: pageGuide(path).prompt };
};

function MuseMark() {
  return <svg viewBox="0 0 64 64" role="img" aria-label="Artzy Muse floral motif"><g className="muse-flower-petals">{[0,45,90,135,180,225,270,315].map((angle) => <ellipse key={angle} cx="32" cy="17.5" rx="5.4" ry="10" transform={`rotate(${angle} 32 32)`} />)}</g><circle className="muse-flower-centre" cx="32" cy="32" r="6.2" /><circle className="muse-flower-dot" cx="32" cy="32" r="2.2" /></svg>;
}

export default function ArtzyMuseFloater() {
  const pathname = usePathname();
  const guide = pageGuide(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState<MuseLanguage>("en");
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const [messages, setMessages] = useState<MuseMessage[]>([{ id: 1, role: "assistant", text: greetings.en }]);
  const nextId = useRef(2);
  const previousPath = useRef(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };
  const closeMuse = () => {
    window.speechSynthesis?.cancel();
    setIsOpen(false);
    setIsExpanded(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("artzy-muse-language") as MuseLanguage | null;
    const selectedLanguage = savedLanguage && savedLanguage in greetings ? savedLanguage : "en";
    setLanguage(selectedLanguage);
    setVoiceAvailable("speechSynthesis" in window);
    setVoiceEnabled(sessionStorage.getItem(voiceStorageKey) === "on" && "speechSynthesis" in window);
    const savedConversation = sessionStorage.getItem(conversationStorageKey);
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation) as MuseMessage[];
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed.slice(-12));
          nextId.current = Math.max(...parsed.map((item) => item.id), 1) + 1;
        }
      } catch { /* Start a fresh conversation. */ }
    } else setMessages([{ id: 1, role: "assistant", text: `${greetings[selectedLanguage]} ${pageGuide(window.location.pathname).prompt}` }]);
    if (!sessionStorage.getItem("artzy-muse-welcomed")) {
      const timer = window.setTimeout(() => { setIsOpen(true); sessionStorage.setItem("artzy-muse-welcomed", "yes"); }, 2800);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => { sessionStorage.setItem(conversationStorageKey, JSON.stringify(messages.slice(-12))); }, [messages]);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (voiceEnabled && isOpen) speak(guide.prompt);
  }, [guide.prompt, isOpen, pathname, voiceEnabled]);

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
      dialogRef.current?.style.setProperty("--muse-sheet-height", `${Math.round(height)}px`);
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

  const changeLanguage = (next: MuseLanguage) => {
    setLanguage(next);
    sessionStorage.setItem("artzy-muse-language", next);
    setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: greetings[next] }]);
  };
  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    sessionStorage.setItem(voiceStorageKey, next ? "on" : "off");
    if (next) speak([...messages].reverse().find((message) => message.role === "assistant")?.text || guide.prompt);
    else window.speechSynthesis?.cancel();
  };
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
        method: "POST", credentials: "same-origin", signal: controller.signal,
        headers: { "content-type": "application/json", ...(customerToken ? { "x-artzy-customer-token": customerToken } : {}) },
        body: JSON.stringify({ message: clean, page: pathname, language, history }),
      });
      const result = await response.json() as { reply?: string; action?: { href?: string; label?: string } };
      if (!response.ok || !result.reply?.trim()) throw new Error("Muse unavailable");
      const reply = result.reply.trim();
      const action = result.action?.href && result.action?.label ? { href: result.action.href, label: result.action.label } : undefined;
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: reply, action }]);
      if (voiceEnabled) speak(reply);
    } catch {
      const fallback = answerQuestion(clean, pathname);
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: fallback.answer, action: fallback.action }]);
      if (voiceEnabled) speak(fallback.answer);
    } finally { window.clearTimeout(timeout); setIsThinking(false); }
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
        <header className="muse-guide-top"><div className="muse-guide-brand"><span className="muse-panel-mark" aria-hidden="true"><MuseMark /></span><div><strong>Artzy Muse</strong><small>Artzy’s Studio assistant</small></div></div><div className="muse-guide-controls"><button className="muse-voice-toggle" type="button" disabled={!voiceAvailable} aria-pressed={voiceEnabled} aria-label={voiceEnabled ? "Turn voice guidance off" : "Turn voice guidance on"} onClick={toggleVoice}>{voiceEnabled ? "Voice on" : "Voice off"}</button><button className="muse-close" type="button" aria-label="Close Artzy Muse" onClick={closeMuse}>×</button></div></header>
        <div className="muse-chat-intro"><span>ASK · DISCOVER · CREATE</span><h2 id="muse-guide-title">How may I help?</h2><p>{guide.description}</p></div>
        {!hasStarted && <div className="muse-quick-questions" aria-label="Quick ways Artzy Muse can help on this page">{guide.actions.map((item) => <button type="button" key={item.label} disabled={isThinking} onClick={() => void ask(item.question)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div>}
        <div ref={conversationRef} className="muse-conversation" aria-live="polite" aria-busy={isThinking} aria-relevant="additions text">{messages.map((message) => <div className={`muse-message ${message.role}`} key={message.id}>{message.role === "assistant" && <span aria-hidden="true"><MuseMark /></span>}<div><p>{message.text}</p>{message.action && <Link className="muse-message-action" href={message.action.href} onClick={closeMuse}>{message.action.label} <span aria-hidden="true">→</span></Link>}</div></div>)}{isThinking && <div className="muse-message assistant muse-thinking"><span aria-hidden="true"><MuseMark /></span><div><p>Finding the clearest next step…</p></div></div>}</div>
        <footer className="muse-chat-footer">
          <form className="muse-chat-form" onSubmit={submit}><label htmlFor="muse-question">Ask Artzy Muse</label><div><textarea ref={textareaRef} id="muse-question" rows={1} value={question} disabled={isThinking} onFocus={() => setIsExpanded(true)} onChange={(event) => resizeComposer(event.target.value)} onKeyDown={onComposerKeyDown} placeholder={isThinking ? "Artzy Muse is thinking…" : "Type your question…"} autoComplete="off" /><button type="submit" aria-label="Send question" disabled={isThinking || !question.trim()}>→</button></div></form>
          <details className="muse-more-help"><summary>Language &amp; more help</summary><div className="muse-language-row"><label htmlFor="muse-language">Language</label><select id="muse-language" value={language} onChange={(event) => changeLanguage(event.target.value as MuseLanguage)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select><button type="button" disabled={!voiceAvailable} onClick={() => speak(`${greetings[language]} ${guide.prompt}`)} aria-label="Hear the current page guidance">Hear guidance <span aria-hidden="true">♪</span></button></div><div className="muse-imagine-links"><span>CREATE AN AI CONCEPT</span><p>Complete a custom brief, then create a clearly labelled imaginative preview.</p><div><Link href="/name-plates/#name-plate-builder" onClick={closeMuse}>Name plate</Link><Link href="/digital-prints/#digital-planner" onClick={closeMuse}>Digital art</Link><Link href="/caricatures/" onClick={closeMuse}>Caricature</Link></div></div><p className="muse-chat-note">Stock, final price, feasibility and delivery are confirmed by Artzy Studio.</p></details>
          <Link className="muse-guide-contact" href="/contact" onClick={closeMuse}>Need a person? <strong>Speak with Deepti’s studio</strong><span aria-hidden="true">→</span></Link>
        </footer>
      </aside>
    </div>
    <style jsx global>{`.muse-flower-petals ellipse{fill:none;stroke:currentColor;stroke-width:2.15}.muse-flower-centre{fill:#a64e52;stroke:currentColor;stroke-width:2}.muse-flower-dot{fill:#f3cf92;stroke:none}`}</style>
  </>;
}
