


import Error from "./Error";
import App from "./App";
import { useContext } from "react";
import { AuthContext } from "../Authenticator";
import { Navigate } from "react-router-dom";





function AuthenticateRoute({ element }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/login" />;
}

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <App />,
    errorElement: <Error/>
  }
];

export default routes;
