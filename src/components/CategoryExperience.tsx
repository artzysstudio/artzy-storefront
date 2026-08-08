"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const ARTZY_AI_ENABLED = false;

const categories = [
  {
    name: "Hand-painted Art",
    note: "Original canvases, wall art and artist-painted objects",
    image: "/assets/painting_1.png",
    placement: "your wall or living space",
    href: "/shop/?category=wall-art-and-frames",
  },
  {
    name: "Digital Art, Prints & Caricatures",
    note: "Modern, abstract and geometric art, plus expressive portraits created from your photographs",
    image: "/assets/hero_bg_authentic.png",
    placement: "your wall",
    href: "/digital-prints",
  },
  {
    name: "Personal & Combo Gifts",
    note: "Story-led keepsakes, celebration gifts and thoughtfully assembled combinations",
    image: "/assets/corporate_gift_1.png",
    placement: "your celebration",
    href: "/gifts",
  },
  {
    name: "Corporate & Commercial Art",
    note: "Custom gifting, workplace art, brand-led visuals and creative project commissions",
    image: "/assets/project_gallery_1.png",
    placement: "your office or commercial space",
    href: "/for-business",
  },
];

export default function CategoryExperience() {
  const [visualize, setVisualize] = useState<(typeof categories)[number] | null>(
    null,
  );
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeVisualizer = () => {
    setVisualize(null);
    setRoomPhoto(null);
  };

  return (
    <>
      <section id="shop-by-category" className="artzy-shop" aria-labelledby="shop-creative-world">
        <div className="artzy-shop__intro">
          <div>
            <span>Explore our creative world</span>
            <h1 id="shop-creative-world">Made with art. Made for you.</h1>
          </div>
          <p>
            From hand-painted originals to digital art, caricatures and
            thoughtful gifts—discover Deepti J. Shah&apos;s work by the way you
            want to experience it.
          </p>
        </div>

        <div className="artzy-shop__grid">
          {categories.map((category, index) => (
            <article className="artzy-category" key={category.name}>
              <Link href={category.href} className="artzy-category__image">
                <img src={category.image} alt={category.name} />
                <span>0{index + 1}</span>
              </Link>
              <div className="artzy-category__copy">
                <div>
                  <h2>{category.name}</h2>
                  <p>{category.note}</p>
                </div>
                <Link href={category.href}>Shop now →</Link>
              </div>
              {ARTZY_AI_ENABLED && <button
                className="artzy-ai"
                onClick={() => setVisualize(category)}
                aria-label={`Visualize ${category.name} with ArtzyAI`}
              >
                <span>✦</span> Visualize with ArtzyAI
              </button>}
            </article>
          ))}
        </div>

        <div className="artzy-shop__benefits">
          <span>Made by our studio</span>
          <span>Deepti &amp; deaf artists</span>
          <span>Personal and commercial</span>
          <span>Visit us in Kothrud, Pune</span>
        </div>
      </section>

      {ARTZY_AI_ENABLED && visualize && (
        <div className="artzy-visualizer" role="dialog" aria-modal="true">
          <button
            className="artzy-visualizer__backdrop"
            onClick={closeVisualizer}
            aria-label="Close ArtzyAI visualizer"
          />
          <div className="artzy-visualizer__panel">
            <button
              className="artzy-visualizer__close"
              onClick={closeVisualizer}
              aria-label="Close"
            >
              ×
            </button>
            <span className="artzy-visualizer__eyebrow">✦ ArtzyAI</span>
            <h2>See {visualize.name.toLowerCase()} in {visualize.placement}.</h2>
            <p>
              Take a photo with your camera or choose one from your gallery.
              ArtzyAI will use it as the canvas for your selected pieces.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setRoomPhoto(URL.createObjectURL(file));
              }}
            />
            {roomPhoto ? (
              <div className="artzy-visualizer__preview">
                <img src={roomPhoto} alt="Customer room preview" />
                <div>
                  <strong>Your space is ready</strong>
                  <span>
                    Next: choose a product to generate its placement preview.
                  </span>
                </div>
              </div>
            ) : (
              <button
                className="artzy-visualizer__camera"
                onClick={() => inputRef.current?.click()}
              >
                <b>Use camera</b>
                <span>or upload a room photo</span>
              </button>
            )}
            <div className="artzy-visualizer__actions">
              {roomPhoto && (
                <button onClick={() => inputRef.current?.click()}>
                  Change photo
                </button>
              )}
              <Link href={visualize.href}>Browse {visualize.name} →</Link>
            </div>
            <small>
              Your image stays private and is used only for this visualization.
            </small>
          </div>
        </div>
      )}

      <style jsx>{`
        .artzy-shop {
          padding: 72px clamp(20px, 5vw, 72px) 48px;
          background: #fdf8f1;
          color: #3c2e2a;
        }
        .artzy-shop__intro {
          max-width: 1440px;
          margin: 0 auto 42px;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 48px;
          align-items: end;
        }
        .artzy-shop__intro span,
        .artzy-visualizer__eyebrow {
          color: #a64c57;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .artzy-shop__intro h1 {
          font-size: clamp(2.8rem, 6vw, 6.5rem);
          line-height: 0.92;
          margin: 14px 0 0;
          max-width: 850px;
        }
        .artzy-shop__intro p {
          font-size: 1.05rem;
          line-height: 1.75;
        }
        .artzy-shop__grid {
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-left: 1px solid #dacbc0;
          border-top: 1px solid #dacbc0;
        }
        .artzy-category {
          min-width: 0;
          padding: 14px;
          border-right: 1px solid #dacbc0;
          border-bottom: 1px solid #dacbc0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fffaf5;
        }
        .artzy-category__image {
          height: 360px;
          overflow: hidden;
          position: relative;
          background: #eaded4;
        }
        .artzy-category__image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.55s ease;
        }
        .artzy-category:hover img {
          transform: scale(1.035);
        }
        .artzy-category__image span {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fffaf5;
          display: grid;
          place-items: center;
          font-size: 0.7rem;
        }
        .artzy-category__copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          min-height: 142px;
        }
        .artzy-category h2 {
          font-size: 1.55rem;
          line-height: 1.05;
          margin: 0 0 8px;
          overflow-wrap: anywhere;
        }
        .artzy-category p {
          font-size: 0.86rem;
          line-height: 1.55;
        }
        .artzy-category__copy > a {
          width: fit-content;
          border-bottom: 1px solid #a64c57;
          font-size: 0.82rem;
        }
        .artzy-ai {
          border: 1px solid #a64c57;
          background: #a64c57;
          color: white;
          padding: 13px 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }
        .artzy-ai:hover {
          background: #823b45;
          transform: translateY(-2px);
        }
        .artzy-shop__benefits {
          max-width: 1440px;
          margin: 22px auto 0;
          padding: 18px 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          color: #75645d;
          font-size: 0.76rem;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .artzy-visualizer {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
        }
        .artzy-visualizer__backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(39, 28, 25, 0.72);
          backdrop-filter: blur(8px);
        }
        .artzy-visualizer__panel {
          position: relative;
          width: min(620px, 100%);
          max-height: 90vh;
          overflow: auto;
          padding: clamp(28px, 5vw, 52px);
          background: #fffaf5;
          box-shadow: 12px 12px 0 rgba(166, 76, 87, 0.45);
        }
        .artzy-visualizer__panel h2 {
          font-size: clamp(2rem, 5vw, 3.6rem);
          line-height: 1;
          margin: 16px 0;
        }
        .artzy-visualizer__panel p {
          line-height: 1.7;
          margin-bottom: 22px;
        }
        .artzy-visualizer__close {
          position: absolute;
          right: 16px;
          top: 12px;
          border: 0;
          background: none;
          font-size: 2rem;
          cursor: pointer;
        }
        .artzy-visualizer__camera {
          width: 100%;
          min-height: 180px;
          border: 1px dashed #a64c57;
          background: #f7ece5;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .artzy-visualizer__camera b {
          font-size: 1.15rem;
        }
        .artzy-visualizer__camera span {
          color: #75645d;
        }
        .artzy-visualizer__preview {
          position: relative;
          height: 260px;
          overflow: hidden;
        }
        .artzy-visualizer__preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .artzy-visualizer__preview div {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          padding: 12px;
          background: rgba(255, 250, 245, 0.92);
          display: flex;
          flex-direction: column;
          font-size: 0.8rem;
        }
        .artzy-visualizer__actions {
          display: flex;
          gap: 10px;
          margin: 18px 0;
        }
        .artzy-visualizer__actions > * {
          flex: 1;
          padding: 12px;
          border: 1px solid #a64c57;
          background: transparent;
          text-align: center;
          cursor: pointer;
        }
        .artzy-visualizer__actions a {
          background: #a64c57;
          color: white;
        }
        .artzy-visualizer small {
          color: #75645d;
        }
        @media (max-width: 980px) {
          .artzy-shop__intro {
            grid-template-columns: 1fr;
          }
          .artzy-shop__grid {
            grid-template-columns: 1fr 1fr;
          }
          .artzy-shop__benefits {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .artzy-shop {
            padding: 52px 14px 32px;
            overflow-x: clip;
          }
          .artzy-shop__intro {
            gap: 18px;
            margin-bottom: 28px;
          }
          .artzy-shop__intro h1 {
            font-size: clamp(2.65rem, 14vw, 4rem);
            overflow-wrap: anywhere;
          }
          .artzy-shop__grid {
            grid-template-columns: 1fr;
          }
          .artzy-category__image {
            height: min(112vw, 420px);
          }
          .artzy-category__copy {
            min-height: auto;
          }
          .artzy-shop__benefits {
            grid-template-columns: 1fr;
          }
          .artzy-visualizer__actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
