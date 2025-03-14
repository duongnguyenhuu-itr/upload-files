import AuthenticationGate from '@/components/authenticationGate';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '@/pages/home';

const ProtectedRoutes = () => {
  return (
    <AuthenticationGate>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    </AuthenticationGate>
  );
};

export default ProtectedRoutes;
