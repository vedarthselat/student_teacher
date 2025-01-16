import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import Navbar from "../Navbar";

export default function CompletedAppointments() {
  const [completedAppointments, setCompletedAppointments] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/completed";

  // Function to fetch appointments
  async function getCompletedAppointments() {
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
      const appointmentsData = data["Student's Completed Appointments"]; // Accessing the specific key in the response
      setCompletedAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  }

  // Function to search for appointments by name
  function getSearchResults(nameEntered) {
    let SearchURL = `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/completed?name=${encodeURIComponent(nameEntered)}`;
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
        const allAppointments = data["Student's Completed Appointments"];
        setCompletedAppointments(allAppointments);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getSearchTeachers();
  }

  useEffect(() => {
    getCompletedAppointments();
  }, []);

  return (
    <>
      <header>
        <Navbar getSearchTeachers={getSearchResults} />
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">Completed Appointments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {completedAppointments.map((completedAppointment) => (
            <div
              key={completedAppointment.completedID}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between items-center border hover:shadow-lg transition-transform transform hover:-translate-y-1"
              style={{ minHeight: "350px" }}
            >
              {/* Teacher Image */}
              <img
                src={`data:image/jpeg;base64,${completedAppointment.image}`}
                alt={`${completedAppointment.name}'s image`}
                className="rounded-full w-24 h-24 mb-4 object-cover border"
              />

              {/* Appointment Details */}
              <h2 className="text-lg font-semibold mb-2">{completedAppointment.name}</h2>
              <p className="text-sm text-gray-700">Date: {completedAppointment.date}</p>
              <p className="text-sm text-gray-700">Time: {completedAppointment.time.slice(0, 8)} {completedAppointment.abb}</p>
              <p className="text-sm text-gray-700">Year: {completedAppointment.year}</p>

              {/* Approval Status */}
             
                <p className="text-sm text-green-600 font-bold">Status: Completed</p>

            </div>
          ))}
        </div>
      </main>
    </>
  );
}
