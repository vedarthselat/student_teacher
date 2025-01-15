import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import Teacher from "./Teacher";
import Navbar from "../Navbar";


export default function Home() {
  const [teachers, setTeachers] = useState([]); // Stores all fetched movies
  const [filteredTeachers, setFilteredTeachers] = useState([]); // Stores movies filtered by priority
//   const [priority, setPriority] = useState("None"); // "None" as the default value
const [subject, setSubject] = useState("None");
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL =
    "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers";

  // Function to fetch watchlist movies
  async function getTeachers() {
    try {
      const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allTeachers = data["All teachers"]; // Accessing the specific key in the response
      setTeachers(allTeachers);
      setFilteredTeachers(allTeachers); // Initially show all movies when "None" is selected
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }

  // Handle dropdown change to filter movies by priority
  function handleSubjectChange(e) {
    const selectedSubject = e.target.value;
    setSubject(selectedSubject);

    if (selectedSubject === "None") {
      setFilteredTeachers(teachers); // Show all movies
    } else {
      setFilteredTeachers(teachers.filter((teacher) => teacher.subject === (selectedSubject)));
    }
  }


  function getSearchResults(nameEntered) {
    let SearchURL='';
    if(subject==="None"){
      SearchURL = `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers?name=${encodeURIComponent(nameEntered)}`;
    }
    else
    {
    SearchURL = `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers?name=${encodeURIComponent(nameEntered)}&subject=${subject}`;
    }
    const getSearchTeachers = async () => {
      try {
        const response = await fetch(SearchURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allTeachers = data["teachers"]; 
        setTeachers(allTeachers);
        setFilteredTeachers(allTeachers);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getSearchTeachers();
  }

  // Handle movie click
//   function handleClick(teacherID) {
//     navigate(`/watchlist/${movieID}`);
//   }

  // Function to remove movie from state
//   function handleRemoveFromState(movieID) {
//     setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieID));
//     setFilteredMovies((prevFiltered) => prevFiltered.filter((movie) => movie.id !== movieID));
//   }

  useEffect(() => {
    getTeachers();
  }, []);

  useEffect(() => {
    // Filter movies whenever movies or priority changes
    if (subject === "None") {
      setFilteredTeachers(teachers);
    } else {
      setFilteredTeachers(teachers.filter((teacher) => teacher.subject ===subject));
    }
  }, [subject, teachers]);

  return (
    <>
      <header>
      <Navbar 
  getSearchTeachers={getSearchResults}
/>
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">All Available Teachers</h1>
        <div className="text-center my-4">
          <label htmlFor="priority-select" className="font-bold mr-2">
            Filter by :
          </label>
          <select
  id="subject-select"
  value={subject}
  onChange={handleSubjectChange}
  className="border p-2 rounded">
  <option value="None">None</option>
  <option value="physics">Physics</option>
  <option value="chemistry">Chemistry</option>
  <option value="mathematics">Mathematics</option>
  <option value="biology">Biology</option>
  <option value="computer science">Computer Science</option>
</select>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
  {filteredTeachers.map((teacher) => (
    <div
      key={teacher.teacherID}
      className="bg-gray-200 rounded-lg shadow p-4 flex flex-col justify-between"
      style={{ minHeight: "300px" }} // Set the height directly here
    >
      <Teacher teacher={teacher} />
    </div>
  ))}
</div>

      </main>
    </>
  );
}
