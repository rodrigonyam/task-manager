import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation, { NavigationToggle } from './Navigation';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useAuth();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <Navigation isOpen={isNavOpen} onToggle={closeNav} />
      
      <div className="layout-main">
        <header className="layout-header">
          <NavigationToggle onToggle={toggleNav} />
          <div className="header-content">
            {/* Additional header content can go here */}
          </div>
        </header>
        
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;