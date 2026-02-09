import { Outlet } from 'react-router-dom';
import { DemoModeBanner } from '@components/DemoModeBanner';
import { useAppSelector } from '@store/hooks';

const DEMO_BANNER_HEIGHT = '52px';

function Layout() {
  const isDemoActive = useAppSelector((state) => state.demo.isActive);

  return (
    <>
      {isDemoActive && <DemoModeBanner />}
      <div className='page transition-colors duration-200' style={isDemoActive ? { paddingTop: DEMO_BANNER_HEIGHT } : {}}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
