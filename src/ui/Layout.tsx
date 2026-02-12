import { Outlet } from 'react-router-dom';
import { DemoModeBanner } from '@components/DemoModeBanner';
import { useAppSelector } from '@store/hooks';
import { ThemeToggle } from '@/components/ThemeToggle';

const DEMO_BANNER_HEIGHT = '52px';

function Layout() {
  const isDemoActive = useAppSelector((state) => state.demo.isActive);

  return (
    <>
      {isDemoActive && <DemoModeBanner />}
      <div
        className='page relative transition-colors duration-200'
        style={isDemoActive ? { paddingTop: DEMO_BANNER_HEIGHT } : {}}
      >
        <ThemeToggle className='translate-y-4 translate-x-2 hidden sm:flex' />
        <Outlet />
        <ThemeToggle className='fixed bottom-3 left-3 sm:hidden' />
      </div>
    </>
  );
}

export default Layout;
