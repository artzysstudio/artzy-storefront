"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { ARTZY_LOGO } from '@/components/layout/Header';

export default function LaunchGate({ children }: { children: ReactNode }) {
  const [isPublicDomain, setIsPublicDomain] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    setIsPublicDomain(hostname === 'www.artzysstudio.in' || hostname === 'artzysstudio.in');
  }, []);

  if (!isPublicDomain) return <>{children}</>;

  return (
    <main className="launch-gate">
      <div className="launch-pattern launch-pattern-one" aria-hidden="true"></div>
      <div className="launch-pattern launch-pattern-two" aria-hidden="true"></div>
      <section className="launch-card" aria-labelledby="launch-title">
        <div className="launch-status"><span></span> Ecommerce launching soon</div>
        <img className="launch-logo" src={ARTZY_LOGO} alt="Artzy's Studio by Deepti J. Shah" />
        <p className="launch-kicker">A thoughtful new shopping experience is taking shape</p>
        <h1 id="launch-title">Something artful<br/><em>is almost here.</em></h1>
        <p className="launch-copy">We are preparing Artzy’s Studio online—bringing original paintings, digital prints, caricatures, personalised gifts and corporate gifting together in one beautiful place.</p>
        <div className="launch-divider"><span>Made by hand · Chosen by heart</span></div>
        <div className="launch-contact">
          <p>For custom orders and enquiries while we prepare:</p>
          <div>
            <a href="https://wa.me/919158680722" target="_blank" rel="noopener noreferrer">WhatsApp the studio</a>
            <a href="mailto:artzysstudio@gmail.com">artzysstudio@gmail.com</a>
          </div>
        </div>
        <p className="launch-note">Visit again soon at <strong>www.artzysstudio.in</strong></p>
      </section>
      <style jsx>{`
        .launch-gate { min-height: 100svh; position: relative; overflow: hidden; display: grid; place-items: center; padding: 32px 20px; background: #f7efe5; color: #43352e; }
        .launch-gate::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 18% 10%, rgba(181,82,86,.13), transparent 32%), radial-gradient(circle at 88% 88%, rgba(157,113,78,.13), transparent 30%); }
        .launch-pattern { position: absolute; width: 330px; height: 330px; border: 1px solid rgba(181,82,86,.2); border-radius: 42% 58% 65% 35% / 35% 38% 62% 65%; animation: launchFloat 11s ease-in-out infinite alternate; }
        .launch-pattern::before, .launch-pattern::after { content: ''; position: absolute; inset: 28px; border: 1px dashed rgba(181,82,86,.18); border-radius: inherit; }
        .launch-pattern::after { inset: 62px; border-style: solid; }
        .launch-pattern-one { top: -150px; left: -120px; transform: rotate(18deg); }
        .launch-pattern-two { right: -150px; bottom: -130px; transform: rotate(195deg); animation-delay: -5s; }
        .launch-card { position: relative; z-index: 1; width: min(720px, 100%); padding: clamp(34px, 6vw, 70px); text-align: center; background: rgba(255,251,246,.86); border: 1px solid rgba(95,70,58,.16); box-shadow: 0 30px 80px rgba(73,49,39,.12); backdrop-filter: blur(15px); }
        .launch-status { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 24px; color: #a4474d; font-size: .72rem; font-weight: 750; letter-spacing: .16em; text-transform: uppercase; }
        .launch-status span { width: 8px; height: 8px; border-radius: 50%; background: #b65256; box-shadow: 0 0 0 6px rgba(182,82,86,.11); animation: launchPulse 1.8s ease-in-out infinite; }
        .launch-logo { display: block; width: 138px; height: auto; margin: 0 auto 22px; }
        .launch-kicker { margin: 0 0 16px; color: #9e5a52; font-size: .72rem; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
        h1 { margin: 0; font-family: var(--font-display, Georgia, serif); font-size: clamp(3rem, 8vw, 5.7rem); font-weight: 400; line-height: .96; letter-spacing: -.045em; }
        h1 em { color: #b55257; font-weight: 400; }
        .launch-copy { max-width: 570px; margin: 28px auto 0; color: #735e52; font-size: clamp(.98rem, 2vw, 1.08rem); line-height: 1.75; }
        .launch-divider { display: flex; align-items: center; gap: 16px; margin: 30px 0; color: #a4474d; font-family: var(--font-display, Georgia, serif); font-size: .9rem; font-style: italic; }
        .launch-divider::before, .launch-divider::after { content: ''; flex: 1; height: 1px; background: rgba(95,70,58,.17); }
        .launch-contact p { margin: 0 0 15px; color: #806b60; font-size: .86rem; }
        .launch-contact div { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
        .launch-contact a { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 11px 18px; border: 1px solid rgba(164,71,77,.42); border-radius: 999px; color: #943f44; font-size: .82rem; font-weight: 700; text-decoration: none; transition: .2s ease; }
        .launch-contact a:first-child { background: #b55257; border-color: #b55257; color: white; box-shadow: 0 9px 24px rgba(181,82,87,.2); }
        .launch-contact a:hover { transform: translateY(-2px); }
        .launch-note { margin: 26px 0 0; color: #9a8579; font-size: .76rem; letter-spacing: .04em; }
        @keyframes launchFloat { to { transform: rotate(35deg) translate3d(16px, 18px, 0); } }
        @keyframes launchPulse { 50% { transform: scale(.7); opacity: .55; } }
        @media (max-width: 560px) { .launch-gate { padding: 14px; } .launch-card { padding: 30px 20px; } .launch-logo { width: 112px; } .launch-contact div { display: grid; } .launch-contact a { width: 100%; } .launch-divider { font-size: .8rem; } }
        @media (prefers-reduced-motion: reduce) { .launch-pattern, .launch-status span { animation: none; } }
      `}</style>
    </main>
  );
}
