import homeImg from 'public/home_3.jpg';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Component with Italic Title */}
      <Hero
        imgData={homeImg}
        imgAlt="FLY MENU ASSISTANT"
        title={<span className="italic">Flight Menu Assistant</span>}
      />
    </div>
  );
}
