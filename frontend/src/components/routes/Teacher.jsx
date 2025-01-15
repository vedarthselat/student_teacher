import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";

function Teacher({ teacher}) {
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();

  const [click, setClick] = useState({ clicked: false, alreadyExists: false, alreadyWatched: false });

  async function handleClick(ev) {
    if(!APIKey)
    {
      navigate("/login");
    }
    
    navigate(`/teacherDetails/${teacher.teacherID}`);
    
  }

//   async function handleRemove(ev) {
//     ev.stopPropagation(); // To prevent the MovieDetails from opening

//     try {
//       const response = await fetch(
//         `https://loki.trentu.ca/~vedarthselat/3430/assn/assn2-arpanarora227/api/towatchlist/entries/${movie.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "X-API-KEY": APIKey,
//           },
//         }
//       );

//       const data = await response.json();
//       console.log(data);
//       if (data.Success) {
//         onRemove(movie.id); // Update state immediately
//       } else {
//         alert("Failed to remove movie!");
//       }
//     } catch (error) {
//       console.error("Failed to remove from watchlist", error);
//     }
//   }

//   function handleMarkAsWatched(ev) {
//     ev.stopPropagation(); // To prevent the MovieDetails from opening
//     navigate(`/completedwatchlist/${movie.id}`);
//   }

return (
    <div className="flex flex-col items-center text-center" onClick={handleClick}>
      {teacher.image && (
        <img
          src={`data:image/jpeg;base64,${teacher.image}`}
          alt={teacher.name}
          className="w-full h-50 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-lg font-bold">{teacher.name}</h2>
      <p className="text-sm italic">{teacher.subject}</p>
      {teacher.email && (
        <p className="text-sm">
          <strong>Email:</strong> {teacher.email}
        </p>
      )}
    </div>
  );
}

export default Teacher;
