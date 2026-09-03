"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export const ARTZY_LOGO = '/images/artzy-studio-logo.png';

const SmartSearch = dynamic(() => import('@/components/search/SmartSearch'), { ssr: false });

type NavItem = { label: string; href: string; note?: string; hardNavigate?: boolean };
type NavGroup = { label: string; paths: string[]; items: NavItem[] };

const NAV: NavGroup[] = [
  { label: 'Shop', paths: ['/shop', '/original-art'], items: [
    { label: 'Shop All', href: '/shop', note: 'Real photographed pieces currently available from the studio ERP' },
    { label: 'Original Art', href: '/original-art' },
    { label: 'Home Décor', href: '/shop/?category=mirrors-and-decorative-hangings' },
    { label: 'Table & Utility Art', href: '/shop/?category=table-and-utility-art' },
    { label: 'Digital Prints', href: '/digital-prints' },
    { label: 'Ready to ship', href: '/shop/?availability=in-stock' },
  ]},
  { label: 'Gifts', paths: ['/gifts'], items: [
    { label: 'Gift Finder', href: '/gifts/#gift-finder', note: 'Find something meaningful by occasion, person and budget' },
    { label: 'Birthday Gifts', href: '/gifts/?occasion=birthday#gift-finder' },
    { label: 'Wedding Gifts', href: '/gifts/?occasion=wedding#gift-finder' },
    { label: 'Housewarming Gifts', href: '/gifts/?occasion=housewarming#gift-finder' },
    { label: 'Personalised Gifts', href: '/gifts/?mode=personalised#gift-finder' },
    { label: 'Gift Hampers', href: '/gifts/?mode=hampers#gift-finder' },
  ]},
  { label: 'Personalise', paths: ['/personalised', '/personalized', '/digital-prints', '/caricatures', '/name-plates'], items: [
    { label: 'Personalise', href: '/personalised', note: 'Choose the right creative path for your photograph, story or space' },
    { label: 'Caricatures', href: '/caricatures' },
    { label: 'Name Plates', href: '/name-plates' },
    { label: 'Digital Artwork', href: '/digital-prints' },
    { label: 'Custom Painting', href: '/personalised/#custom-artwork' },
  ]},
  { label: 'Artzy World', paths: ['/artzy-world'], items: [
    { label: 'Explore Artzy World', href: '/artzy-world', note: 'Interactive tools that help you understand art in your own space' },
    { label: 'Room Preview', href: '/artzy-world/preview/', hardNavigate: true },
    { label: 'Vastu Art Guide', href: '/artzy-world/preview/?guide=vastu', hardNavigate: true },
    { label: 'ArtzyAI Creative Experiences', href: '/artzy-world/#creative-experiences' },
  ]},
  { label: 'About', paths: ['/about', '/contact'], items: [
    { label: 'Deepti’s Story', href: '/about/#deepti-story', note: 'Meet Deepti, the deaf-led artist team and the Pune studio' },
    { label: 'Deaf Artist Team', href: '/about/#deaf-artist-team' },
    { label: 'Visit the Pune Studio', href: '/contact/#visit' },
    { label: 'Contact', href: '/contact' },
  ]},
];

function Icon({ name }: { name: 'search' | 'account' | 'cart' }) {
  if (name === 'search') return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
  if (name === 'account') return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>;
}

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const closeAtDesktop = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener('resize', closeAtDesktop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', closeAtDesktop);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpenGroup(null); setMobileOpen(false); }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const isActive = (group: NavGroup) => group.paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return <>
    <div className="store-announcement">Complimentary shipping on orders above ₹1,499 <span>·</span> <em>Where intention meets canvas</em></div>
    <header className="store-header" ref={headerRef}>
      <div className="store-header__inner">
        <Link href="/" prefetch={false} className="store-brand" aria-label="Artzy's Studio home">
          <img src={ARTZY_LOGO} alt="Artzy's Studio" width="88" height="81" />
          <span>By Deepti J. Shah</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV.map((group, index) => <div className="desktop-nav__group" key={group.label}>
            <button className={isActive(group) ? 'is-active' : ''} aria-expanded={openGroup === index} aria-controls={`mega-${index}`} onClick={() => setOpenGroup(openGroup === index ? null : index)}>
              {group.label}<span aria-hidden="true">⌄</span>
            </button>
            <div id={`mega-${index}`} className={`mega-menu ${openGroup === index ? 'is-open' : ''}`}>
              <div className="mega-menu__intro"><small>Explore</small><strong>{group.label}</strong><p>{group.items[0].note}</p></div>
              <div className="mega-menu__links">{group.items.map((item) => item.hardNavigate ? <a href={item.href} key={item.href + item.label}>{item.label}<span aria-hidden="true">→</span></a> : <Link href={item.href} prefetch={false} key={item.href + item.label}>{item.label}<span aria-hidden="true">→</span></Link>)}</div>
            </div>
          </div>)}
        </nav>

        <div className="store-utilities">
          <Link className={`business-cta ${pathname.startsWith('/for-business') ? 'is-active' : ''}`} href="/for-business" prefetch={false}>For Business</Link>
          <a className="ask-studio" href="https://wa.me/919158680722" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">✿</span> Ask Studio</a>
          <button className="utility-icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Icon name="search" /></button>
          <Link className="utility-icon desktop-account" href="/account" prefetch={false} aria-label="Your account"><Icon name="account" /></Link>
          <Link className="utility-icon cart-link" href="/checkout" prefetch={false} aria-label={`Cart with ${cartCount} items`}><Icon name="cart" />{cartCount > 0 && <b>{cartCount}</b>}</Link>
          <button className="menu-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)}><i/><i/><i/></button>
        </div>
      </div>
    </header>

    <div id="mobile-navigation" className={`mobile-navigation ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
      <button className="mobile-navigation__shade" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
      <nav className="mobile-navigation__panel" aria-label="Mobile navigation">
        <div className="mobile-navigation__head"><span>Explore Artzy's Studio</span><button aria-label="Close menu" onClick={() => setMobileOpen(false)}>×</button></div>
        {NAV.map((group, index) => <section className="mobile-accordion" key={group.label}>
          <div className={`mobile-accordion__row ${isActive(group) ? 'is-active' : ''}`}><Link href={group.items[0].href} prefetch={false}>{group.label}</Link><button aria-label={`${openGroup === index ? 'Hide' : 'Show'} ${group.label} choices`} aria-expanded={openGroup === index} aria-controls={`mobile-group-${index}`} onClick={() => setOpenGroup(openGroup === index ? null : index)}>{openGroup === index ? '−' : '+'}</button></div>
          <div id={`mobile-group-${index}`} hidden={openGroup !== index}>{group.items.slice(1).map((item) => item.hardNavigate ? <a href={item.href} key={item.href + item.label}>{item.label}</a> : <Link href={item.href} prefetch={false} key={item.href + item.label}>{item.label}</Link>)}</div>
        </section>)}
        <div className="mobile-navigation__quick"><Link href="/for-business" prefetch={false}>For Business</Link><Link href="/account" prefetch={false}>Your account</Link><a href="https://wa.me/919158680722">WhatsApp the studio</a></div>
      </nav>
    </div>
    <SmartSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    <style jsx global>{`
      .store-announcement{min-height:33px;display:flex;align-items:center;justify-content:center;gap:9px;padding:7px 16px;background:#f3eee7;border-bottom:1px solid #e4d8ce;color:#4b3a32;font-size:.7rem;letter-spacing:.06em;text-align:center;text-transform:uppercase}.store-announcement em{color:#b25156}.store-header{position:sticky;top:0;z-index:1000;background:rgba(255,252,248,.97);border-bottom:1px solid #eadfd6;backdrop-filter:blur(14px)}.store-header__inner{width:min(1460px,100%);height:92px;margin:auto;padding:0 clamp(16px,4vw,56px);display:grid;grid-template-columns:180px 1fr auto;align-items:center;gap:24px}.store-brand{width:max-content;display:grid;justify-items:center;color:#a74d52;text-decoration:none}.store-brand img{width:78px;height:72px;object-fit:contain}.store-brand span{margin-top:-4px;font-size:.56rem;letter-spacing:.16em;text-transform:uppercase}.desktop-nav{height:100%;display:flex;align-items:stretch;justify-content:center;gap:1px}.desktop-nav__group{display:flex;align-items:stretch}.desktop-nav__group>button{position:relative;padding:0 13px;border:0;background:none;color:#3d302a;font:600 .72rem var(--font-sans),sans-serif;letter-spacing:.055em;text-transform:uppercase;cursor:pointer}.desktop-nav__group>button span{margin-left:5px;color:#b25156}.desktop-nav__group>button:after{content:'';position:absolute;left:13px;right:13px;bottom:21px;height:2px;background:#b25156;transform:scaleX(0);transition:.2s}.desktop-nav__group>button.is-active{color:#a3464c}.desktop-nav__group>button.is-active:after,.desktop-nav__group>button[aria-expanded=true]:after{transform:scaleX(1)}.mega-menu{position:absolute;top:100%;left:50%;width:min(920px,calc(100vw - 48px));display:grid;grid-template-columns:280px 1fr;gap:38px;padding:31px 36px;background:#fffaf5;border:1px solid #e5d7cc;box-shadow:0 22px 55px #39261e20;opacity:0;visibility:hidden;transform:translate(-50%,9px);transition:.2s}.mega-menu.is-open{opacity:1;visibility:visible;transform:translate(-50%,0)}.mega-menu__intro{padding-right:28px;border-right:1px solid #e3d5c9}.mega-menu__intro small{color:#b25156;font-size:.62rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.mega-menu__intro strong{display:block;margin:8px 0;font:400 2rem var(--font-serif),Georgia,serif}.mega-menu__intro p{margin:0;color:#806e64;font-size:.78rem;line-height:1.55}.mega-menu__links{display:grid;grid-template-columns:1fr 1fr;align-content:center;gap:4px 28px}.mega-menu__links a{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #eadfd6;color:#44362f;font-size:.82rem;text-decoration:none}.mega-menu__links a:hover{color:#a3464c}.store-utilities{display:flex;align-items:center;justify-content:flex-end;gap:7px}.ask-studio{display:flex;align-items:center;gap:7px;min-height:40px;padding:8px 14px;border-radius:99px;background:#b25156;color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.05em;text-decoration:none;white-space:nowrap}.ask-studio span{font-size:1rem}.utility-icon,.menu-toggle{width:40px;height:40px;display:grid;place-items:center;border:1px solid transparent;border-radius:50%;background:transparent;color:#3f322c}.utility-icon:hover,.utility-icon:focus-visible,.menu-toggle:focus-visible{border-color:#d8c7bc;background:#fff8f2}.utility-icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.5}.cart-link{position:relative}.cart-link b{position:absolute;right:-1px;top:-1px;min-width:18px;height:18px;display:grid;place-items:center;padding:0 4px;border-radius:99px;background:#b25156;color:#fff;font-size:.58rem}.menu-toggle{display:none;padding:10px}.menu-toggle i{display:block;width:18px;height:1.5px;margin:2px;background:currentColor}.mobile-navigation{position:fixed;inset:0;z-index:1300;visibility:hidden;pointer-events:none}.mobile-navigation.is-open{visibility:visible;pointer-events:auto}.mobile-navigation__shade{position:absolute;inset:0;border:0;background:#2d211c88}.mobile-navigation__panel{position:absolute;right:0;top:0;width:min(91vw,410px);height:100%;overflow:auto;padding:20px 22px 32px;background:#fffaf5;transform:translateX(102%);transition:.28s}.mobile-navigation.is-open .mobile-navigation__panel{transform:none}.mobile-navigation__head{display:flex;align-items:center;justify-content:space-between;padding:0 0 17px;border-bottom:1px solid #e3d6cc;color:#a3464c;font-size:.69rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase}.mobile-navigation__head button{width:44px;height:44px;border:1px solid #decfc5;border-radius:50%;background:none;font-size:1.6rem}.mobile-accordion{border-bottom:1px solid #e6d9cf}.mobile-accordion>button{width:100%;min-height:58px;display:flex;align-items:center;justify-content:space-between;border:0;background:none;color:#41332c;font:500 1.35rem var(--font-serif),Georgia,serif;text-align:left}.mobile-accordion>button.is-active{color:#a3464c}.mobile-accordion>div{display:grid;padding:0 0 13px}.mobile-accordion a{padding:9px 7px;color:#68564d;font-size:.86rem;text-decoration:none}.mobile-navigation__quick{display:grid;gap:9px;padding-top:23px}.mobile-navigation__quick a{display:flex;align-items:center;justify-content:center;min-height:47px;border:1px solid #b25156;border-radius:99px;color:#9e4147;font-size:.78rem;font-weight:700;text-decoration:none}.mobile-navigation__quick a:last-child{background:#b25156;color:white}@media(max-width:1120px){.store-header__inner{grid-template-columns:130px 1fr auto}.store-brand img{width:69px}.desktop-nav__group>button{padding-inline:8px;font-size:.65rem}.ask-studio{padding-inline:11px}}@media(max-width:900px){.store-announcement{font-size:.58rem}.store-header__inner{height:76px;grid-template-columns:1fr auto;padding-inline:14px}.store-brand{justify-items:start}.store-brand img{width:67px;height:56px}.store-brand span{font-size:.49rem}.desktop-nav,.desktop-account{display:none}.menu-toggle{display:block}.ask-studio{min-height:44px;font-size:.63rem}.store-utilities{gap:3px}.utility-icon,.menu-toggle{width:44px;height:44px}}@media(max-width:430px){.store-announcement em,.store-announcement span{display:none}.ask-studio{padding:7px 10px}.utility-icon[aria-label=Search]{display:none}}
      .mobile-accordion__row{min-height:58px;display:grid!important;grid-template-columns:1fr 48px;align-items:center;padding:0!important}.mobile-accordion__row>a{font:500 1.35rem var(--font-serif),Georgia,serif;color:#41332c}.mobile-accordion__row.is-active>a{color:#a3464c}.mobile-accordion__row>button{width:44px;height:44px;border:0;background:transparent;color:#a3464c;font-size:1.35rem;cursor:pointer}@media(min-width:901px){.mobile-navigation{display:none!important}}
      .business-cta{padding:9px 10px;border-bottom:2px solid transparent;color:#493933;font-size:.65rem;font-weight:750;letter-spacing:.045em;text-decoration:none;text-transform:uppercase;white-space:nowrap}.business-cta:hover,.business-cta.is-active{border-color:#b25156;color:#a3464c}.mobile-navigation__quick{grid-template-columns:1fr 1fr}.mobile-navigation__quick a{padding-inline:8px;text-align:center}.mobile-navigation__quick a:last-child{grid-column:1/-1}@media(max-width:1220px){.business-cta{display:none}.store-header__inner{padding-inline:16px}.desktop-nav__group>button{padding-inline:8px;font-size:.65rem}}
    `}</style>
  </>;
}
