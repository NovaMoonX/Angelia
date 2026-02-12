import { AngeliaLogo } from '@components/AngeliaLogo';
import { CategoricalAgencyIllustration } from '@components/CategoricalAgencyIllustration';
import { ComparisonTable } from '@components/ComparisonTable';
import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useAppDispatch } from '@store/hooks';
import { enterDemoMode } from '@store/actions/demoActions';
import { useNavigate } from 'react-router-dom';

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleViewDemoFeed = () => {
    dispatch(enterDemoMode());
    navigate('/feed');
  };

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-5xl space-y-24 px-6 py-16 md:py-24'>
        {/* Brand Header with Login */}
        <header className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <AngeliaLogo className='h-16 w-16 md:h-20 md:w-20' />
            <h2 className='text-foreground text-3xl font-bold md:text-4xl'>
              Angelia
            </h2>
          </div>
          <Button
            href='/auth?mode=login'
            variant='tertiary'
            className='text-sm md:text-base'
          >
            Login
          </Button>
        </header>

        {/* Hero Section */}
        <section className='space-y-8 text-center'>
          <h1 className='text-5xl font-bold tracking-tight md:text-7xl'>
            Family Connection, Without the Noise.
          </h1>
          <p className='text-foreground/70 mx-auto max-w-3xl text-xl leading-relaxed md:text-2xl'>
            A private, channel-based space where families share what
            matters—organized, intentional, and temporary.
          </p>
          <div className='flex flex-col items-center gap-3 pt-4'>
            <Button
              href='/auth?mode=signup'
              size='lg'
              className={join(
                'bg-accent hover:bg-accent/90 text-accent-foreground',
                'rounded-lg px-8 py-6 text-lg font-semibold',
                'transition-all duration-200',
                'shadow-lg hover:shadow-xl',
              )}
            >
              Get Started
            </Button>
            <Button onClick={handleViewDemoFeed} variant='tertiary' size='md'>
              View Demo Feed →
            </Button>
          </div>
        </section>

        {/* Temporal Hygiene Explanation */}
        <section className='mx-auto max-w-3xl space-y-4 text-center'>
          <h3 className='text-foreground text-2xl font-semibold md:text-3xl'>
            Why Updates Fade
          </h3>
          <p className='text-foreground/70 text-base leading-relaxed md:text-lg'>
            Updates automatically fade after six months, so you can share freely
            without creating a permanent archive. Recent moments stay vivid,
            while old details naturally fade—just like human memory. No
            performance pressure, just authentic connection.
          </p>
        </section>

        {/* Value Proposition - Categorical Agency */}
        <section id='categorical-agency' className='space-y-8 text-center'>
          <h2 className='text-3xl font-bold md:text-4xl'>
            Choose What Matters
          </h2>
          <div className='flex justify-center py-8'>
            <CategoricalAgencyIllustration className='w-full max-w-2xl' />
          </div>
          <p className='text-foreground/70 mx-auto max-w-3xl text-lg leading-relaxed md:text-xl'>
            Sharers categorize their updates into meaningful channels. Readers
            subscribe to what matters to them. Everyone has agency over their
            experience—no more thread dominance, no more conversational
            overload.
          </p>
        </section>

        {/* Comparison Table */}
        <section className='space-y-8'>
          <h2 className='text-center text-3xl font-bold md:text-4xl'>
            Filling the Gap
          </h2>
          <p className='text-foreground/70 mx-auto max-w-3xl text-center text-lg'>
            Angelia complements your existing communication tools by providing a
            dedicated space for intentional family updates.
          </p>
          <ComparisonTable className='mx-auto max-w-4xl' />
        </section>

        {/* Target Use Cases */}
        <section className='space-y-12'>
          <h2 className='text-center text-3xl font-bold md:text-4xl'>
            Built for Real Families
          </h2>
          <div className='grid gap-8 md:grid-cols-3'>
            {/* Use Case 1: Long-Distance Families */}
            <div className='space-y-4 text-center md:text-left'>
              <div className='text-4xl'>🏡</div>
              <h3 className='text-2xl font-semibold'>Long-Distance Families</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Anchor yourself in the family narrative. Stay connected to the
                mundane joys of daily life without drowning in chaotic group
                threads.
              </p>
            </div>

            {/* Use Case 2: Busy Professionals */}
            <div className='space-y-4 text-center md:text-left'>
              <div className='text-4xl'>💼</div>
              <h3 className='text-2xl font-semibold'>Busy Professionals</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Catch up on themed updates during your downtime. Subscribe to
                what you care about and skip the noise. Reclaim your time and
                attention.
              </p>
            </div>

            {/* Use Case 3: The Saturated Parent */}
            <div className='space-y-4 text-center md:text-left'>
              <div className='text-4xl'>👨‍👩‍👧‍👦</div>
              <h3 className='text-2xl font-semibold'>The Saturated Parent</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Share unfiltered updates without maintaining a permanent
                highlight reel. Updates automatically fade after six months, so
                there's no performance pressure.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className='space-y-6 pt-8 text-center'>
          <p className='text-foreground/60 text-lg'>
            Connection governed by logic, not algorithms.
          </p>
          <Button href='/about' variant='secondary' size='lg'>
            Learn More
          </Button>
        </section>
      </div>
    </div>
  );
}

export default Home;
