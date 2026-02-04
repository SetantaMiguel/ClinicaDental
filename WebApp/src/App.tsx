import { routes } from './routes/routesConfig';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './components/auth/Login';
import {AuthProvider} from './components/Context/AuthContext';


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <Login  />
          } />

          <Route element={<Layout />}>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.isPrivate ? (
                    <ProtectedRoute >
                      <route.element  />
                    </ProtectedRoute>
                  ) : (
                    <route.element />
                  )
                }
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;