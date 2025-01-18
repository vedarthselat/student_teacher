


import Error from "./Error";
import App from "./App";
import { useContext } from "react";
import { AuthContext } from "../Authenticator";
import { Navigate } from "react-router-dom";
import Home from "./Home";
import TeacherDetails from "./TeacherDetails";
import RequestedAppointments from "./RequestedAppointments";
import ConsideredAppointments from "./ConsideredAppointments";
import CompletedAppointments from "./CompletedAppointments";
import LoginTeacher from "./LoginTeacher";
import HomeTeacher from "./HomeTeacher";
import ResolvedAppointments from "./ResolvedAppointments";
import CompletedAppointmentTeachers from "./CompletedAppointmentTeachers";
import LoginAdmin from "./LoginAdmin";



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
    path: "/loginTeacher",
    element: <LoginTeacher />,
  },
  {
    path: "/homeTeacher",
    element: <AuthenticateRoute element={<HomeTeacher />} />,
  },
  {
    path: "/resolvedAppointments",
    element: <AuthenticateRoute element={<ResolvedAppointments />} />,
  },
  {
    path: "/completedAppointmentTeachers",
    element: <AuthenticateRoute element={<CompletedAppointmentTeachers />} />,
  },
  {
    path: "/loginAdmin",
    element: <LoginAdmin />,
  },
  {
      path: "/teacherDetails/:id",
      element: <AuthenticateRoute element={<TeacherDetails />} />,
    },
  {
      path: "/requestedAppointments",
      element: <AuthenticateRoute element={<RequestedAppointments />} />,
    },
    {
      path: "/consideredAppointments",
      element: <AuthenticateRoute element={<ConsideredAppointments />} />,
    },
    {
      path: "/completedAppointments",
      element: <AuthenticateRoute element={<CompletedAppointments />} />,
    },
];

export default routes;
