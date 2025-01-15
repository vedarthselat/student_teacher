import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";
import Navbar from "../Navbar";

export default function ConsideredAppointments() {
  const [appointments, setAppointments] = useState([]); // Stores all fetched appointments
  const useAuth = useContext(AuthContext);
  const APIKey = useAuth.APIKey;
  const navigate = useNavigate();
  const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/appointments";

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
      const appointmentsData = data["Student's Appointments"]; // Accessing the specific key in the response
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  }

  // Function to cancel an appointment
  async function cancelAppointment(appointID) {
    try {
      const response = await fetch(`${BASE_URL}/entries/${appointID}`, {
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
        <Navbar />
      </header>
      <main>
        <h1 className="text-3xl font-bold text-center my-4">Requested Appointments</h1>
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
              <p className="text-sm text-gray-700">Time: {appointment.time} {appointment.abb}</p>
              <p className="text-sm text-gray-700">Year: {appointment.year}</p>
              <p className="text-sm text-blue-600 font-medium">Status: Requested</p>

              {/* Cancel Appointment Button */}
              <button
                onClick={() => cancelAppointment(appointment.appointID)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Cancel Appointment
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
