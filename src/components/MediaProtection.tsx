"use client";

import { useEffect } from "react";

export default function MediaProtection() {
  useEffect(() => {
    const protectImages = (root: ParentNode = document) => {
      root.querySelectorAll("img").forEach((image) => {
        image.setAttribute("draggable", "false");
        image.setAttribute("data-artzy-protected", "true");
      });
    };

    const blockImageMenu = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("img, picture, .product-gallery-stage, .product-image-wrapper")) {
        event.preventDefault();
      }
    };

    const blockImageDrag = (event: DragEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("img, picture")) event.preventDefault();
    };

    protectImages();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (node.matches("img")) {
              node.setAttribute("draggable", "false");
              node.setAttribute("data-artzy-protected", "true");
            }
            protectImages(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("contextmenu", blockImageMenu, true);
    document.addEventListener("dragstart", blockImageDrag, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("contextmenu", blockImageMenu, true);
      document.removeEventListener("dragstart", blockImageDrag, true);
    };
  }, []);

  return null;
}
