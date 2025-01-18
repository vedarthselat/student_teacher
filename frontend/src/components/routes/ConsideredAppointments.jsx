import { useEffect, useState, useContext } from "react"; // Add the missing imports
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import Navbar from "../Navbar";

export default function ConsideredAppointments() {
  const [appointments, setAppointments] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/approved";

  // Function to fetch appointments
  async function getConsideredAppointments() {
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
      const appointmentsData = data["Student's Appointments"]; // Accessing the specific key in the response
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  }

  // Function to search for appointments by name
  function getSearchResults(nameEntered) {
    let SearchURL = `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/approved?name=${encodeURIComponent(nameEntered)}`;
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
        const allAppointments = data["appointments"];
        setAppointments(allAppointments);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getSearchTeachers();
  }

  useEffect(() => {
    getConsideredAppointments();
  }, []);

  return (
    <>
      <header>
        <Navbar getSearchTeachers={getSearchResults} />
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">Considered Appointments</h1>
        
        {/* Conditional Rendering for No Appointments */}
        {appointments.length === 0 ? (
          <div className="text-center text-xl text-gray-700 font-semibold mt-10">
            <p>No appointments have been considered.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointmentID}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between items-center border hover:shadow-lg transition-transform transform hover:-translate-y-1"
                style={{ minHeight: "350px" }}
              >
                {/* Teacher Image */}
                <img
                  src={`data:image/jpeg;base64,${appointment.image}`}
                  alt={`${appointment.name}'s image`}
                  className="rounded-full w-24 h-24 mb-4 object-cover border"
                />

                {/* Appointment Details */}
                <h2 className="text-lg font-semibold mb-2">{appointment.name}</h2>
                <p className="text-sm text-gray-700">Date: {appointment.date}</p>
                <p className="text-sm text-gray-700">Time: {appointment.time.slice(0, 8)} {appointment.abb}</p>
                <p className="text-sm text-gray-700">Year: {appointment.year}</p>

                {/* Approval Status */}
                {appointment.approve === 1 ? (
                  <p className="text-sm text-green-600 font-bold">Status: Accepted</p>
                ) : (
                  <p className="text-sm text-red-600 font-bold">Status: Rejected</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
