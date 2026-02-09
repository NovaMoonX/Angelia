import { Outlet } from 'react-router-dom';
import { DemoModeBanner } from '@components/DemoModeBanner';
import { useAppSelector } from '@store/hooks';

function Layout() {
  const isDemoActive = useAppSelector((state) => state.demo.isActive);

  return (
    <>
      {isDemoActive && <DemoModeBanner />}
      <div className='page transition-colors duration-200' style={isDemoActive ? { paddingTop: '52px' } : {}}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
