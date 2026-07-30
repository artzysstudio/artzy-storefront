const INSTAGRAM_URL = "https://www.instagram.com/artzysstudio/";
const FACEBOOK_URL = "https://www.facebook.com/artzysstudio";

export default function SocialLinks({ location }: { location: "header" | "menu" | "footer" }) {
  return (
    <div className={`social-links social-links-${location}`} aria-label="Follow Artzy's Studio">
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Artzy's Studio on Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.25" />
          <circle className="social-icon-dot" cx="17.4" cy="6.7" r="1" />
        </svg>
      </a>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Artzy's Studio on Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.3 21v-8h2.8l.45-3.2H14.3V7.75c0-.93.3-1.57 1.62-1.57h1.78V3.3c-.31-.04-1.37-.13-2.6-.13-2.57 0-4.33 1.57-4.33 4.45V9.8H7.9V13h2.87v8h3.53Z" />
        </svg>
      </a>
    </div>
  );
}
