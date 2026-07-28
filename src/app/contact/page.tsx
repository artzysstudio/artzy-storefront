import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const WHATSAPP_URL = 'https://wa.me/919158680722';
const MAP_URL = 'https://share.google/Hs1h9TOcr4ps5cB0p';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <span>Contact Artzy&apos;s Studio</span>
          <h1>Let&apos;s make something <em>meaningful.</em></h1>
          <p>
            Visit Deepti&apos;s Pune studio, ask about a piece, or share your
            idea for a personalised, corporate or digital-art project.
          </p>
        </section>

        <section className="contact-grid" aria-label="Ways to contact Artzy's Studio">
          <article>
            <span>01</span>
            <h2>WhatsApp</h2>
            <p>Fastest for product questions, custom orders and photo references.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Chat on +91 91586 80722 →
            </a>
          </article>
          <article>
            <span>02</span>
            <h2>Email</h2>
            <p>Ideal for corporate gifting, collaborations and detailed briefs.</p>
            <a href="mailto:artzysstudio@gmail.com">artzysstudio@gmail.com →</a>
          </article>
          <article className="contact-location">
            <span>03</span>
            <h2>Visit the physical store</h2>
            <address>
              Ground Floor, Lane #3, Prashant Society, Preetishilp Bldg,
              Plot #22, Paud Rd, Kothrud, Pune, Maharashtra 411038
            </address>
            <a href={MAP_URL} target="_blank" rel="noreferrer">
              Get directions on Google Maps →
            </a>
          </article>
        </section>

        <section className="contact-note">
          <span>Before you visit</span>
          <h2>Planning a custom piece?</h2>
          <p>
            Bring or WhatsApp your reference photos, preferred size, occasion
            and required date. The studio will guide you through the best
            handmade or digital format.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Start on WhatsApp →</a>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .contact-page { background:#fdf8f1; color:#3c2e2a; }
        .contact-hero { padding:clamp(72px,10vw,150px) clamp(20px,7vw,100px); max-width:1200px; }
        .contact-hero > span,.contact-note > span { color:#a64c57; font-size:.72rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; }
        .contact-hero h1 { max-width:950px; margin:18px 0 24px; font-size:clamp(3.2rem,8vw,8rem); line-height:.9; letter-spacing:-.045em; }
        .contact-hero h1 em { color:#a64c57; font-weight:400; }
        .contact-hero p { max-width:700px; color:#75645d; font-size:clamp(1rem,1.6vw,1.25rem); line-height:1.7; }
        .contact-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); border-top:1px solid #dacbc0; border-left:1px solid #dacbc0; margin:0 clamp(20px,5vw,72px); }
        .contact-grid article { min-width:0; min-height:330px; padding:clamp(28px,4vw,52px); border-right:1px solid #dacbc0; border-bottom:1px solid #dacbc0; background:#fffaf5; }
        .contact-grid article > span { color:#a64c57; font-size:.72rem; }
        .contact-grid h2 { margin:48px 0 14px; font-size:clamp(1.8rem,3vw,3rem); }
        .contact-grid p,.contact-grid address { min-height:84px; margin:0 0 26px; color:#75645d; line-height:1.7; font-style:normal; }
        .contact-grid a,.contact-note a { color:#a64c57; border-bottom:1px solid currentColor; font-weight:700; overflow-wrap:anywhere; }
        .contact-note { margin-top:72px; padding:clamp(54px,8vw,110px) clamp(20px,7vw,100px); background:#3c2e2a; color:#fffaf5; }
        .contact-note h2 { margin:14px 0; font-size:clamp(2.4rem,5vw,5rem); }
        .contact-note p { max-width:720px; margin-bottom:28px; color:#dccdc4; line-height:1.75; }
        .contact-note a { color:#f2b9b4; }
        @media(max-width:850px) {
          .contact-grid { grid-template-columns:1fr; margin-inline:14px; }
          .contact-grid article { min-height:auto; }
          .contact-grid h2 { margin-top:28px; }
          .contact-grid p,.contact-grid address { min-height:0; }
        }
        @media(max-width:480px) {
          .contact-hero { padding:56px 18px; overflow:hidden; }
          .contact-hero h1 { font-size:clamp(3rem,16vw,4.4rem); overflow-wrap:anywhere; }
        }
      `}</style>
    </>
  );
}
