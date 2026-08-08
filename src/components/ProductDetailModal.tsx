"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import RichProductText, { RichProductName } from "@/components/RichProductText";

// Optional ERP fields are rendered only when the product feed provides them.
const variantLabel = (variant: ProductVariant, index: number) =>
  variant.name ||
  variant.title ||
  [variant.option, variant.value].filter(Boolean).join(": ") ||
  Object.values(variant.attributes || {}).join(" · ") ||
  `Option ${index + 1}`;

export default function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const images = useMemo(
    () => product.images.filter(Boolean).slice(0, 4),
    [product.images],
  );
  const availableVariants = product.variants || [];
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(images.length > 1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);

  const selected = availableVariants[selectedVariant];
  const stockQuantity = selected?.quantity ?? product.quantity;
  const soldOut =
    product.isSoldOut ||
    product.availability === "out_of_stock" ||
    selected?.isAvailable === false ||
    stockQuantity === 0;
  const displayPrice = selected?.price ?? product.salePrice ?? product.price;
  const deliveryTime =
    product.leadTime ||
    (product.availability === "made_to_order" ? "Made to order — dispatch time confirmed after your brief" : "Usually dispatched in 3–5 working days");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setActiveImage((index) => (index + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveImage((index) => (index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, onClose]);

  useEffect(() => {
    if (!isPlaying || images.length < 2) return;
    const timer = window.setInterval(
      () => setActiveImage((index) => (index + 1) % images.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, [images.length, isPlaying]);

  const addProduct = () => {
    if (soldOut) return;
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-detail-backdrop" role="presentation" onClick={onClose}>
      <article
        className="product-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="product-detail-close" type="button" onClick={onClose} aria-label="Close product details">×</button>

        <section className="product-gallery" aria-label={`${product.name} gallery`}>
          <div className="product-gallery-stage">
            <Image
              key={images[activeImage]}
              src={images[activeImage]}
              alt={`${product.name} — view ${activeImage + 1}`}
              fill
              sizes="(max-width: 760px) 100vw, 56vw"
              unoptimized
              priority
            />
            {images.length > 1 && (
              <>
                <button className="gallery-arrow previous" type="button" onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>
                <button className="gallery-arrow next" type="button" onClick={() => setActiveImage((activeImage + 1) % images.length)} aria-label="Next image">›</button>
                <button className="gallery-play" type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
                  {isPlaying ? "Pause" : "Play"} · {activeImage + 1}/{images.length}
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-gallery-thumbs">
              {images.map((image, index) => (
                <button className={activeImage === index ? "active" : ""} type="button" key={`${image}-${index}`} onClick={() => { setActiveImage(index); setIsPlaying(false); }} aria-label={`Show image ${index + 1}`}>
                  <Image src={image} alt="" fill sizes="84px" unoptimized />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="product-detail-copy">
          <span className="product-detail-category">{product.category}</span>
          <h2 id="product-detail-title"><RichProductName name={product.name} /></h2>
          {product.sku && <span className="product-detail-sku">SKU {product.sku}</span>}
          <div className="product-detail-price">₹{displayPrice.toLocaleString("en-IN")}</div>

          <div className={`product-stock ${soldOut ? "out" : ""}`}>
            <span aria-hidden="true"></span>
            {soldOut
              ? "Currently unavailable"
              : typeof stockQuantity === "number"
                ? stockQuantity <= 5
                  ? `Only ${stockQuantity} left in studio`
                  : `${stockQuantity} available`
                : product.availability === "made_to_order"
                  ? "Made to order"
                  : "Available to order"}
          </div>

          <RichProductText
            text={product.artworkStory || product.artistNotes || product.seo?.description || `A distinctive ${product.category.toLowerCase()} piece from Deepti J. Shah’s studio, created with an artist’s attention to colour, finish and detail.`}
          />

          {availableVariants.length > 0 && (
            <fieldset className="product-variants">
              <legend>Available options</legend>
              <div>
                {availableVariants.map((variant, index) => (
                  <button
                    className={selectedVariant === index ? "active" : ""}
                    type="button"
                    key={variant.id || variant.sku || index}
                    disabled={variant.isAvailable === false || variant.quantity === 0}
                    onClick={() => setSelectedVariant(index)}
                  >
                    {variantLabel(variant, index)}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <dl className="product-facts">
            {product.medium && <div><dt>Medium</dt><dd>{product.medium}</dd></div>}
            {product.material && <div><dt>Material</dt><dd>{product.material}</dd></div>}
            {product.dimensions && <div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div>}
            {product.artist && <div><dt>Artist</dt><dd>{product.artist}</dd></div>}
          </dl>

          <div className="delivery-card">
            <strong>Delivery estimate</strong>
            <span>{deliveryTime}</span>
            <small>Final delivery depends on destination, personalisation and studio availability.</small>
          </div>

          {product.careInstructions && (
            <details className="product-care">
              <summary>Care instructions</summary>
              <RichProductText text={product.careInstructions} />
            </details>
          )}

          <button className={`product-detail-add${added ? " added" : ""}`} type="button" disabled={soldOut} onClick={addProduct}>
            {soldOut ? "Currently unavailable" : added ? "Added to bag ✓" : "Add to bag"}
          </button>
        </section>
      </article>
      <style jsx global>{`
        @media (min-width: 769px) {
          .product-detail-backdrop {
            display: grid !important;
            place-items: center !important;
            padding: clamp(20px, 3vw, 48px) !important;
          }
          .product-detail-modal {
            grid-template-columns: minmax(0, 1.08fr) minmax(390px, .92fr) !important;
            width: min(1280px, 96vw) !important;
            height: min(86vh, 820px) !important;
            max-height: 820px !important;
            overflow: hidden !important;
            border: 1px solid rgba(72, 53, 43, .1);
            border-radius: 20px !important;
          }
          .product-gallery {
            grid-template-rows: minmax(0, 1fr) auto !important;
            min-height: 0 !important;
            height: 100% !important;
            padding: 24px !important;
            border-right: 1px solid rgba(72, 53, 43, .1);
            background: #eee8df;
          }
          .product-gallery-stage {
            width: 100%;
            height: 100% !important;
            min-height: 0 !important;
            border-radius: 14px;
            background: #f8f4ee;
          }
          .product-gallery-stage img {
            object-fit: contain !important;
            padding: clamp(12px, 2vw, 24px) !important;
          }
          .product-gallery-thumbs {
            grid-template-columns: repeat(4, minmax(0, 88px)) !important;
            justify-content: center;
            gap: 10px;
          }
          .product-gallery-thumbs button { min-height: 72px !important; }
          .product-detail-copy {
            height: 100%;
            overflow-y: auto !important;
            padding: clamp(40px, 4vw, 58px) clamp(34px, 4vw, 54px) 44px !important;
            scrollbar-width: thin;
            scrollbar-color: #cda9a2 transparent;
          }
          .product-detail-copy h2 {
            max-width: 13ch;
            margin-top: 12px;
            font-size: clamp(2.35rem, 3.2vw, 3.5rem) !important;
            line-height: .98 !important;
          }
          .product-detail-price { margin-top: 22px; font-size: 1.55rem; }
          .product-detail-add {
            position: sticky;
            bottom: 0;
            min-height: 56px;
            margin-top: 6px;
            box-shadow: 0 -12px 22px #fffaf4;
          }
          .product-detail-close { top: 18px; right: 18px; }
        }

        @media (max-width: 768px) {
          .product-detail-backdrop {
            display: flex !important;
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .product-detail-modal {
            display: block !important;
            width: 100dvw !important;
            max-width: 100dvw !important;
            height: min(94dvh, 900px) !important;
            max-height: 94dvh !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            overscroll-behavior: contain;
            border-radius: 18px 18px 0 0 !important;
          }
          .product-gallery {
            display: grid !important;
            grid-template-rows: minmax(0, 1fr) auto !important;
            width: 100%;
            height: min(52vh, 470px) !important;
            min-height: 390px !important;
            padding: 12px !important;
          }
          .product-gallery-stage {
            width: 100%;
            height: 100% !important;
            min-height: 0 !important;
            border-radius: 10px;
          }
          .product-gallery-stage img { padding: 8px !important; }
          .product-gallery-thumbs {
            grid-template-columns: repeat(4, minmax(0, 68px)) !important;
            justify-content: center;
            gap: 7px;
            padding-top: 8px;
          }
          .product-gallery-thumbs button { min-height: 54px !important; }
          .product-detail-copy {
            overflow: visible !important;
            padding: 26px 20px calc(30px + env(safe-area-inset-bottom)) !important;
          }
          .product-detail-copy h2 {
            max-width: 15ch;
            font-size: clamp(2rem, 10vw, 2.65rem) !important;
            line-height: 1 !important;
          }
          .product-detail-close {
            position: fixed;
            top: max(12px, env(safe-area-inset-top));
            right: 12px;
          }
        }
      `}</style>
    </div>
  );
}
