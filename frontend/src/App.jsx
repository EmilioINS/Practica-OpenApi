import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materias from './pages/Materias';
import Alumnos from './pages/Alumnos';
import Grupos from './pages/Grupos';
import Exposiciones from './pages/Exposiciones';
import Evaluaciones from './pages/Evaluaciones';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="materias" element={<Materias />} />
            <Route path="alumnos" element={<Alumnos />} />
            <Route path="grupos" element={<Grupos />} />
            <Route path="exposiciones" element={<Exposiciones />} />
            <Route path="evaluaciones" element={<Evaluaciones />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
