import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { TechStack } from '@/components/sections/tech-stack';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <Features />
      <TechStack />
    </div>
  );
}
