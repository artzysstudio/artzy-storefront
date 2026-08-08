import { redirect } from 'next/navigation';

export default function ArtzyWorldPreviewPage() {
  redirect('/artzy-world/preview-app/index.html?source=storefront-fullpage');
}
