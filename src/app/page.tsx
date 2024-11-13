'use client'
import homeImg from 'public/home_3.jpg';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Component */}
      <Hero
        imgData={homeImg}
        imgAlt="FLY MENU ASSISTANT"
        title="Please Click Menu"
      />
    </div>
  );
}