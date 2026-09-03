'use client';

import type { ArtDirectionId } from '@/data/artDirections';

type Props = {
  shape: string;
  motif: ArtDirectionId;
  palette: string;
  source: string;
  children: React.ReactNode;
};

export default function NamePlateInspirationButton({ shape, motif, palette, source, children }: Props) {
  function apply() {
    window.dispatchEvent(new CustomEvent('artzy:nameplate-inspiration', { detail: { shape, motif, palette, source } }));
  }

  return <button type="button" className="plate-inspiration-action" onClick={apply}>{children}</button>;
}
