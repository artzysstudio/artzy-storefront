import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

const WHATSAPP_URL = 'https://wa.me/919158680722';
const MAP_URL = 'https://maps.app.goo.gl/WQ3CbkywNQCoNx6g9';

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
            <SocialLinks location="footer" />
          </div>
          <div className="footer-col">
            <h4>Explore Artzy</h4>
            <ul className="footer-links">
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/gifts">Gifts</Link></li>
              <li><Link href="/original-art">Original Art</Link></li>
              <li><Link href="/personalised">Customise</Link></li>
              <li><Link href="/artzy-world">Artzy World</Link></li>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/for-business">For Business</Link></li>
            </ul>
          </div>
          <div className="footer-col footer-location">
            <h4>Studio Address</h4>
            <div className="footer-location-card">
              <div className="footer-location-title">
                <span className="footer-location-icon" aria-hidden="true">⌖</span>
                <div>
                  <strong>Artzy&apos;s Studio</strong>
                  <span>Physical Store · Pune</span>
                </div>
              </div>
              <address className="footer-address">
                <span>Ground Floor, Preetishilp Building</span>
                <span>Lane No. 3, Plot No. 22, Prashant Society</span>
                <span>Paud Road, Kothrud</span>
                <span>Pune, Maharashtra – 411038</span>
              </address>
              <a className="footer-map-link" href={MAP_URL} target="_blank" rel="noreferrer">
                View on Google Maps <span aria-hidden="true">↗</span>
              </a>
            </div>
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
        <nav className="footer-policy-links" aria-label="Customer information">
          <Link href="/about">About the Studio</Link>
          <Link href="/contact">Visit &amp; Contact</Link>
          <Link href="/shipping-policy">Shipping</Link>
          <Link href="/returns-policy">Returns &amp; damage</Link>
          <Link href="/customised-product-policy">Customised products</Link>
          <Link href="/cancellation-policy">Cancellation</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-and-conditions">Terms</Link>
          <Link href="/ai-concept-disclosure">AI concept disclosure</Link>
        </nav>
        <div className="footer-bottom">
          <span>© 2026 Artzy’s Studio. All rights reserved. · Designed &amp; Developed by Jaisal Shah</span>
        </div>
      </div>
    </footer>
  );
}
