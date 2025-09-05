import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/login';
import SignUp from './pages/signup';
import { Home } from './pages/home';
import { JSX } from 'react/jsx-runtime';
import { useMemo } from 'react';
import { Admin } from './pages/admin';

export default function App() {
  // opened = state, toggle = function
  const [opened, { toggle }] = useDisclosure();
  const access_token = useAuthStore((state) => state.access_token);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const routes = useMemo(() => {
    if (access_token) {
      const baseRoutes = [{ id: 1, route: '/home', heading: 'Home' }];
      if (isAdmin)
        baseRoutes.push({ id: 2, route: '/admin', heading: 'Admin' });
      baseRoutes.push({ id: 3, route: '/logout', heading: 'Logout' });
      return baseRoutes;
    } else {
      return [
        { id: 4, route: '/login', heading: 'Login' },
        { id: 5, route: '/signup', heading: 'Signup' },
      ];
    }
  }, [access_token, isAdmin]);
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return access_token ? children : <Navigate to="/login" />;
  };
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      styles={{
        navbar: {
          padding: 0,
          margin: 0,
        },
      }}
    >
      {/* HEADER */}
      <AppShell.Header>
        <div className="h-full flex items-center justify-start text-black bg-amber-50 dark:text-amber-200 dark:bg-indigo-950 font-cinzel">
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <h1 className="text-2xl font-semibold">Favorite Movies</h1>
          </Group>
        </div>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar>
        <div className="h-full w-full text-black dark:text-amber-200 font-cinzel bg-amber-50 dark:bg-indigo-950 p-4">
          <ul className="p-[0.25em] px-[2.5%] list-none flex flex-col flex-nowrap">
            {routes.map((route) => (
              <li
                key={route.id}
                className="p-2 flex items-center justify-start hover:bg-amber-100 dark:hover:bg-indigo-900 rounded-md"
              >
                {route.route === '/logout' ? (
                  <button
                    onClick={() => {
                      clearAuth(); // clear Zustand store
                      navigate('/login'); // redirect to login
                      toggle();
                    }}
                    className="pl-4 w-full text-left"
                  >
                    {route.heading}
                  </button>
                ) : (
                  <Link
                    to={route.route}
                    className="pl-4 w-full"
                    onClick={() => {
                      if (window.innerWidth < 768) toggle();
                    }}
                  >
                    {route.heading}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </AppShell.Navbar>

      {/* MAIN CONTENT */}
      <AppShell.Main>
        <div
          id={access_token ? 'mainContent' : 'loginSign'}
          className="font-inter bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8"
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
