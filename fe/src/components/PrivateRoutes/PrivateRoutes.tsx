import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../helpers/cookie';

function PrivateRoutes() {
  const token = getCookie('token');

  return <>{token ? <Outlet /> : <Navigate to="/auth/login" />}</>;
}

export default PrivateRoutes;
