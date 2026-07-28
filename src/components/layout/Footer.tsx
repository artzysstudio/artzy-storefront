import Link from 'next/link';

const WHATSAPP_URL = 'https://wa.me/919158680722';
const MAP_URL = 'https://share.google/Hs1h9TOcr4ps5cB0p';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>Artzy&apos;s Studio</h2>
            <p>
              The creative world of artist Deepti J. Shah—hand-painted art,
              digital prints, caricatures and meaningful gifts.
            </p>
          </div>
          <div className="footer-col">
            <h4>Shop Artzy</h4>
            <ul className="footer-links">
              <li><Link href="/shop?category=hand-painted">Hand-painted Art</Link></li>
              <li><Link href="/shop?category=digital-prints">Digital Prints</Link></li>
              <li><Link href="/shop?category=caricatures">Caricatures</Link></li>
              <li><Link href="/shop?category=personalised-gifts">Personalised Gifts</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Visit the Studio</h4>
            <address className="footer-address">
              Ground Floor, Lane #3, Prashant Society,<br />
              Preetishilp Bldg, Plot #22, Paud Rd,<br />
              Kothrud, Pune, Maharashtra 411038
            </address>
            <a href={MAP_URL} target="_blank" rel="noreferrer">Open in Google Maps →</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:artzysstudio@gmail.com">artzysstudio@gmail.com</a></li>
              <li><a href="tel:+919158680722">+91 91586 80722</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Chat on WhatsApp</a></li>
              <li><Link href="/contact">Contact & Store Details</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Artzy&apos;s Studio. All rights reserved.</span>
          <span>Created with intention in Pune, India</span>
        </div>
      </div>
    </footer>
  );
}
