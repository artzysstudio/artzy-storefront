import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const occasions = [
  ['Personal Portraits', 'A lively portrait that celebrates personality, style and the details people remember.'],
  ['Couples & Families', 'Warm, playful compositions created from your favourite photographs and stories.'],
  ['Milestones', 'Birthdays, weddings, anniversaries, retirements and achievements made unforgettable.'],
  ['Corporate Gifts', 'Distinctive team, leadership and client gifts with thoughtful brand details.'],
];

export default function CaricaturesPage() {
  return <>
    <Header />
    <main className="service-page caricature-page">
    <section className="service-hero caricature-hero">
      <div className="service-hero-copy"><span className="service-eyebrow">Drawn from their story</span><h1>More than a portrait. <em>A moment with personality.</em></h1><p>Artzy&apos;s Studio turns photographs, memories and inside stories into expressive custom caricatures—created for people, milestones and gifts that deserve to feel personal.</p><div className="service-actions"><Link className="service-primary" href="/shop/?category=caricatures">Shop Caricatures</Link><Link className="service-secondary" href="/contact/">Create a Caricature</Link></div></div>
      <div className="service-art-panel"><span>PEOPLE</span><strong>Recognisable, expressive and full of character.</strong><span>STORIES</span><strong>Hobbies, professions and meaningful details included.</strong><span>GIFTS</span><strong>Made to surprise, delight and be remembered.</strong></div>
    </section>

    <section className="example-gallery">
      <div className="gallery-heading"><div><span className="service-eyebrow">Portrait possibilities</span><h2>See how every story becomes a different artwork.</h2></div><span className="swipe-hint">Swipe to explore →</span></div>
      <div className="example-track">
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Be2N7rbWBXCrcElOug2o7l0t4_uONyD5LBrgmlIlNicTaeBazpuia7NT6EWPI9ejiXhCJfDd7aBRIBKjpwRF5qBlXDu9VmaFdK1QaPcVE_GDhBs2pJi-T7F9cSlhc7WJYUmPG_mzS2Lx9BfxJrUJXyfRFL1xm50Ue0AcRM_bKhgR1K2BVw20TYaeP_M-nUH4OsR4OlDx8g86ZBBCRHdAi9EPgAS05sm3_18tstaFVCApLZvqKLorS2XGJEC1x53mMyBLkn4aU90" alt="Celebration Portrait caricature example" loading="lazy" /><div><span>Birthdays and milestones</span><h3>Celebration Portrait</h3></div></article>
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPmutd4-Tuo79CVeMH0mT-V_1aX14W9lOQLJtoWAPogXNMu9Y2-NtWSaKbxIRJBUe2swSqGGhYgy9Fq6rt5hUuAIGI6f9RnhpP5sowuogT3NUmkNB4Iob8E_PwRPxqxFpjE9FC2c4wAbSwD2q5yi-iON7tykAEFvC1jgr4hMp-zf-mzaSeYEPmlX9EzlBDl8QPRtC1WTIlYI_WkEATj74RAeOG7T8KSld5FH-Bx1kSrs_3qxUZIPYOBA3gV2AM5e75vBKDrFmLQaY" alt="Couple Story caricature example" loading="lazy" /><div><span>Weddings and anniversaries</span><h3>Couple Story</h3></div></article>
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFvBG2qsSWh7AvjCdCrdz8dOkBlz4IrRDku9U3OYtb__gFiaflfXN38j5ARok6RrnogJYrY2oWCwc4ASnI4EYkXEYAdCn8xjSwPSIvuuphjqGkndi-UXjqPS0_XhWu5puwP3Mg6PmWAP-0q6D7f8aT_fDuBsS5cN-ZNJPzBp7pWhNXsKwjKVEDhG_2p8XEcwkHAohjuavN9sundvn-sMY0qKoUmAMl6kj6vQZ5Wvh9_SPtsyOOXSrxGJTvrfoRfOWbkrxKLKZHwgc" alt="Family Character caricature example" loading="lazy" /><div><span>Families, children and pets</span><h3>Family Character</h3></div></article>
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6rBcHXDYteBlwoY8mbQvMmBYoRsiDVNPUmMT3354TxObY2r862hRHt6Ut2WZ4stLANsxPYDJf5Jp3-A6w191m6a5-pwM5Z2xBQGOzikgpQAyxKOlmhj4q1UNAUjua3u-igmiUfLCn3wOoMBXFPjajr9EncoCxlFL-jr9h-3fR5nSwb8nKYF_8pcBgraK-VYlamY_OdvE9Zdmkm6awVyoFFyRbdTXAgh9UCq07FRCH04NsT_67V2ikCuz2e-TyXgoeEF1DvsblPqM" alt="Team Tribute caricature example" loading="lazy" /><div><span>Corporate and retirement gifts</span><h3>Team Tribute</h3></div></article>
      </div>
    </section>
    <section className="service-section"><span className="service-eyebrow">Made for every story</span><h2>Personalised beyond the face.</h2><div className="service-card-grid">{occasions.map(([title, copy], i) => <article className="service-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="service-split"><div><span className="service-eyebrow">Your details matter</span><h2>Every element helps tell their story.</h2></div><div className="service-list"><p><strong>Choose the style</strong> Elegant, playful, minimal or richly detailed.</p><p><strong>Add their world</strong> Favourite objects, hobbies, profession, pets or memorable places.</p><p><strong>Select the finish</strong> Digital artwork, framed print, canvas or gifting presentation.</p></div></section>
    <section className="service-process"><span className="service-eyebrow">How it works</span><h2>A personal gift, made simple.</h2><ol><li><strong>Share</strong><span>Send clear photos and tell us the occasion.</span></li><li><strong>Describe</strong><span>Add personality, interests and special details.</span></li><li><strong>Approve</strong><span>Review the composition before final finishing.</span></li><li><strong>Gift</strong><span>Receive an artwork ready for the celebration.</span></li></ol><div className="service-actions center"><Link className="service-primary" href="/contact/">Start a Caricature</Link><Link className="service-secondary" href="/shop/?category=caricatures">View Options</Link></div></section>
    </main>
    <Footer />
  </>;
}
