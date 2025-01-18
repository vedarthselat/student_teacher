import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import NavbarTeacher from "../NavbarTeacher";

export default function ResolvedAppointments() {
  const [appointments, setAppointments] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/approvedTeachers";

  // Function to fetch appointments
  async function getResolvedAppointments() {
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
      const appointmentsData = data["Teacher's Appointments"]; // Accessing the specific key in the response
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  }

  // Function to handle "Mark As Completed" button click
  async function handleMarkAsCompleted(appointmentID) {
    try {
      const response = await fetch(`https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/approvedTeachers/${appointmentID}`, {
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
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.approvedID !== appointmentID)
      );
    } catch (error) {
      console.error("Error marking appointment as completed", error);
    }
  }

  useEffect(() => {
    getResolvedAppointments();
  }, []);

  return (
    <>
      <header>
        <NavbarTeacher />
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">Resolved Appointments</h1>

        {/* Conditional Rendering for No Resolved Appointments */}
        {appointments.length === 0 ? (
          <div className="text-center text-xl text-gray-700 font-semibold mt-10">
            <p>No appointments have been resolved yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.approvedID}
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
                  <>
                    <p className="text-sm text-green-600 font-bold">Status: Accepted</p>
                    {/* Mark As Completed Button */}
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors"
                      onClick={() => handleMarkAsCompleted(appointment.approvedID)}
                    >
                      Mark As Completed
                    </button>
                  </>
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
