import homeImg from 'public/home_3.jpg';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <Hero
      imgData={homeImg}
      imgAlt="FLY MENU ASSISTANT"
      title="FLY MENU ASSISTANT"
    />
  );
}