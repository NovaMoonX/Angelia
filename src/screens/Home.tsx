import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { CategoricalAgencyIllustration } from '@components/CategoricalAgencyIllustration';
import { ComparisonTable } from '@components/ComparisonTable';

function Home() {
  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-5xl px-6 py-16 md:py-24 space-y-24'>
        {/* Brand Header */}
        <header className='flex items-center justify-center gap-4'>
          <AngeliaLogo className='w-16 h-16 md:w-20 md:h-20' />
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>Angelia</h2>
        </header>

        {/* Hero Section */}
        <section className='text-center space-y-8'>
          <h1 className='text-5xl md:text-7xl font-bold tracking-tight'>
            Family Connection, Without the Noise.
          </h1>
          <p className='text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed'>
            A private, channel-based space where families share what matters—organized, intentional, and temporary.
          </p>
          <div className='pt-4 flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              href='/feed'
              size='lg'
              className={join(
                'bg-accent hover:bg-accent/90 text-accent-foreground',
                'text-lg px-8 py-6 rounded-lg font-semibold',
                'transition-all duration-200',
                'shadow-lg hover:shadow-xl'
              )}
            >
              View Feed
            </Button>
            <Button
              size='lg'
              variant='secondary'
              onClick={() => {
                const element = document.getElementById('categorical-agency');
                if (!element) {
                  console.warn('Scroll target element not found');
                  return;
                }
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                element.scrollIntoView({ 
                  behavior: prefersReducedMotion ? 'auto' : 'smooth', 
                  block: 'start' 
                });
              }}
            >
              Learn More
            </Button>
          </div>
        </section>

        {/* Temporal Hygiene Explanation */}
        <section className='space-y-4 max-w-3xl mx-auto text-center'>
          <h3 className='text-2xl md:text-3xl font-semibold text-foreground'>Why Updates Fade</h3>
          <p className='text-base md:text-lg text-foreground/70 leading-relaxed'>
            Updates automatically fade after six months, so you can share freely without creating a permanent archive. Recent moments stay vivid, while old details naturally fade—just like human memory. No performance pressure, just authentic connection.
          </p>
        </section>

        {/* Value Proposition - Categorical Agency */}
        <section id='categorical-agency' className='space-y-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold'>Choose What Matters</h2>
          <div className='flex justify-center py-8'>
            <CategoricalAgencyIllustration className='w-full max-w-2xl' />
          </div>
          <p className='text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed'>
            Sharers categorize their updates into meaningful channels. 
            Readers subscribe to what matters to them. 
            Everyone has agency over their experience—no more thread dominance, no more conversational overload.
          </p>
        </section>

        {/* Comparison Table */}
        <section className='space-y-8'>
          <h2 className='text-3xl md:text-4xl font-bold text-center'>Filling the Gap</h2>
          <p className='text-lg text-center text-foreground/70 max-w-3xl mx-auto'>
            Angelia complements your existing communication tools by providing a dedicated space for intentional family updates.
          </p>
          <ComparisonTable className='max-w-4xl mx-auto' />
        </section>

        {/* Target Use Cases */}
        <section className='space-y-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-center'>Built for Real Families</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {/* Use Case 1: Long-Distance Families */}
            <div className='space-y-4 text-center md:text-left'>
              <div className='text-4xl'>🏡</div>
              <h3 className='text-2xl font-semibold'>Long-Distance Families</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Anchor yourself in the family narrative. Stay connected to the mundane joys of daily life without drowning in chaotic group threads.
              </p>
            </div>

            {/* Use Case 2: Busy Professionals */}
            <div className='space-y-4 text-center md:text-left'>
              <div className='text-4xl'>💼</div>
              <h3 className='text-2xl font-semibold'>Busy Professionals</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Catch up on themed updates during your downtime. Subscribe to what you care about and skip the noise. Reclaim your time and attention.
              </p>
            </div>

            {/* Use Case 3: The Saturated Parent */}
            <div className='space-y-4 text-center md:text-left'>
              <div className='text-4xl'>👨‍👩‍👧‍👦</div>
              <h3 className='text-2xl font-semibold'>The Saturated Parent</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Share unfiltered updates without maintaining a permanent highlight reel. Updates automatically fade after six months, so there's no performance pressure.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className='text-center space-y-6 pt-8'>
          <p className='text-lg text-foreground/60'>
            Connection governed by logic, not algorithms.
          </p>
          <Button
            href='/about'
            variant='secondary'
            size='lg'
          >
            Learn More
          </Button>
        </section>
      </div>
    </div>
  );
}

export default Home;
