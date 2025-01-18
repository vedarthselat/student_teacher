import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import NavbarTeacher from "../NavbarTeacher";

export default function HomeTeacher() {
  const [appointments, setAppointments] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL =
    "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/appointmentTeachers";

  // Function to fetch appointments
  async function getAppointments() {
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
      const allAppointments = data["Teacher's Appointments"]; // Accessing the specific key in the response
      setAppointments(allAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  async function processAppointment(appointID, decision) {
    try {
      const response = await fetch(`https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/appointmentTeachers/consider/${appointID}/${decision}`, {
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
        prevAppointments.filter((appointment) => appointment.appointID !== appointID)
      );
    } catch (error) {
      console.error("Error cancelling appointment", error);
    }
  }

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <>
      <header>
        <NavbarTeacher />
      </header>
      <main>
        <h1 className="text-4xl font-extrabold text-center my-6 text-gray-800">
          Requested Appointments
        </h1>

        {/* Conditional Rendering for No Appointments */}
        {appointments.length === 0 ? (
          <div className="text-center text-xl text-gray-700 font-semibold mt-10">
            <p>No appointments have been requested yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointID}
                className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-6 flex flex-col justify-between items-center border border-gray-200 hover:shadow-2xl transition-transform transform hover:-translate-y-2"
                style={{ minHeight: "380px" }}
              >
                {/* Teacher Image */}
                <img
                  src={`data:image/jpeg;base64,${appointment.image}`}
                  alt={`${appointment.name}'s image`}
                  className="rounded-full w-28 h-28 mb-4 object-cover border-2 border-blue-500"
                />

                {/* Appointment Details */}
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {appointment.name}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Date:</span> {appointment.date}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Time:</span> {appointment.time.slice(0, 8)} {appointment.abb}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Year:</span> {appointment.year}
                </p>
                <p className="text-sm text-blue-600 font-medium mb-4">
                  Status: Requested
                </p>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => processAppointment(appointment.appointID, 0)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 shadow-md"
                  >
                    Cancel Appointment
                  </button>
                  <button
                    onClick={() => processAppointment(appointment.appointID, 1)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 shadow-md"
                  >
                    Approve Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
