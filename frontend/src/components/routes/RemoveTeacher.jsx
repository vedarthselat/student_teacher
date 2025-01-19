import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import NavbarAdmin from "../NavbarAdmin";

export default function RemoveTeacher() {
  const [teachers, setTeachers] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers";

  // Function to fetch appointments
  async function getTeachers() {
    try {
      const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          "X-API-KEY": APIKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const teachersData = data["All teachers"]; // Accessing the specific key in the response
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error fetching teachers", error);
    }
  }

  // Function to cancel an appointment
  async function removeTeacher(teacherID) {
    try {
      const response = await fetch(`https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers/entries/${teacherID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
          "X-API-KEY": APIKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the appointment from the state after successful deletion
      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.teacherID !== teacherID)
      );
    } catch (error) {
      console.error("Error removing teacher", error);
    }
  }

  useEffect(() => {
    getTeachers();
  }, []);

  function getSearchResults(nameEntered) {
    let SearchURL = `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers?name=${encodeURIComponent(nameEntered)}`;
    const getSearchTeachers = async () => {
      try {
        const response = await fetch(SearchURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": APIKey,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allTeachers = data["teachers"];
        setTeachers(allTeachers);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getSearchTeachers();
  }

  return (
    <>
      <header>
        <NavbarAdmin search="yes" getSearchTeachers={getSearchResults} />
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">Remove Teachers</h1>
        {teachers.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-xl font-semibold text-gray-700">
              No teachers have been added
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.teacherID}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between items-center border hover:shadow-lg transition-transform transform hover:-translate-y-1"
                style={{ minHeight: "350px" }}
              >
                {/* Teacher Image */}
                <img
                  src={`data:image/jpeg;base64,${teacher.image}`}
                  alt={`${teacher.name}'s image`}
                  className="rounded-full w-24 h-24 mb-4 object-cover border"
                />

                {/* Appointment Details */}
                <h2 className="text-lg font-semibold mb-2">{teacher.name}</h2>
                <p className="text-sm text-gray-700">
                  Email: {teacher.email}
                </p>
                <p className="text-sm text-gray-700">
                  Subject: {teacher.subject}
                </p>
        
                {/* Cancel Appointment Button */}
                <button
                  onClick={() => removeTeacher(teacher.teacherID)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Remove Teacher
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
