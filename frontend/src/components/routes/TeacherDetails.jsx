import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Authenticator";
import Navbar from "../Navbar";

export default function TeacherDetails() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    year: "",
    date: "",
    time: "",
    abb: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const { APIKey } = useContext(AuthContext);

  useEffect(() => {
    async function getTeacherDetails() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const teacherData = data["Info of teacher"];
        if (!teacherData) {
          throw new Error("Teacher data not found in response");
        }
        setTeacher(teacherData);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getTeacherDetails();
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!formData.year || !/^\d{4}$/.test(formData.year)) {
      newErrors.year = "Year must be a 4-digit number.";
    }

    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      newErrors.date = "Date must be in the format YYYY-MM-DD.";
    }

    if (!formData.time || !/^\d{2}:\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Time must be in the format HH:MM:SS.";
    }

    if (!formData.abb || !/^(AM|PM)$/.test(formData.abb)) {
      newErrors.abb = "Abbreviation must be either AM or PM.";
    }

    return newErrors;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const encodedData = new URLSearchParams();
    encodedData.append("teacherID", id);
    encodedData.append("year", formData.year);
    encodedData.append("date", formData.date);
    encodedData.append("time", formData.time);
    encodedData.append("abb", formData.abb);

    try {
      const response = await fetch(
        `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/appointments/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-API-KEY": APIKey,
          },
          body: encodedData.toString(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.Error);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage("Success! Appointment Booked");
      setFormData({
        year: "",
        date: "",
        time: "",
        abb: "",
      });
    } catch (error) {
      console.error("Error updating appointment details:", error);
      setMessage("Failed to update appointment details.");
    }
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
    setErrors({});
    setMessage(null);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!teacher) {
    return <div className="container mx-auto p-4">No teacher data found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {teacher.image && (
            <img
              src={`data:image/jpeg;base64,${teacher.image}`}
              alt={teacher.name}
              className="w-48 h-48 rounded-full shadow-md object-cover"
            />
          )}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold text-gray-800">{teacher.name || "No name available"}</h1>
            <p className="text-lg text-gray-600">{teacher.subject || "No subject available"}</p>
            <p className="text-gray-500">{teacher.email || "No email available"}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="year"
              placeholder="Enter year (e.g., 2025)"
              value={formData.year}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
            <input
              type="text"
              name="time"
              placeholder="Enter time (HH:MM:SS)"
              value={formData.time}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.time && <span className="text-red-500 text-sm">{errors.time}</span>}
            <input
              type="text"
              name="abb"
              placeholder="Enter abbreviation (AM/PM)"
              value={formData.abb}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.abb && <span className="text-red-500 text-sm">{errors.abb}</span>}
          </div>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600 transition"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </>
  );
}
