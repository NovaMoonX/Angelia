import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';

function Home() {
  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-5xl px-6 py-16 md:py-24 space-y-24'>
        {/* Hero Section */}
        <section className='text-center space-y-8'>
          <h1 className='text-5xl md:text-7xl font-bold tracking-tight'>
            Family Connection, Without the Noise.
          </h1>
          <p className='text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed'>
            A private, channel-based space where families share what matters—organized, intentional, and ephemeral.
          </p>
          <div className='pt-4'>
            <Button
              size='lg'
              onClick={() => {
                const element = document.getElementById('categorical-agency');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={join(
                'bg-accent hover:bg-accent/90 text-accent-foreground',
                'text-lg px-8 py-6 rounded-lg font-semibold',
                'transition-all duration-200',
                'shadow-lg hover:shadow-xl'
              )}
            >
              Enter the Hearth
            </Button>
          </div>
        </section>

        {/* Value Proposition - Categorical Agency */}
        <section id='categorical-agency' className='space-y-6 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold'>Categorical Agency</h2>
          <p className='text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed'>
            Sharers categorize their updates into meaningful channels. 
            Readers subscribe to what matters to them. 
            Everyone has agency over their experience—no more thread dominance, no more conversational overload.
          </p>
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
                Share unfiltered updates without maintaining a permanent highlight reel. Six-month ephemerality means no performance pressure.
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
            variant='outline'
            size='lg'
            className='border-2 border-foreground/20 hover:border-accent hover:text-accent'
          >
            Learn More
          </Button>
        </section>
      </div>
    </div>
  );
}

export default Home;
