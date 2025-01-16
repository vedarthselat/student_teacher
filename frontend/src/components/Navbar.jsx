import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "./Authenticator";

export default function Navbar({ getSearchTeachers }) {
  const useAuth = useContext(AuthContext);
  const isAuthenticated = useAuth.isAuthenticated;
  const [content, setContent] = useState("");

  const modifyContent = (ev) => {
    const newValue = ev.target.value;
    setContent(newValue);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    getSearchTeachers(content);
    setContent("");
  };

  return (
    <>
      <nav className="bg-black flex justify-between items-center p-2 text-white">
        <div className="flex gap-12">
          <NavLink to="/" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Home
          </NavLink>
          <NavLink to="/requestedAppointments" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Requested Appointments
          </NavLink>
          <NavLink to="/consideredAppointments" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Considered Appointments
          </NavLink>
          <NavLink to="/completedAppointments" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">
            Completed Appointments
          </NavLink>
        </div>

        <div className="flex gap-14 items-center">
          <form className="SearchForm" onSubmit={handleSubmit}>
            <label htmlFor="search-input" className="sr-only">Search</label> {/* Screen reader accessible label */}
            <input
              id="search-input" // Unique id added for accessibility
              type="text"
              value={content}
              onChange={modifyContent}
              className="border-4 border-solid border-[#ff8800] rounded-full p-1 m-1 text-black"
              placeholder="Search"
            />
            <button type="submit" className="bg-[#ff8800] text-bold rounded-full p-1 px-2">
              Search
            </button>
          </form>
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
