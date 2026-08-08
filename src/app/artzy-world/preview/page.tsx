import type { Metadata } from 'next';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: "Interactive Art Preview | Artzy World",
  description: "Preview available Artzy artwork and custom Artzy Muse directions in your own room.",
};

export default function ArtzyWorldPreviewPage() {
  return <div className="artzy-preview-page">
    <Header />
    <main>
      <div className="artzy-preview-heading">
        <div><span>Artzy World · Interactive workspace</span><h1>Place art in <em>your own world.</em></h1></div>
        <p>Available products come from ERP. Missing Indian art styles become clearly labelled Artzy Muse custom briefs—never fake stock.</p>
      </div>
      <iframe
        src="https://artzyai.artzysstudio.in/artzy-world?embed=1&source=storefront-fullpage"
        title="Artzy World full-page interactive artwork preview"
        allow="camera; clipboard-write; fullscreen"
      />
      <p className="artzy-preview-help">Camera access begins only when you choose to take a wall photo. For custom art or ordering help, use Ask Studio.</p>
    </main>
  </div>;
}
