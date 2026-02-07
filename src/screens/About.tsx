import { Button } from '@moondreamsdev/dreamer-ui/components';
import { Link } from 'react-router-dom';
import { AngeliaLogo } from '@components/AngeliaLogo';

function About() {
  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-4xl px-6 py-16 md:py-24 space-y-16'>
        {/* Brand Header - Top Left */}
        <header className='flex items-start justify-start'>
          <Link to='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
            <AngeliaLogo className='w-12 h-12 md:w-14 md:h-14' />
            <h2 className='text-2xl md:text-3xl font-bold text-foreground'>Angelia</h2>
          </Link>
        </header>

        {/* Page Header */}
        <section className='text-center space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold'>The Manifesto</h1>
          <p className='text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto'>
            Why we built Angelia, and how it's different from everything else.
          </p>
        </section>

        {/* Introduction - The Connectivity Paradox */}
        <section className='space-y-4'>
          <p className='text-lg text-foreground/80 leading-relaxed'>
            Here's the paradox: we've never had more ways to stay connected, yet we've never felt more disconnected from the people who matter most.
          </p>
          <p className='text-lg text-foreground/80 leading-relaxed'>
            More messaging apps. More social platforms. More group chats. But somehow, less meaningful connection. The updates that matter—your mom's first garden harvest, your nephew's soccer game, the little joys that make up a life—get buried in the noise.
          </p>
        </section>

        {/* Section 1: The Crisis of Synchronous Noise */}
        <section className='space-y-6'>
          <h2 className='text-3xl md:text-4xl font-bold'>The Crisis of Synchronous Noise</h2>
          <div className='space-y-4'>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              Your family group chat wasn't designed for what it's become. It was built for "Where should we meet for dinner?" not "Here's every meaningful moment from the past decade."
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              But that's exactly how we use it now. A recipe request gets buried under baby photos. Important health updates disappear beneath vacation planning. That beautiful sunset your dad shared? You'll never find it again without scrolling for twenty minutes.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              Meanwhile, social media promised to keep us connected. Instead, it became a performance stage—a highlight reel curated for strangers, sponsored content, and algorithmic feeds that prioritize engagement over actual connection. The "social" got lost in the noise.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              We're left exhausted, overwhelmed, and somehow still disconnected from the people we love most.
            </p>
          </div>
        </section>

        {/* Section 2: The Solution: Angelia */}
        <section className='space-y-6'>
          <h2 className='text-3xl md:text-4xl font-bold'>The Solution: Angelia</h2>
          <div className='space-y-4'>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              Angelia isn't trying to replace your group chats or social media. It fills the gap they leave behind—a space for intentional family connection without the chaos.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              Here's how it works: Instead of dumping everything into one overwhelming thread, you create channels for different parts of your life. "Garden Updates." "Kids' Milestones." "Travel Adventures." Whatever matters to you.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              Your family chooses what they want to follow. Your mom can subscribe to garden updates and skip the tech talk. Your sister can follow the kids but not the politics. Everyone gets agency over their experience.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              No algorithms deciding what you see. No ads. No strangers. Just the people you love, sharing what matters, organized the way it should have been all along.
            </p>
          </div>
        </section>

        {/* Section 3: The 180-Day Rule */}
        <section className='space-y-6'>
          <h2 className='text-3xl md:text-4xl font-bold'>The 180-Day Rule</h2>
          <div className='space-y-4'>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              Here's the thing about memories: we don't actually remember everything, and that's okay. Recent moments feel vivid and important. Older details naturally fade. That's how human memory works.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              But digital platforms don't work that way. They keep everything forever, building a permanent archive that becomes overwhelming to maintain and exhausting to curate. You can't share freely when you're worried about building a perfect highlight reel that will exist for eternity.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              So Angelia does something different: updates automatically fade after 180 days (six months). Recent moments stay vivid. Older details gracefully disappear. It mirrors how we actually remember life.
            </p>
            <p className='text-lg text-foreground/80 leading-relaxed'>
              This isn't about losing precious memories—it's about removing the burden of the archive. Share the sunset. Post the messy kitchen. Share the small joys without worrying about permanence. Connection over performance. Presence over pressure.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className='space-y-8'>
          <h2 className='text-3xl md:text-4xl font-bold text-center'>What Makes Angelia Different</h2>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b-2 border-foreground/20'>
                  <th className='text-left py-4 px-4 font-semibold text-foreground'></th>
                  <th className='text-center py-4 px-4 font-semibold text-foreground'>Traditional Social Media</th>
                  <th className='text-center py-4 px-4 font-bold text-accent'>Angelia</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-foreground/10'>
                  <td className='py-4 px-4 font-semibold text-foreground'>Privacy</td>
                  <td className='text-center py-4 px-4 text-foreground/70'>Public by default, shared with strangers and advertisers</td>
                  <td className='text-center py-4 px-4 text-foreground/70'>Private by design—just you and your chosen family</td>
                </tr>
                <tr className='border-b border-foreground/10'>
                  <td className='py-4 px-4 font-semibold text-foreground'>Intentionality</td>
                  <td className='text-center py-4 px-4 text-foreground/70'>Algorithmic feeds optimized for engagement and ad revenue</td>
                  <td className='text-center py-4 px-4 text-foreground/70'>You choose what to share and what to follow—no algorithms</td>
                </tr>
                <tr className='border-b border-foreground/10'>
                  <td className='py-4 px-4 font-semibold text-foreground'>Ephemerality</td>
                  <td className='text-center py-4 px-4 text-foreground/70'>Permanent archives that require constant curation</td>
                  <td className='text-center py-4 px-4 text-foreground/70'>Updates fade after 180 days—share freely without pressure</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className='text-sm text-center text-foreground/60 italic'>
            Connection governed by logic, not algorithms.
          </p>
        </section>

        {/* Footer CTA */}
        <section className='text-center space-y-6 pt-8 border-t border-foreground/10'>
          <p className='text-lg text-foreground/70'>
            Ready to reclaim meaningful connection?
          </p>
          <Button
            href='/'
            variant='secondary'
            size='lg'
          >
            ← Back to Home
          </Button>
        </section>
      </div>
    </div>
  );
}

export default About;

