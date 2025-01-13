import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "./Authenticator";


export default function NavBar(props) {

  const useAuth=useContext(AuthContext);
  const isAuthenticated=useAuth.isAuthenticated;
  const [content, setContent] = useState("");
  const modifyContent = (ev) => {
    const newValue = ev.target.value;
    setContent(newValue);
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    props.getSearchResults(content);
    setContent("");
  }

  return (
    <>
      {/* <nav className="bg-black flex justify-between items-center p-2 text-white">
        <div className="flex gap-12">
          <NavLink to="/" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">Home</NavLink>
          <NavLink to="/watchlist" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">Watchlist</NavLink>
          <NavLink to="/completed_watchlist" className="hover:bg-[#ff8800] rounded-lg hover:shadow-md p-2 font-bold text-1xl">Completed</NavLink>
        </div>

        <div className="flex gap-14 items-center">
        <form className="SearchForm" onSubmit={handleSubmit}>
          <input type="text" value={content} onChange={modifyContent} className="border-4 border-solid border-[#ff8800] rounded-full p-1 m-1 text-black"/>
          <button type="submit" className="bg-[#ff8800] text-bold rounded-full p-1 px-2" >Search</button>
        </form>
        <div>
          {!isAuthenticated && <NavLink to="/login" className="bg-[#ff8800] text-bold rounded-full p-1 px-3">Login</NavLink>}
          {isAuthenticated && <NavLink to="/login" className="bg-[#ff8800] text-bold rounded-full p-1 px-3">Logout</NavLink>}
        </div>
        </div>

        
      </nav> */}
    </>
  );
}