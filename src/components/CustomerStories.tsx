import Link from 'next/link';
import Image from 'next/image';

export type CustomerStory = { id: string; quote: string; name: string; context?: string; photoUrl?: string };
const EMPTY_STORIES: CustomerStory[] = [];

export default function CustomerStories({ stories = EMPTY_STORIES }: { stories?: CustomerStory[] }) {
  return <section className="home-stories" aria-labelledby="home-stories-title">
    <header><div><span>Customer stories</span><h2 id="home-stories-title">Art that becomes part of life.</h2></div><p>Named stories and customer photographs are published only after permission.</p></header>
    {stories.length > 0 ? <div className="home-stories__rail" aria-label="Customer testimonials">{stories.map((story) => <article key={story.id}><p>“{story.quote}”</p><footer>{story.photoUrl ? <Image src={story.photoUrl} alt="" width={46} height={46} unoptimized /> : <span aria-hidden="true">{story.name.slice(0, 1)}</span>}<div><strong>{story.name}</strong>{story.context && <small>{story.context}</small>}</div></footer></article>)}</div> :
      <div className="home-stories__empty"><span className="home-stories__mark" aria-hidden="true">✿</span><div><h3>Have an Artzy piece in your world?</h3><p>We are preparing this space for genuine customer photographs and words. If you would like your experience to be considered, share it directly with the studio.</p></div><a href="https://wa.me/919158680722?text=Namaste%2C%20I%20would%20like%20to%20share%20my%20Artzy%27s%20Studio%20experience." target="_blank" rel="noreferrer">Share your story</a><Link href="/contact/">Visit or contact us</Link></div>}
  </section>;
}
