import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        {/* Routes publiques (pas de protection) */}
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Tailwind CSS & React" />
              <SignIn />
            </>
          }
        />
        
        {/* Routes protégées */}
        <Route
          path="/*"
          element={
            <AuthRedirect>
              <DefaultLayout>
                <Routes>
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <>
                          <PageTitle title=" Dashboard | Tailwind CSS & React" />
                          <ECommerce />
                        </>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <>
                        <PageTitle title="Calendar | Tailwind CSS & React" />
                        <Calendar />
                      </>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <>
                          <PageTitle title="Profile | Tailwind CSS & React" />
                          <Profile />
                        </>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/forms/form-elements"
                    element={
                      <>
                        <PageTitle title="Form Elements | Tailwind CSS & React" />
                        <FormElements />
                      </>
                    }
                  />
                  <Route
                    path="/forms/form-layout"
                    element={
                      <>
                        <PageTitle title="Form Layout | Tailwind CSS & React" />
                        <FormLayout />
                      </>
                    }
                  />
                  <Route
                    path="/tables"
                    element={
                      <ProtectedRoute>
                        <>
                          <PageTitle title="Tables | Tailwind CSS & React" />
                          <Tables />
                        </>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <>
                          <PageTitle title="Settings | Tailwind CSS & React" />
                          <Settings />
                        </>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chart"
                    element={
                      <>
                        <PageTitle title="Basic Chart | Tailwind CSS & React" />
                        <Chart />
                      </>
                    }
                  />
                  <Route
                    path="/ui/alerts"
                    element={
                      <>
                        <PageTitle title="Alerts | Tailwind CSS & React" />
                        <Alerts />
                      </>
                    }
                  />
                  <Route
                    path="/ui/buttons"
                    element={
                      <>
                        <PageTitle title="Buttons | Tailwind CSS & React" />
                        <Buttons />
                      </>
                    }
                  />
                </Routes>
              </DefaultLayout>
            </AuthRedirect>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
