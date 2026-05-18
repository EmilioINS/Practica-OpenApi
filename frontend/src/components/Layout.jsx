import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UsersRound, 
  Presentation, 
  ClipboardCheck,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Close sidebar automatically on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/' },
    { icon: <BookOpen size={22} />, label: 'Materias', path: '/materias' },
    { icon: <Users size={22} />, label: 'Alumnos', path: '/alumnos' },
    { icon: <UsersRound size={22} />, label: 'Grupos', path: '/grupos' },
    { icon: <Presentation size={22} />, label: 'Exposiciones', path: '/exposiciones' },
    { icon: <ClipboardCheck size={22} />, label: 'Evaluaciones', path: '/evaluaciones' },
  ];

  const activeTitle = menuItems.find(m => m.path === location.pathname)?.label || 'Sistema';

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`sidebar glass ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">E</div>
            <span>Exposys</span>
          </div>
          <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">Menu Principal</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
              {location.pathname === item.path && isSidebarOpen && <ChevronRight size={16} className="active-arrow" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="page-title">
              <h2>{activeTitle}</h2>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        
        <div className="page-content animate-fade">
          <Outlet />
        </div>
      </main>

      <style>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background: var(--bg-dark);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 90;
          backdrop-filter: blur(4px);
        }

        .sidebar {
          width: 280px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          border-radius: 0 32px 32px 0;
          border-left: none;
          z-index: 100;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .sidebar.closed {
          width: 100px;
        }

        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            left: -280px;
          }
          .sidebar.open {
            left: 0;
            width: 280px;
          }
        }

        .sidebar-header {
          padding: 40px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 1.6rem;
          color: var(--text-main);
        }

        .brand-icon {
          min-width: 44px;
          height: 44px;
          background: var(--primary);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 15px var(--primary-glow);
          font-size: 1.2rem;
        }

        .nav-section-title {
          padding: 0 32px;
          margin-bottom: 16px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-weight: 700;
        }

        .sidebar.closed .nav-section-title {
          opacity: 0;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: 16px;
          transition: var(--transition);
          position: relative;
          white-space: nowrap;
        }

        .nav-item:hover {
          background: rgba(17, 117, 51, 0.05);
          color: var(--primary);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(90deg, rgba(17, 117, 51, 0.1) 0%, rgba(17, 117, 51, 0) 100%);
          color: var(--primary);
          font-weight: 600;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: var(--primary);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .nav-label {
          transition: opacity 0.3s;
          font-size: 1rem;
        }

        .sidebar.closed .nav-label,
        .sidebar.closed .brand span {
          opacity: 0;
          pointer-events: none;
        }

        .sidebar-footer {
          padding: 32px 24px;
          border-top: 1px solid var(--border-color);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          border-radius: 16px;
          transition: var(--transition);
          font-weight: 600;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 40px 48px;
          max-width: 100%;
          transition: padding 0.3s;
        }

        @media (max-width: 1024px) {
          .content { padding: 32px; }
        }

        @media (max-width: 768px) {
          .content { padding: 20px; }
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          padding: 20px 0;
          position: sticky;
          top: 0;
          z-index: 80;
          border-bottom: 1px solid var(--border-color);
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .menu-toggle {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          padding: 10px;
          border-radius: 12px;
          transition: var(--transition);
        }

        .menu-toggle:hover {
          color: var(--primary);
          border-color: var(--primary);
        }

        .page-title h2 {
          font-size: 1.8rem;
          margin: 0;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .user-name {
          font-weight: 700;
          font-size: 1rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--secondary);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Layout;
