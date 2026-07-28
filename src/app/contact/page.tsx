"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello Artzy's Studio,",
      "",
      "I would like to enquire about: " + form.get("interest"),
      "Name: " + form.get("name"),
      "Phone: " + form.get("phone"),
      "Email: " + form.get("email"),
      "Budget: " + form.get("budget"),
      "Message: " + form.get("message")
    ].join("\n");

    setSent(true);
    window.open("https://wa.me/919158680722?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-copy">
            <span className="contact-kicker">VISIT · COLLABORATE · CREATE</span>
            <h1>Let’s make something <em>meaningful.</em></h1>
            <p>Tell us about the artwork, personalised gift or corporate project you have in mind. Deepti and the studio will help shape it into something made especially for you.</p>
            <div className="contact-quick-actions">
              <a href="https://wa.me/919158680722" target="_blank" rel="noreferrer">WhatsApp us ↗</a>
              <a href="mailto:artzysstudio@gmail.com">Email the studio ↗</a>
            </div>
          </div>
          <div className="contact-mark" aria-hidden="true">
            <span>ARTZY’S</span>
            <strong>Studio</strong>
            <small>BY DEEPTI J. SHAH</small>
          </div>
        </section>

        <section className="contact-main">
          <div className="contact-details">
            <span className="contact-kicker">THE STUDIO</span>
            <h2>Come say hello.</h2>
            <p className="contact-intro">See hand-painted pieces in person, discuss a commission, or find a gift with a personal story.</p>

            <div className="contact-detail-card">
              <span>01</span>
              <div><h3>Visit</h3><p>Ground Floor, Lane #3, Prashant Society, Preetishilp Bldg, Plot #22, Paud Road, Kothrud, Pune, Maharashtra 411038</p><a href="https://share.google/Hs1h9TOcr4ps5cB0p" target="_blank" rel="noreferrer">Open in Google Maps →</a></div>
            </div>
            <div className="contact-detail-card">
              <span>02</span>
              <div><h3>Talk to us</h3><p><a href="tel:+919158680722">+91 91586 80722</a><br/><a href="mailto:artzysstudio@gmail.com">artzysstudio@gmail.com</a></p></div>
            </div>
            <div className="contact-detail-card">
              <span>03</span>
              <div><h3>Studio enquiries</h3><p>Original art · Digital prints · Caricatures · Personalised gifts · Corporate gifting · Custom commissions</p></div>
            </div>
          </div>

          <div className="contact-form-panel">
            <span className="contact-kicker">START A CONVERSATION</span>
            <h2>What can we create for you?</h2>
            <form className="contact-form" onSubmit={sendEnquiry}>
              <div className="contact-form-row">
                <label>YOUR NAME<input name="name" type="text" autoComplete="name" required placeholder="How should we address you?" /></label>
                <label>PHONE NUMBER<input name="phone" type="tel" autoComplete="tel" required placeholder="+91" /></label>
              </div>
              <label>EMAIL ADDRESS<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
              <div className="contact-form-row">
                <label>I’M INTERESTED IN<select name="interest" defaultValue="Personalised gift"><option>Original artwork</option><option>Hand-painted product</option><option>Digital canvas print</option><option>Caricature gift</option><option>Personalised gift</option><option>Corporate gifting</option><option>Custom commission</option></select></label>
                <label>APPROX. BUDGET<select name="budget" defaultValue="Let’s discuss"><option>Under ₹2,500</option><option>₹2,500 – ₹5,000</option><option>₹5,000 – ₹15,000</option><option>₹15,000+</option><option>Let’s discuss</option></select></label>
              </div>
              <label>TELL US YOUR IDEA<textarea name="message" required rows={5} placeholder="Occasion, quantity, size, colours, timeline or anything that will help us understand your idea..." /></label>
              <button type="submit">Send enquiry on WhatsApp <span>→</span></button>
              <p className="contact-form-note">{sent ? "Your enquiry is ready in WhatsApp." : "We usually reply within one business day."}</p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
