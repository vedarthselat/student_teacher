import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import NavbarAdmin from "../NavbarAdmin";

export default function RemoveStudent() {
  const [students, setStudents] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/students";

  // Function to fetch appointments
  async function getStudents() {
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
      const studentsData = data["All students"]; // Accessing the specific key in the response
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  }

  // Function to cancel an appointment
  async function removeStudent(studentID) {
    try {
      const response = await fetch(`https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/students/entries/${studentID}`, {
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
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.studentID !== studentID)
      );
    } catch (error) {
      console.error("Error cancelling appointment", error);
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  function getSearchResults(nameEntered) {
    let SearchURL = `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/students?name=${encodeURIComponent(nameEntered)}`;
    const getSearchStudents = async () => {
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
        const allStudents = data["students"];
        setStudents(allStudents);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getSearchStudents();
  }

  return (
    <>
      <header>
        <NavbarAdmin search="yes" getSearchTeachers={getSearchResults} />
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">Remove Students</h1>
        {students.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-xl font-semibold text-gray-700">
              No students have been added
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {students.map((student) => (
              <div
                key={student.studentID}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between items-center border hover:shadow-lg transition-transform transform hover:-translate-y-1"
                style={{ minHeight: "350px" }}
              >
                {/* Teacher Image */}
                <img
                  src={`data:image/jpeg;base64,${student.image}`}
                  alt={`${student.name}'s image`}
                  className="rounded-full w-24 h-24 mb-4 object-cover border"
                />

                {/* Appointment Details */}
                <h2 className="text-lg font-semibold mb-2">{student.name}</h2>
                <p className="text-sm text-gray-700">
                  Email: {student.email}
                </p>
        
                {/* Cancel Appointment Button */}
                <button
                  onClick={() => removeStudent(student.studentID)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Remove Student
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
