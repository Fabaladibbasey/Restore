import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { toast } from "react-toastify";

interface Props {
  roles?: string[];
}

function RouterAuth({ roles }: Props) {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    toast.error("You are not authorized to access this area");
    return <Navigate to="/catalog" />;
  }

  return <Outlet />;
}
export default RouterAuth;
