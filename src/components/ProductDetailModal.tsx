"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import RichProductText, { RichProductName } from "@/components/RichProductText";

const FALLBACK_IMAGE = "/images/deepti_painting.png";

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
    () => (product.images?.filter(Boolean).length ? product.images.filter(Boolean) : [FALLBACK_IMAGE]).slice(0, 4),
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
    </div>
  );
}
