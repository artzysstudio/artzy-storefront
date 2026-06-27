import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>Artzy's Studio</h2>
            <p>
              By Contemporary Artist Deepti J. Shah. Original paintings, fluid resin art, and bespoke pieces created with intention and passion.
            </p>
          </div>
          <div className="footer-col">
            <h4>Studio Portfolio</h4>
            <ul className="footer-links">
              <li><Link href="/shop/paintings">Original Paintings</Link></li>
              <li><Link href="/shop/resin">Resin Art</Link></li>
              <li><Link href="/shop/gifts">Personalized Gifting</Link></li>
              <li><Link href="/personalized">Custom Commissions</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>The Artist</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Deepti J. Shah</Link></li>
              <li><Link href="/journal">Studio Journal</Link></li>
              <li><Link href="/corporate">Corporate Orders</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul className="footer-links">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Artzy's Studio. All rights reserved.</span>
          <span>Crafted in India</span>
        </div>
      </div>
    </footer>
  );
}
