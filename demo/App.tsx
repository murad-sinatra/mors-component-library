import { useEffect, useState } from 'react';
import {
  Badge,
  Icon,
  IconButton,
  Navbar,
  NavbarLink,
  ToastProvider,
  Tooltip,
} from '../src';
import { useTheme } from './useTheme';
import { Overview } from './pages/Overview';
import { Components } from './pages/Components';
import { DesignSystem } from './pages/DesignSystem';

const ROUTES = [
  { id: 'overview', label: 'Overview' },
  { id: 'components', label: 'Components' },
  { id: 'design-system', label: 'Design system' },
] as const;

type RouteId = (typeof ROUTES)[number]['id'];

function currentRoute(): RouteId {
  const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0] ?? '';
  return ROUTES.some((route) => route.id === hash) ? (hash as RouteId) : 'overview';
}

/** Hash routing keeps the demo dependency-free and deep-linkable. */
function useHashRoute(): [RouteId, (route: RouteId) => void] {
  const [route, setRoute] = useState<RouteId>(currentRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return [route, (next: RouteId) => { window.location.hash = `#/${next}`; }];
}

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, navigate] = useHashRoute();

  useEffect(() => {
    const titles: Record<RouteId, string> = {
      overview: 'Overview',
      components: 'Components',
      'design-system': 'Design system',
    };
    document.title = `${titles[route]} · mors-component-library`;
  }, [route]);

  return (
    <ToastProvider position="bottom-right">
      <div className="demo-app mors-scope">
        <a className="demo-skip-link" href="#demo-main">
          Skip to content
        </a>

        <Navbar
          brand={
            <span className="demo-brand">
              <span className="demo-brand-mark" aria-hidden="true">
                m
              </span>
              <span>mors</span>
              <Badge size="sm" tone="neutral">
                v0.1.0
              </Badge>
            </span>
          }
          actions={
            <Tooltip content={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
              <IconButton
                label={theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
                icon={<Icon name={theme === 'dark' ? 'sun' : 'moon'} />}
                variant="ghost"
                onClick={toggleTheme}
              />
            </Tooltip>
          }
        >
          {ROUTES.map((entry) => (
            <NavbarLink
              key={entry.id}
              href={`#/${entry.id}`}
              active={route === entry.id}
              onClick={() => navigate(entry.id)}
            >
              {entry.label}
            </NavbarLink>
          ))}
        </Navbar>

        <main className="demo-main" id="demo-main">
          {route === 'overview' && <Overview onNavigate={navigate} />}
          {route === 'components' && <Components />}
          {route === 'design-system' && <DesignSystem />}
        </main>

        <footer className="demo-footer">
          <div className="demo-footer-inner">
            <span>
              mors-component-library — an independent project. Apple-inspired in spirit; not
              affiliated with or endorsed by Apple Inc.
            </span>
            <span>MIT licensed</span>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
