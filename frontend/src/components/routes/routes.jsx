


import Error from "./Error";
import App from "./App";
import { useContext } from "react";
import { AuthContext } from "../Authenticator";
import { Navigate } from "react-router-dom";
import Home from "./Home";
import TeacherDetails from "./TeacherDetails";
import RequestedAppointments from "./RequestedAppointments";




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
  },
  {
      path: "/teacherDetails/:id",
      element: <AuthenticateRoute element={<TeacherDetails />} />,
    },
  {
      path: "/requestedAppointments",
      element: <AuthenticateRoute element={<RequestedAppointments />} />,
    },
];

export default routes;
