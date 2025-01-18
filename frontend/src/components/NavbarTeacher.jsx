import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "./Authenticator";

export default function NavbarTeacher() {
  const useAuth = useContext(AuthContext);
  const isAuthenticated = useAuth.isAuthenticated;

  

  

  return (
    <>
      <nav className="bg-black flex justify-between items-center p-2 text-white">
        <div className="flex gap-12">
          <NavLink to="/homeTeacher" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Home
          </NavLink>
          <NavLink to="/resolvedAppointments" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Resolved Appointments
          </NavLink>
          <NavLink to="/completedAppointmentTeachers" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Completed Appointments
          </NavLink>
        </div>

        <div className="flex gap-14 items-center">
          <div>
            {!isAuthenticated && (
              <NavLink to="/login" className="bg-[#ff8800] text-bold rounded-full p-1 px-3">
                Login
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/login" className="bg-[#ff8800] text-bold rounded-full p-1 px-3">
                Logout
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
